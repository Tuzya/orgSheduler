import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getShedule } from '../../libs/groups-splitter';

import './GroupEditForm.css';
import useInput from '../../hooks/input-hook';
import { getSchemas } from '../../libs/reqFunct/Schemas';
import { groupTypes, MAX_NUMS_PHASES } from '../../consts';
import { putGroup } from '../../libs/reqFunct/groups';
import {delGroup, getGroups} from '../../store/camp/actions';

export default function GroupEditForm() {
  const history = useHistory();
  const { groupId } = useParams();
  const dispatch = useDispatch();

  const { value: name, bind: bindName, setValue: setName } = useInput('');
  const { value: phase, bind: bindPhase, setValue: setPhase } = useInput('');
  const { value: students, bind: bindStudents, setValue: setStudents } = useInput('');
  const { value: shedule, bind: bindShedule, setValue: setShedule } = useInput([], 'json');
  const { value: groupType, setValue: setGroupType } = useInput(false);
  const [isLoad, setLoad] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      setLoad(true);
      try {
        const group = await (await fetch(`/api/groups/${groupId}`)).json();
        setName(group.name);
        setPhase(group.phase);
        setGroupType(group.groupType);
        setStudents(String(group.students));
        setShedule(JSON.stringify(group.shedule, '', 4));
      } catch (e) {
        console.error('Load error group', e.message);
        alert(`Load error group. ${e.message}`);
      } finally {
        setLoad(false);
      }
    })();
  }, [groupId, setName, setPhase, setShedule, setStudents, setGroupType]);

  const updateGroup = async (event) => {
    event.preventDefault();
    const res = await putGroup(
      //todo try-catch
      name,
      phase,
      groupType,
      students.split(/ *, */g),
      JSON.parse(shedule),
      groupId
    );
    if (res?.message === 'ok') {
      await dispatch(getGroups());
      return history.push(`/groups/${groupId}`);
    }
    else alert(`Что то пошло не так... ${res.err}`);
  };

  const regenerateSchedule = async (event) => {
    setLoad(true);
    event.preventDefault();
    const studentsArr = students.split(/ *, */g);

    const schemas = await getSchemas(phase);
    if (schemas) {
      const generatedShedule = getShedule(
        studentsArr,
        undefined,
        groupType === groupTypes.online,
        phase,
        schemas,
        true
      );
      setShedule(JSON.stringify(generatedShedule, '', 4));
    }
    setLoad(false);
  };

  const deleteGroup = async (event) => {
    event.preventDefault();
    if (!window.confirm(`Удалить группу ${name}?`)) return;
    try {
      const response = await fetch(`/api/groups/${groupId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      });
      if (response.status === 200) {
        await dispatch(delGroup(groupId));
        history.push('/groups');
      } else alert(`Error while delete: ${response.status}`);
    } catch (e) {
      console.log('Error while delete:', e.message);
      alert(`Error while delete: ${e.message}`);
    }
  };

  const handleChange = ({ target }) => {
    setGroupType(target.value);
  };

  return isLoad ? (
    <div className="spinner" />
  ) : (
    <form name="editGroup" onSubmit={updateGroup}>
      <div className="input-field col s12">
        <input id="Groupname" type="text" {...bindName} placeholder="Groupname" />
        <label htmlFor="Groupname">Groupname</label>
      </div>
      <input
        type="number"
        {...bindPhase}
        placeholder="Phase"
        min="1"
        max={MAX_NUMS_PHASES.toString()}
      />
      <input type="text" {...bindStudents} placeholder="Students" />
      <div className="input-field" style={{ minWidth: '300px' }}>
        <select className="browser-default" onChange={handleChange} value={groupType}>
          {Object.keys(groupTypes).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <button type="button" className="btn" disabled={isLoad} onClick={regenerateSchedule}>
        generate pairs by scheme
      </button>
      <textarea name="schedule" {...bindShedule} disabled={isLoad} placeholder="Shedule" />
      <button type="submit" className="btn" disabled={isLoad}>
        Update
      </button>
      <button type="button" className="btn btn-danger" disabled={isLoad} onClick={deleteGroup}>
        DELETE
      </button>
    </form>
  );
}
