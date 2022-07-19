import React from 'react';
import './Schema.css';
import { daysCR } from '../../consts';
import { updAllGroups } from '../../libs/reqFunct/groups';
import { useHistory } from 'react-router';
import LinearLoader from '../Loader/LinearLoader';

export default function CodeReviewSchema() {
  const [groups, setGroups] = React.useState([]);
  const [isLoad, setLoad] = React.useState(false);

  const history = useHistory();

  React.useEffect(() => {
    (async () => {
      setLoad(true);
      try {
        const fetchedGroups = await (await fetch('/api/groups/')).json();
        let schemaCRInitGroups = fetchedGroups.map((group) => {
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
      const res = await updAllGroups(groups);
      if (res?.message === 'ok') {
        setLoad(false);
        alert('Code Review Schema updated.');
        return history.push('/');
      } else alert(`Что то пошло не так... ${res?.err}`);
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
        <form>
          <div className="row">
            <div className="input-field col s12">
              <input id="teachers" type="text" className="validate" />
              <label htmlFor="teachers">Teachers</label>
            </div>
            <div className="input-field col s12">
              <input id="timegaps" type="text" className="validate" />
              <label htmlFor="timegaps">Time Gaps</label>
            </div>
          </div>
          {groups.map((group) => (
            <div key={group.name}>
              <div>
                <span style={{ marginLeft: 25 }}>
                  {`${group.phase} Ph ${group.name} ${group.students.length} st.`}
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
          <button
            type="submit"
            className="btn waves-effect waves-light"
            disabled={isLoad}
            onClick={(e) => setCRSchemasToGroups(e, groups)}
          >
            Save CodeReview scheme
          </button>
        </form>
      </div>

      {isLoad && <LinearLoader />}
    </div>
  );
}
