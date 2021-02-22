import React from "react";

import "./Schema.css";
import useInput from "../../hooks/input-hook";
import {DAYS, GROUPS, MAX_NUMS_PHASES, schemaInit} from "../../consts";
import LinearLoader from '../Loader/LinearLoader';
import {getSchemas, putSchemas} from "../../libs/reqFunct/Schemas";

export default function Schema() {

  const [schemas, setSchemas] = React.useState(schemaInit);
  const [isLoad, setLoad] = React.useState(true);
  const { value: online, setValue: setOnline } = useInput(false);
  const { value: phase, setValue: setPhase } = useInput("1");

  React.useEffect(() => {
    (async () => {
      setLoad(true);
      const schemas = await getSchemas(phase);
      if (schemas) setSchemas((state) => ({ ...state, ...schemas }));
      setLoad(false);
    })();
  }, [phase]);

  const generateSchema = async (event, key, schema, phase) => {
    event.preventDefault();
    setLoad(true);
    const res = await putSchemas(key, schema, phase);
    setLoad(false);
    if (res?.ok)
      alert(`${key === "offline" ? "Оффлайн" : "Онлайн"} схема обнавленна...`);
    else alert("Что то пошло не так...");
  };

  const setSchemasHandler = (week, day, key, people) => {
    setSchemas((state) => ({
      ...state,
      [key]: {
        ...state[key],
        [week]: { ...state[key][week], [day]: people },
      },
    }));
  };


  let line; (online) ? line = "online" : line = "offline";
  const weeks = Object.keys(schemas[line]);
  // const weeks = ['w1', 'w2', 'w3', 'w4'];
  const phases = [...Array(MAX_NUMS_PHASES).keys()].map(x => (++x).toString());


  return (
    <form
      name="radioGroup"
      onSubmit={(e) => generateSchema(e, line, schemas[line], phase)}
    >
      <div className="wrap">
        {weeks.map((week) => (
          <div key={week}>
            <b>{week}</b>
            {DAYS.map((day) => (
              <div key={day} >
                <p>
                  <b>{day}</b>
                </p>
                {Object.keys(GROUPS).map((group, i) => (
                  <label key={i}>
                    <input
                      name={day + week}
                      type="radio"
                      disabled={isLoad}
                      checked={
                        schemas[line][week] &&
                        schemas[line][week][day] === GROUPS[group]
                      }
                      onChange={() => {
                        setSchemasHandler(week, day, line, GROUPS[group]);
                      }}
                    />
                    <span>{group}</span>
                  <br/>
                  </label>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="input-field" style={{minWidth: '300px'}}>
        <select
          className="browser-default"
          onChange={(e) => {
            setPhase(e.target.value);
          }}
        >
          {phases.map((phaseNum) => <option key={phaseNum} value={phaseNum}>Phase {phaseNum}</option>)}
        </select>
      </div>
      <div style={{ textAlign: "center" }}>
        <label>
          <input
            type="checkbox"
            onChange={(e) => setOnline(e.target.checked)}
          />
          <span>Онлайн</span>
        </label>
        <button type="submit" className="btn waves-effect waves-light" disabled={isLoad}>
          Save {line} scheme
        </button>
      </div>
      {isLoad && <LinearLoader/>}
    </form>
  );
}
