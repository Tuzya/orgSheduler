import React from "react";
import {DAYTORU, GROUPS, PEOPLE_PER_GR, PEOPLE_PER_PAIR} from "../../consts";

export default function GroupSchedule({shedule = []}) {

  const pairs = (group, people) => {
    let peoplePerGroup = PEOPLE_PER_PAIR;
    let groupC = [...group];
    let groupsCount = groupC.length / 2; //кол-во пар
    const res = [];
    if (people === GROUPS.solo) return [['Solo']];
    if (people === GROUPS.groups) {
      groupC = group.filter((person) => person !== 'Solo');
      peoplePerGroup = PEOPLE_PER_GR;
      if (groupC.length > 21) peoplePerGroup++;
      groupsCount = Math.floor(groupC.length / peoplePerGroup) || 1; // кол-во групп.
    }

    for (let i = 0; i < groupsCount; i++) res.push([]);
    for (let i = 0; i < groupC.length;)
      for (let j = 0; j < groupsCount; j++) {
        if (people === GROUPS.pairs) {
          res[j].push(groupC[i], groupC[i + 1])
          i += 2;
        } else {
          if (!groupC[i]) return res;
          res[j].push(groupC[i])
          i += 1;
        }
      }
    return res;
  };

  return (
    <div className="group-schedule">
      {Object.keys(shedule).map((week) => (
        <div key={week} className="group-schedule-week">
          <div className="group-schedule-week-content">
            <div className="week-num">Неделя {week.replace("w", '')}</div>
            {Object.keys(shedule[week]).map((day) => (
              <ul key={day}>
                <b>{DAYTORU[day]}</b>
                {Object.keys(shedule[week][day]).map((people) =>
                  pairs(shedule[week][day][people], people).map((pair, i) =>
                    <li key={i}>{pair.join(" --- ")}</li>
                  )
                )}
              </ul>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
