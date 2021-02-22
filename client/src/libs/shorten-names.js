
/**
 * Преобразует ФИО к объекту
 * @param {string} name ФИО
 */
function parseName(name) {
  const str = name.trim().replace(/\s+/g, ' ');
  const parts = str.split(' ');
  // UNSTABLE: TODO: код не всегда корректно определяет, где фамилия
  // const lastNameRx = new RegExp('.+(ов|ова|ин|ина|ий|ая|ич|ев|ева)$');
  // const firstPartIsLastName = lastNameRx.test(parts[0]) && parts[0] > parts[1];
  // const secondPartIsLastName = lastNameRx.test(parts[1]);
  // if (firstPartIsLastName && !secondPartIsLastName) {
  //   [parts[0], parts[1]] = [parts[1], parts[0]];
  // }
  return {
    firstName: parts[0],
    lastName: parts[1],
  };
}

/**
 * Находит минимальную подстроку отличную от других подстрок
 * @param {array} words Массив строк
 */
function minimizeWords(words) {
  let unresolved = words.slice();
  const results = [];
  let index = 0;

  function groupReducer(acc, unresolvedItem) {
    const prefix = unresolvedItem.slice(0, index + 1);
    if (!acc[prefix]) {
      acc[prefix] = [];
    }
    acc[prefix].push(unresolvedItem);
    return acc;
  }

  function splitUnresolved(group) {
    if (group.length === 1) {
      results.push(group[0].slice(0, index + 1));
    } else {
      unresolved = unresolved.concat(group);
    }
  }

  while (unresolved.length) {
    const groups = unresolved.reduce(groupReducer, {});
    unresolved = [];
    Object.values(groups).forEach(splitUnresolved);
    if (!unresolved.length) {
      break;
    }
    index += 1;
  }
  // Отдаём в том же порядке
  return words
    .map((word) => results.find((result) => word.indexOf(result) === 0));
}

/**
 * Формирует короткие имена
 * @param {object} names Объекты имён
 */
function shortenNames(names) {
  // Карта имён по полному имени
  names.fullNameMap = {};
  // Составляем карту повторяющихся имен
  const namesMap = names.reduce((acc, name) => {
    if (!acc[name.firstName]) {
      acc[name.firstName] = {
        lastNames: [],
        names: [],
      };
    }
    acc[name.firstName].lastNames.push(name.lastName);
    acc[name.firstName].names.push(name);
    return acc;
  }, {});
  // Сокращаем фамилиии
  Object.values(namesMap)
    .forEach((nameMap) => {
      if (nameMap.lastNames.length > 1) {
        const minLastNameLength = nameMap.lastNames
          .reduce(
            (min, name) => (name.length < min ? name.length : min),
            Number.POSITIVE_INFINITY,
          );
        // Находим минимальную базу всех фамилий
        const truncatedLastNames = nameMap.lastNames
          .map((name) => name.slice(0, minLastNameLength));
        // Находим самое короткое
        for (let i = 0; i < minLastNameLength; i += 1) {
          const sliced = truncatedLastNames
            .map((x) => x.slice(0, i + 1));
          const differentCount = Object.keys(sliced.reduce((acc, x) => {
            acc[x] = true;
            return acc;
          }, {})).length;
          if (differentCount === sliced.length) {
            // Укорачиваем до минимально различных подстрок
            const minimized = minimizeWords(sliced);
            nameMap.names.forEach((name, index) => {
              name.short = `${name.firstName} ${minimized[index]}`;
              names.fullNameMap[`${name.firstName} ${name.lastName}`] = name;
            });
            break;
          }
        }
      } else {
        const current = nameMap.names[0];
        current.short = current.firstName;
        names.fullNameMap[`${current.firstName} ${current.lastName}`] = current;
      }
    });
  return names;
}

export default (names) => shortenNames(names.map(parseName));
