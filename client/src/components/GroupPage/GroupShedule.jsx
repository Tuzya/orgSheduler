import React from "react";
import {DAYTORU, GROUPS, PEOPLE_PER_GR, PEOPLE_PER_PAIR} from "../../consts";

export default function GroupSchedule({shedule = []}) {

  const pairs = (group, people) => {
    let peoplePerGroup = PEOPLE_PER_PAIR;
    let groupC = [...group];
    let groupIndex = 0;
    let groupsCount = groupC.length / 2;
    const res = [];
    let corrInd = 0
    if (people === GROUPS.solo) return [["Solo"]];
    if (people === GROUPS.groups) {
      groupC = group.filter((person) => person !== "Solo");
      groupIndex = groupC.length % PEOPLE_PER_GR;
      groupsCount = Math.trunc(groupC.length / PEOPLE_PER_GR);
      peoplePerGroup = PEOPLE_PER_GR;
    }
    for (let i = 0; i < groupsCount; i++) {
      if (groupIndex === 1 && i === groupsCount - 1) {
        res.push(groupC.slice(i * peoplePerGroup, (i * peoplePerGroup) + peoplePerGroup + 1));
        continue;
      }
      if (groupIndex === 2 && (i === groupsCount - 2 || i === groupsCount - 1)) {
        res.push(groupC.slice(i * peoplePerGroup - corrInd, (i * peoplePerGroup) + peoplePerGroup + 1));
        peoplePerGroup = PEOPLE_PER_GR + 1;
        corrInd = 1;
        continue;
      }
      res.push(groupC.slice(i * peoplePerGroup, (i * peoplePerGroup) + peoplePerGroup));
    }
    return res;
    //   return groupC.reduce((result, value, index, array) => {
    //       if(groupIndex === 1 && index === 0)
    //     if (index % peoplePerGroup === 0)
    //       result.push(array.slice(index, index + peoplePerGroup));
    //     return result;
    //   }, []);
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
                  pairs(shedule[week][day][people], people).map((pair, i) => (
                    <li key={i}>{pair.join(" - ")}</li>
                  ))
                )}
              </ul>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
