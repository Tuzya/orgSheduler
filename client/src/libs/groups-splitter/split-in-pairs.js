import shuffle from './shuffle';

const DUMMY = -1;
// returns an array of round representations (array of player pairs).
// http://en.wikipedia.org/wiki/Round-robin_tournament#Scheduling_algorithm
export default function getPairs(students, shouldShuffle = true) {
  let n; // num players
  const rs = []; // rs = round array
  let ps = [...students];
  if (shouldShuffle) ps = shuffle(students);
  if (ps.length % 2 === 1) ps.push('Solo');
  n = ps.length;
  if (!ps) {
    ps = [];
    for (let k = 1; k <= n; k += 1) {
      ps.push(k);
    }
  } else {
    ps = ps.slice();
  }

  if (n % 2 === 1) {
    ps.push(DUMMY); // so we can match algorithm for even numbers
    n += 1;
  }
  for (let j = 0; j < n - 1; j += 1) {
    rs[j] = []; // create inner match array for round j
    for (let i = 0; i < n / 2; i += 1) {
      if (ps[i] !== DUMMY && ps[n - 1 - i] !== DUMMY) {
        rs[j].push(ps[i]); // insert pair as a match
        rs[j].push(ps[n - 1 - i]);
      }
    }
    ps.splice(1, 0, ps.pop()); // permutate for next round
  }
  return rs;
}
