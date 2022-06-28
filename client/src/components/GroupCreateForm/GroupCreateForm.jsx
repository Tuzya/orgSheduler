import React from 'react';
import { useHistory } from 'react-router-dom';
import { getShedule } from '../../libs/groups-splitter';
import './GroupCreateForm.css';
import useInput from '../../hooks/input-hook';
import { getSchemas } from '../../libs/reqFunct/Schemas';
import { MAX_NUMS_PHASES } from '../../consts';
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
  const { value: online, setValue: setOnline } = useInput(false);

  const generateSchedule = async (event) => {
    event.preventDefault();
    if(!students || !name || !phase ) return;
    const studentsArr = students.split(/ *, */g);
    // const generatedSchedule = getSchedule(studentsArr, undefined, !!online);

    setLoad(true);
    const schemas = await getSchemas(phase);
    if (!schemas?.[online ? 'online' : "offline"]) {
      alert(
        `Схема для фазы ${phase} ${
          online ? 'онлайн' : 'оффлайн'
        } группы не существует.\nСперва создайте эту схему.`
      );
      setLoad(false);
      history.push('/groups/schema');
      return;
    }
    const generatedShedule = getShedule(
      studentsArr,
      4,
      !!online,
      phase,
      schemas,
      false
    );
    const { _id: fetchedGroupId } = await getGroupId(
      name,
      phase,
      online,
      studentsArr,
      generatedShedule
    );
    setGroupId(fetchedGroupId);
    // setSchedule(generatedSchedule); // TODO: check if is is ok
    setLoad(false);
    history.push(`/groups/${fetchedGroupId}`);
  };

  const handleChange = ({ target }) => {
    setOnline(target.checked);
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
      <label>
        <input type="checkbox" onChange={handleChange} />
        <span>Онлайн</span>
      </label>
      <button type="submit" className="btn" disabled={isLoad}>
        Create
      </button>
      {isLoad && <LinearLoader prColor={'#3594DA'} indColor={'#4b22d4'} />}
    </form>
  );
}
