export default function cutNames(firstAndSecondName) {
  if (!firstAndSecondName) return 'Solo';
  if (!firstAndSecondName?.includes(' ')) return firstAndSecondName;
  const [firstName, secondName] = firstAndSecondName.split(' ');
  const reducedSecondName = `${secondName[0].toUpperCase()}-${secondName.split('').at(-1)}`;
  return `${firstName} ${reducedSecondName}`;
}
