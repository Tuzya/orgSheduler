export const isObjEmpty = (obj = {}) => Object.keys(obj).length === 0;

export const isTimeGapsValid = (timegaps) => {
  const matchTime = (times) => {
    const matchedGaps = times.match(/([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]/gi);
    return matchedGaps === null ? [] : matchedGaps;
  };
  return timegaps.split(/ *, */g).every((times) => matchTime(times).length === 2);
};

export const getCurrentWeekDay = () => {
  const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  return days[new Date().getDay()];
};

export const getCurrentHour = () => new Date().getHours();
export const getCurrentMinutes = () => new Date().getMinutes();
export const indexOfCurrentTimeGaps = (timeGaps = []) => {
  const currentGap = timeGaps.find((time) => {
    const timeDiffInMinutes = (new Date().getTime() - time) / 1000 / 60;
    return -10 < timeDiffInMinutes && timeDiffInMinutes < 10; //ten minutes before and ten after
  })
  return timeGaps.indexOf(currentGap)
}
