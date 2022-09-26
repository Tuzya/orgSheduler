import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import './GroupCreateForm.css';
import LinearLoader from '../../components/Loader/LinearLoader';
import useInput from '../../hooks/input-hook';
import { getSchemas } from '../../libs/reqFunct/Schemas';
import { getShedule } from '../../libs/groups-splitter';
import { groupTypes, MAX_NUMS_PHASES } from '../../consts';
import { createGroup, addGroup } from '../../store/camp/actions';

export default function GroupCreateForm() {
  const history = useHistory();
  const [isLoad, setLoad] = React.useState(false);
  const { setValue: setGroupId } = useInput('');
  const { value: name, bind: bindName } = useInput(sessionStorage.getItem('name') || '');
  const { value: phase, bind: bindPhase } = useInput(sessionStorage.getItem('phase') || '');
  const { value: students, bind: bindStudents } = useInput(
    sessionStorage.getItem('students') || ''
  );
  // const { setValue: setSchedule } = useInput([]);
  const { value: groupType, setValue: setGroupType } = useInput('online');
  const dispatch = useDispatch();

  const generateSchedule = async (event) => {
    event.preventDefault();
    if (!students || !name || !phase) return;
    const studentsArr = students.split(/ *, */g);

    setLoad(true);
    const schemas = await getSchemas(phase);
    const online = groupType === groupTypes.online;
    if (!schemas?.[online ? 'online' : 'offline']) {
      alert(
        `Схема для фазы ${phase} ${
          online ? 'онлайн' : 'оффлайн'
        } группы не существует.\nСперва создайте эту схему.`
      );
      setLoad(false);
      sessionStorage.setItem('name', name);
      sessionStorage.setItem('phase', phase);
      sessionStorage.setItem('students', students);
      return history.push('/groups/schema');
    }
    const generatedShedule = getShedule(
      studentsArr,
      4,
      groupType === groupTypes.online,
      phase,
      schemas,
      false
    );
    const group = await createGroup(name, phase, groupType, studentsArr, generatedShedule);

    setGroupId(group._id);
    dispatch(addGroup(group));
    // setSchedule(generatedSchedule); // TODO: check if is is ok
    setLoad(false);
    sessionStorage.clear();
    return history.push(`/groups/${group._id}`);
  };

  const handleChange = ({ target }) => {
    setGroupType(target.value);
  };
  return (
    <form name="newGroup" onSubmit={generateSchedule}>
      <input type="text" {...bindName} placeholder="NameYearGroupType" />
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
      <button type="submit" className="btn" disabled={isLoad}>
        Create
      </button>
      {isLoad && <LinearLoader prColor={'#3594DA'} indColor={'#4b22d4'} />}
    </form>
  );
}