import React from 'react';
import { useHistory, useParams } from 'react-router';
import { getShedule } from '../../libs/groups-splitter';

import './GroupEditForm.css';
import useInput from '../../hooks/input-hook';
import { getSchemas } from '../../libs/reqFunct/Schemas';
import { MAX_NUMS_PHASES } from '../../consts';
import { putGroup } from '../../libs/reqFunct/groups';

export default function GroupEditForm() {
  const history = useHistory();
  const { groupId } = useParams();

  const { value: name, bind: bindName, setValue: setName } = useInput('');
  const { value: phase, bind: bindPhase, setValue: setPhase } = useInput('');
  const {
    value: students,
    bind: bindStudents,
    setValue: setStudents,
  } = useInput('');
  const {
    value: shedule,
    bind: bindShedule,
    setValue: setShedule,
  } = useInput([], 'json');
  const { value: online, setValue: setOnline } = useInput(false);
  const [isLoad, setLoad] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      setLoad(true);
      try {
        const group = await (await fetch(`/api/groups/${groupId}`)).json();
        setName(group.name);
        setPhase(group.phase);
        setOnline(group.online);
        setStudents(String(group.students));
        setShedule(JSON.stringify(group.shedule, '', 4));
      } catch (e) {
        console.error('Load error group', e.message);
        alert(`Load error group. ${e.message}`);
      } finally {
        setLoad(false);
      }
    })();
  }, [groupId, setName, setPhase, setShedule, setStudents, setOnline]);

  const updateGroup = async (event) => {
    event.preventDefault();
    const res = await putGroup( //todo try-catch
      name,
      phase,
      online,
      students.split(/ *, */g),
      JSON.parse(shedule),
      groupId
    );
    if (res?.message === 'ok') history.push(`/groups/${groupId}`);
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
        !!online,
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
          Accept: 'application/json',
        },
      });
      if (response.status === 200) history.push('/groups');
      else alert(`Error while delete: ${response.status}`);
    } catch (e) {
      console.log('Error while delete:', e.message);
      alert(`Error while delete: ${e.message}`);
    }
  };

  const handleChange = ({ target }) => {
    setOnline(target.checked);
  };

  return isLoad ? (
    <div className="spinner" />
  ) : (
    <form name="editGroup" onSubmit={updateGroup}>
      <input type="text" {...bindName} placeholder="Groupname" />
      <input
        type="number"
        {...bindPhase}
        placeholder="Phase"
        min="1"
        max={MAX_NUMS_PHASES.toString()}
      />
      <input type="text" {...bindStudents} placeholder="Students" />
      <label>
        <input
          name="online"
          type="checkbox"
          checked={online}
          onChange={handleChange}
        />
        <span>Онлайн</span>
      </label>
      <button
        type="button"
        className="btn"
        disabled={isLoad}
        onClick={regenerateSchedule}
      >
        generate pairs by scheme
      </button>
      <textarea
        name="schedule"
        {...bindShedule}
        disabled={isLoad}
        placeholder="Shedule"
      />
      <button type="submit" className="btn" disabled={isLoad}>
        Update
      </button>
      <button
        type="button"
        className="btn btn-danger"
        disabled={isLoad}
        onClick={deleteGroup}
      >
        DELETE
      </button>
    </form>
  );
}
