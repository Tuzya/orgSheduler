import shuffle from './shuffle';

function splitInGroups(students, groupSize = 3) {
  const shuffledStudents = shuffle(students);
  const groups = [];
  while (shuffledStudents.length) {
    const chunk = shuffledStudents.splice(0, groupSize);
    // Если одна из групп оказалась очень маленькой -
    // раскидываем её студентов по другим группам.
    if (chunk.length < groupSize / 2) {
      let groupIndex = 0;
      while (chunk.length) {
        groups[groupIndex] = [];
        groups[groupIndex].push(chunk.pop());
        groupIndex += 1;
      }
    } else {
      groups.push(chunk);
    }
  }
  return groups;
}

export default function getGroups(input, times = 4) {
  const result = [];
  let i = 0;
  while (i < times) {
    result.push(splitInGroups(input));
    i += 1;
  }
  return result;
}
