// const randomInteger = (min, max) =>
//   Math.round(min - 0.5 + Math.random() * (max - min + 1));
//
// const randomize = (arr) => {
//   let i, j, k;
//   const N = arr.length;
//   for (i = 0; i < N; i++) {
//     j = randomInteger(0, N - 1);
//     k = (arr[i].length + arr[j].length) % (N - i);
//     [arr[i], arr[k + i]] = [arr[k + i], arr[i]];
//   }
//   return arr;
// };
//
// //console.log(randomize(['1dfgdg','2dfgd','3fd','4dfg','5f','6dfg','7']));
//
// const shedule = {
//   w1: {
//     mon1: { pairs: ['Alex', 'Lena', 'Petya', 'Slava', 'Jenya', 'ZZZ'] },
//     tue1: { groups: ['Alex', 'Lena', 'Petya', 'Slava', 'Jenya', 'ZZZ'] },
//   },
//   w2: {
//     mon2: { groups: ['Alex', 'Lena', 'Petya', 'Slava', 'Jenya', 'ZZZ'] },
//     tue2: { pairs: ['Alex', 'Lena', 'Petya', 'Slava', 'Jenya', 'ZZZ'] },
//   },
// };
//
// const pairs = (arr, peoplePerGroup) => {
//   return arr.reduce((result, value, index, array) => {
//     if (index % peoplePerGroup === 0)
//       result.push(array.slice(index, index + peoplePerGroup));
//     return result;
//   }, []).map((pair)=>pair.join(' - '));
// };
//
// const res = Object.keys(shedule).map((week) => {
//   return (
//     week +
//     " " +
//     Object.keys(shedule[week]).map((day) => {
//       return (
//         day +
//         " " +
//         Object.keys(shedule[week][day]).map((people) => {
//           return pairs(shedule[week][day][people], 3)
//
//         })
//       );
//     })
//   );
// });
//
// console.log('>>', res);
//
// const evened = (arr) => {
//   // if(arr.length % 2) return arr;
//   arr.push(7);
//   console.log(arr);
//   return;
// };
//
// // console.log(">>>>", evened([1, 2, 3]));

 function q(N, K) {
   let m = (N+K-1)/K;
   let x = N - (K-1)*m; // Number of "full" lists
   let y = K*m - N;     // Number of off-by-one lists
   console.log(x,y)
 }



  q(3, 3);
  q(4, 3);
  q(5, 3);
  q(10, 3);
