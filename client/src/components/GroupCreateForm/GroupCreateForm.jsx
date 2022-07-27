import React from 'react';
import { useHistory } from 'react-router-dom';
import { getShedule } from '../../libs/groups-splitter';
import './GroupCreateForm.css';
import useInput from '../../hooks/input-hook';
import { getSchemas } from '../../libs/reqFunct/Schemas';
import {groupTypes, MAX_NUMS_PHASES} from '../../consts';
import LinearLoader from '../Loader/LinearLoader';
import { getGroupId } from '../../libs/reqFunct/groups';

export default function GroupCreateForm() {
  const history = useHistory();

  const [isLoad, setLoad] = React.useState(false);
  const { setValue: setGroupId } = useInput('');
  const { value: name, bind: bindName } = useInput('');
  const { value: phase, bind: bindPhase } = useInput('');
  const { value: students, bind: bindStudents } = useInput('');
  // const { setValue: setSchedule } = useInput([]);
  const { value: groupType, setValue: setOnline } = useInput(false);
console.log('file-GroupCreateForm.jsx groupType:', groupType);
  const generateSchedule = async (event) => {
    event.preventDefault();
    if(!students || !name || !phase ) return;
    const studentsArr = students.split(/ *, */g);
    // const generatedSchedule = getSchedule(studentsArr, undefined, !!online);

    setLoad(true);
    const schemas = await getSchemas(phase);
    const online = groupType === groupTypes.online
    if (!schemas?.[online ? 'online' : "offline"]) {
      alert(
        `Схема для фазы ${phase} ${
          online ? 'онлайн' : 'оффлайн'
        } группы не существует.\nСперва создайте эту схему.`
      );
      setLoad(false);
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
    const { _id: fetchedGroupId } = await getGroupId(
      name,
      phase,
      groupType,
      studentsArr,
      generatedShedule
    );
    setGroupId(fetchedGroupId);
    // setSchedule(generatedSchedule); // TODO: check if is is ok
    setLoad(false);
    return history.push(`/groups/${fetchedGroupId}`);
  };

  const handleChange = ({ target }) => {
    setOnline(target.value);
  };
  return (
    <form name="newGroup" onSubmit={generateSchedule}>
      <input type="text" {...bindName} placeholder="Groupname" />
      <input
        type="number"
        {...bindPhase}
        placeholder="Phase"
        min="1"
        max={MAX_NUMS_PHASES.toString()}
      />
      <input type="text" {...bindStudents} placeholder="Students" />
      <div className="input-field" style={{ minWidth: '300px' }}>
        <select
          className="browser-default"
          onChange={handleChange}
          value={groupType}
        >
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
