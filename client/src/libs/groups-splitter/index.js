import getPairs from './split-in-pairs';
// import getTeams from "./split-in-teams";
import { GROUPS, DAYS } from '../../consts';

function* circle(arr) {
  while (true) {
    const el = arr.shift();
    arr.push(el);
    yield el;
  }
}

// export default function getSchedule(students, weeksCount = 3, online = false) {
//   const pairs = circle(getPairs(students));
//   const teams = getTeams(students, weeksCount);
//   const schedule = [];
//   teams.forEach((team) => {
//     schedule.push(pairs.next().value);
//     schedule.push(pairs.next().value);
//     if (online) schedule.push(pairs.next().value);
//     schedule.push(team);
//   });
//   return schedule;
// }

export function getShedule(
  students,
  weeksCount,
  isOnline = false,
  phase,
  schemas,
  shouldShuffle
) {
  const pairs = circle(getPairs(students, shouldShuffle));
  let week, day, grType, prevGrType, index, pair;
  const key = isOnline ? 'online' : 'offline';
  const shedule = {};
  for (week of Object.keys(schemas[key])) {
    shedule[week] = {};
    for (day of Object.keys(schemas[key][week])) {
      index = DAYS.indexOf(day);

      if (index !== 0) prevGrType = schemas[key][week][DAYS[index - 1]];
      grType = schemas[key][week][day]; //solo, pair or group

      if (students.length === 8 && day === 'wed' && week === 'w4' && isOnline) //todo повторяются группы в онлайн ф1 w4 wed. костылечек чтоб не повторялис)
        pair = pairs.next().value;

      if (grType === GROUPS.solo) shedule[week][day] = { [grType]: ['Solo'] };
      else if (grType === GROUPS.groups && prevGrType === GROUPS.groups) {
        shedule[week][day] = { [grType]: pair };
      } else {
        pair = pairs.next().value;
        shedule[week][day] = { [grType]: pair };
      }
    }
  }
  return shedule;
}
