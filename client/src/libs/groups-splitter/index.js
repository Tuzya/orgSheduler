// import getPairs from './split-in-pairs';
// import getTeams from "./split-in-teams";
import { GROUPS, DAYS } from '../../consts';
import fisherYatesShuffle from './fisherYatesShuffles';

// function* circle(arr) {
//   while (true) {
//     const el = arr.shift();
//     arr.push(el);
//     yield el;
//   }
// }

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

/**
 * @typedef {'mon' | 'tue' | 'wed' | 'thu' | 'fri'} day
 * @typedef {'solo' | 'groups' | 'pairs'} grType
 */

/**
 * @typedef {Object} Shedule
 * @property {grType} mon
 * @property {grType} tue
 * @property {grType} wed
 * @property {grType} thu
 * @property {grType} fri
 */

/**
 * @typedef {Object} shedule
 * @property {Shedule} w1
 * @property {Shedule} w2
 * @property {Shedule} w3
 * @property {Shedule} w4
 */

/**
 * @param {string[]} students - An array of student names
 * @param {undefined} weeksCount - number?
 * @param {boolean} isOnline  - boolean
 * @param {1 | 2 | 3} phase - 1 | 2 | 3
 * @param {{offline: shedule, online: shedule}} schemas - { offline: shedule, online: shedule }
 * @param {boolean} shouldShuffle - boolean
 */
// eslint-disable-next-line import/prefer-default-export
export function getShedule(students, weeksCount, isOnline = false, phase, schemas, shouldShuffle) {
  console.log('Invoking getShedule', students, weeksCount, isOnline, phase, schemas, shouldShuffle);
  // const gotPairs = getPairs(students, shouldShuffle);
  // console.log('gotPairs:', gotPairs);

  // const pairs = circle(gotPairs);
  // console.log(pairs);
  let week;
  let day;
  let grType;
  let prevGrType;
  let index;
  const key = isOnline ? 'online' : 'offline';
  const shedule = {};
  for (week of Object.keys(schemas[key])) {
    shedule[week] = {};
    for (day of Object.keys(schemas[key][week])) {
      index = DAYS.indexOf(day);

      if (index !== 0) prevGrType = schemas[key][week][DAYS[index - 1]];
      grType = schemas[key][week][day]; // solo, pair or group

      // if (students.length === 8 && day === 'wed' && week === 'w4' && isOnline)
      //   //todo повторяются группы в онлайн ф1 w4 wed. костылечек чтоб не повторялис)
      //   pair = pairs.next().value;

      if (grType === GROUPS.solo) shedule[week][day] = { [grType]: ['Solo'] };
      else if (grType === GROUPS.groups && prevGrType === GROUPS.groups) {
        shedule[week][day] = { [grType]: fisherYatesShuffle(students) };
      } else {
        // pair = pairs.next().value;
        // console.log('pair:', pair, 'day:', day, 'week:', week);
        shedule[week][day] = { [grType]: fisherYatesShuffle(students) };
      }
    }
  }
  console.log('End result:', shedule);
  // shedule ->  {w1: { [day]: grType}, w2: { [day]: grType}, w3: { [day]: grType} }
  return shedule;
}
