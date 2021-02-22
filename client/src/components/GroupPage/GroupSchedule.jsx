import React from "react";
import shortenNames from "../../libs/shorten-names";

/**
 * Переформатировать ФИО в расписании
 * @param {array} schedule Расписание
 */
function reformatSchedule(schedule) {
  if (schedule && schedule.length) {
    const shortenedNames = shortenNames(schedule[0].flat());
    return schedule.map((scheduleItem) =>
      scheduleItem.map((pair) =>
        pair.map((fullName) => {
          const shortened = shortenedNames.fullNameMap[fullName];
          if (shortened) {
            return (
              <span key={fullName} title={fullName}>
                {shortened.short}
              </span>
            );
          }
          return fullName;
        })
      )
    );
  }
  return schedule;
}

export default function GroupSchedule({ schedule }) {
  function format(context) {
    return (
      context.length &&
      context.shift().map((line, index) => (
        <li key={index}>
          {line.reduce((acc, x, index, arr) => {
            acc.push(x);
            if (index < arr.length - 1) {
              acc.push(" - ");
            }
            return acc;
          }, [])}
        </li>
      ))
    );
  }

  const result = [];

  let weekIndex = 1;
  const reformattedSchedule = reformatSchedule(schedule);
  const online = reformattedSchedule[2][0].length === 2;
  while (reformattedSchedule.length > 0) {
    result.push(
      <div key={weekIndex} className="group-schedule-week">
        <div className="group-schedule-week-content">
          <div className="week-num">Неделя {weekIndex}</div>
          <b>Понедельник</b>
          <ul>{format(reformattedSchedule)}</ul>
          <b>Вторник</b>
          <ul>{format(reformattedSchedule)}</ul>
          {online && (
            <>
              <b>Четверг</b>
              <ul>{format(reformattedSchedule)}</ul>
            </>
          )}
          <b>Пятница</b>
          <ul>{format(reformattedSchedule)}</ul>
        </div>
      </div>
    );

    weekIndex += 1;
  }

  return <div className="group-schedule">{result}</div>;
}


