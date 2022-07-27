import React from 'react';
import './Schema.css';
import { daysCR, groupTypes } from '../../consts';
import { updAllGroups } from '../../libs/reqFunct/groups';
import { useHistory } from 'react-router';
import LinearLoader from '../Loader/LinearLoader';
import { getTeachersAndGaps, updateTeachersAndGaps } from '../../libs/reqFunct/teachersAndTimes';
import useInput from '../../hooks/input-hook';

export default function CodeReviewSchema() {
  const [groups, setGroups] = React.useState([]);
  const [isLoad, setLoad] = React.useState(false);
  console.log('file-CodeReviewSchema.jsx groups:', groups);

  const { value: groupType, setValue: setGrType } = useInput(groupTypes.online);
  const { value: teachers, bind: bindTeachers, setValue: setTeachers } = useInput('');
  const { value: timegaps, bind: bindTimegaps, setValue: setTimegaps } = useInput('');
  const history = useHistory();

  React.useEffect(() => {
    (async () => {
      setLoad(true);
      try {
        const fetchedGroups = await (await fetch('/api/groups/')).json();
        let schemaCRInitGroups = fetchedGroups?.map((group) => {
          if (!group.crshedule) group.crshedule = { crdays: { ...daysCR } };
          return group;
        });
        setGroups(schemaCRInitGroups);
      } catch (e) {
        console.error('Failed CodeReviewSchema', e.message);
      } finally {
        setLoad(false);
      }
    })();
  }, []);

  React.useEffect(() => {
    (async () => {
      setLoad(true);
      try {
        const teachersAndGaps = await getTeachersAndGaps(groupType);
        if (teachersAndGaps) {
          setTeachers(String(teachersAndGaps.teachers));
          setTimegaps(String(teachersAndGaps.timegaps));
        }
      } catch (e) {
        console.error('Failed to get teachers or timegaps', e.message);
      } finally {
        setLoad(false);
      }
    })();
  }, [groupType]);

  const setDaysAndGroup = (dayName, grName, isChecked) => {
    setGroups((state) => {
      return state.map((group) => {
        if (group.name === grName) {
          group.crshedule.crdays[dayName] = isChecked;
        }
        return group;
      });
    });
  };
  const setCRSchemasToGroups = async (event, groups) => {
    event.preventDefault();
    setLoad(true);
    try {
      const resGr = await updAllGroups(groups);
      const resTG = await updateTeachersAndGaps(
        teachers.split(/ *, */g),
        timegaps.split(/ *, */g),
        groupType
      );
      if (resGr?.message === 'ok' && resTG?.message === 'ok') {
        setLoad(false);
        alert('Code Review Schema updated.');
        return history.push('/');
      } else alert(`Что то пошло не так... ${resGr?.err + resTG?.err}`);
    } catch (err) {
      console.log('Error generateCRSchema', err.message);
    } finally {
      setLoad(false);
    }
  };

  // return null;
  return (
    <div>
      <h4>Code Review Schema</h4>
      <div className="wrap" style={{ minWidth: 450 }}>
        <form onSubmit={(e) => setCRSchemasToGroups(e, groups)}>
          <div className="row">
            <div className="input-field col s12">
              <input
                id="teachers"
                type="text"
                {...bindTeachers}
                className="validate"
                value={teachers}
              />
              <label htmlFor="teachers">Teachers</label>
            </div>
            <div className="input-field col s12">
              <input
                id="timegaps"
                type="text"
                {...bindTimegaps}
                className="validate"
                value={timegaps}
              />
              <label htmlFor="timegaps">Time Gaps</label>
            </div>
          </div>
          {groups
            .filter((group) => group.groupType === groupType)
            .map((group) => (
              <div key={group.name}>
                <div>
                  <span style={{ marginLeft: 25 }}>
                    {`${group.groupType} ${group.phase} Ph 
                    ${group.name} ${group.students.length} st.`}
                  </span>
                </div>

                <div style={{ marginBottom: 20, marginTop: 10 }}>
                  {Object.keys(group.crshedule.crdays).map((day) => (
                    <label key={day}>
                      <input
                        type="checkbox"
                        checked={group.crshedule.crdays[day]}
                        onChange={(e) => setDaysAndGroup(day, group.name, e.target.checked)}
                      />
                      <span style={{ marginLeft: 25 }}>{day}</span>
                    </label>
                  ))}
                  <div className="divider"> </div>
                </div>
              </div>
            ))}
          <div className="input-field" style={{ minWidth: '300px' }}>
            <select
              className="browser-default"
              onChange={(e) => {
                setGrType(e.target.value);
              }}
            >
              {Object.keys(groupTypes).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div style={{ textAlign: 'center' }}>
            <button type="submit" className="btn waves-effect waves-light" disabled={isLoad}>
              Save CodeReview scheme
            </button>
          </div>
        </form>
      </div>

      {isLoad && <LinearLoader />}
    </div>
  );
}
