import React from 'react';
import './Schema.css';
import { daysCR } from '../../consts';
import { getCRSchemas, putCRSchemas } from '../../libs/reqFunct/Schemas';

export default function CodeReviewSchema() {
  const [schemaCR, setCR] = React.useState([]);
  const [isLoad, setLoad] = React.useState(false);
  React.useEffect(() => {
    (async () => {
      setLoad(true);
      try {
        const fetchedGroups = await (await fetch('/api/groups/')).json();
        let schemaCRInit = fetchedGroups.map((group) => ({
          group: group,
          isChecked: false,
          days: { ...daysCR },
        }));
        const CRSchema = await getCRSchemas();
        if (fetchedGroups.length !== CRSchema.schema.length) {
          await putCRSchemas(schemaCRInit);
          setCR(schemaCRInit);
        } else {
          setCR(CRSchema.schema);
        }
      } catch (e) {
        console.error('Failed CodeReviewSchema', e.message);
      } finally {
        setLoad(false);
      }
    })();
  }, []);

  const setDaysAndGroup = (dayName, grName, isChecked) => {
    setCR((state) => {
      const daysAndGr = [...state];
      if (dayName)
        daysAndGr.find((grNdays) => grNdays.group.name === grName).days[
          dayName
        ] = isChecked;
      else
        daysAndGr.find((grNdays) => grNdays.group.name === grName).isChecked =
          isChecked;
      return daysAndGr;
    });
  };

  const generateCRSchema = async (event, schema) => {
    event.preventDefault();
    setLoad(true);
    try {
      const res = await putCRSchemas(schema);
      if (res?.message === 'ok') alert('Code Review Schema updated.');
      else alert(`Что то пошло не так... ${res?.err}`);
    } catch (err) {
      console.log('Error generateCRSchema', err.message);
    } finally {
      setLoad(false);
    }
  };

  return (
    <div>
      <h4>Code Review Schema</h4>
      <div className="wrap" style={{ minWidth: 450 }}>
        <form onSubmit={(e) => generateCRSchema(e, schemaCR)}>
          {schemaCR.map((grNdays) => (
            <div key={grNdays.group.name}>
              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={grNdays.isChecked}
                    onChange={(e) =>
                      setDaysAndGroup(
                        null,
                        grNdays.group.name,
                        e.target.checked
                      )
                    }
                  />
                  <span style={{ marginLeft: 25 }}>
                    {grNdays.group.phase +
                      'Ph ' +
                      grNdays.group.name +
                      ' ' +
                      grNdays.group.students.length +
                      'st.'}
                  </span>
                </label>
              </div>

              <div style={{ marginBottom: 20, marginTop: 10 }}>
                {Object.keys(grNdays.days).map((day) => (
                  <label key={day}>
                    <input
                      type="checkbox"
                      checked={grNdays.days[day]}
                      onChange={(e) =>
                        setDaysAndGroup(
                          day,
                          grNdays.group.name,
                          e.target.checked
                        )
                      }
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
          >
            Save CodeReview scheme
          </button>
        </form>
      </div>
    </div>
  );
}
