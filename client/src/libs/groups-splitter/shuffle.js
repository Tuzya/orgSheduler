export default function shuffle(arr) {
  const arrCopy = [...arr];
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    const randomElement = arrCopy.splice(
      [Math.floor(Math.random() * arrCopy.length)],
      1
    );
    result.push(randomElement[0]);
  }
  return result;
}

// export const isPairEqual = (prevPair = [], nextPair = []) => {
//   let length = prevPair.length;
//   if (prevPair.length === 0 && nextPair.length === 0) return true;
//   if (prevPair.length % 2 !== 0) {
//     if (prevPair[length - 1] === nextPair[length - 1]) return true;
//     --length;
//   }
//   for (let i = 1; i < length; i += 2) {
//     if (prevPair[i - 1] === nextPair[i - 1] && prevPair[i] === nextPair[i]) {
//       return true;
//     }
//   }
//   return false;
// };

// const randomInteger = (min, max) =>
//   Math.round(min - 0.5 + Math.random() * (max - min + 1));

// export const randomize = (arr = []) => {
//   let i, j, k;
//   const N = arr.length;
//   const arrC = [...arr];
//   for (i = 0; i < N; i++) {
//     j = randomInteger(0, N - 1);
//     k = (arrC[i].length + arrC[j].length) % (N - i);
//     [arrC[i], arrC[k + i]] = [arrC[k + i], arrC[i]];
//   }
//   return arrC;
// };

// export function shuffle2(array) {
//   for (let i = array.length - 1; i > 0; i--) {
//     let j = Math.floor(Math.random() * (i + 1));
//     [array[i], array[j]] = [array[j], array[i]];
//   }
//   return array;
// }

// export function* perMutation(s) {
//   if (s.length < 3) {
//     yield s;
//     if (s.length === 2) yield [s[1], s[0]];
//   } else {
//     for (let i = 0; i < s.length; i++) {
//       let h = s[i];
//       for (let t of perMutation([...s.slice(0, i), ...s.slice(i + 1)])) {
//         yield [...t, h]
//       }
//     }
//   }
// }


