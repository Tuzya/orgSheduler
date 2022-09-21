import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Modal } from '@daypilot/modal';
import { useDispatch } from 'react-redux';

import { GenerateRandomNumbers } from '../../libs/randomNumber';
import { updCRTablesGroups } from '../../libs/reqFunct/groups';
import LinearLoader from '../Loader/LinearLoader';
import { isObjEmpty } from '../../libs/functions';
import { DAYS, DAYTORU, groupTypes, rating } from '../../consts';
import { getTeachersAndGaps } from '../../libs/reqFunct/teachersAndTimes';
import { getComment, updateStudentComment } from '../../libs/reqFunct/students';
import { getGroups } from '../../store/camp/actions';

const rowsInit = (teachers, timeGaps, groupType) => [
  timeGaps.reduce(function (acc, cur, i) {
    acc[`row${i + 1}`] = cur;
    return acc;
  }, {}),
  ...teachers.map(() =>
    timeGaps.reduce(function (acc, cur, i) {
      acc[`row${i + 1}`] = '';
      if (i === 1 && groupType === groupTypes.online) acc[`row${i + 1}`] = 'Педсовет';
      return acc;
    }, {})
  )
];

const columns = (groupName, teachers) => {
  return [
    { header: groupName, key: 'row1' },
    ...teachers.map((tname, i) => ({ header: tname, key: `row${i + 2}` }))
  ];
};

function CodeReviewTable({ group, isAuth }) {
  const crTablesRef = React.useRef([]);
  const [isLoad, setLoad] = React.useState(false);
  const [crTables, setcrTables] = React.useState([]);
  const [timeGaps, setTimegaps] = React.useState([]);
  const [teachers, setTeachers] = React.useState([]);
  const [isEdit, setEdit] = React.useState(false);
  const history = useHistory();
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (!isObjEmpty(group)) {
      (async () => {
        const teachersAndGaps = await getTeachersAndGaps(group.groupType);
        if (teachersAndGaps?.err)
          return alert(`Error to get list of teachers: ${teachersAndGaps.err}`);
        if (teachersAndGaps) {
          setTeachers(teachersAndGaps.teachers);
          setTimegaps(teachersAndGaps.timegaps);
        }

        const crdays = group.crshedule?.crdays || {};
        const tableDays = group.crtables?.map((table) => table.crDay) || [];
        const prevSelectedDays = Object.fromEntries(
          DAYS.map((day) => [[day], tableDays.includes(day)])
        );
        const isScheduleSame = JSON.stringify(crdays) === JSON.stringify(prevSelectedDays);

        if (isScheduleSame) {
          crTablesRef.current = JSON.parse(JSON.stringify(group.crtables));
          return setcrTables(group.crtables);
        }
        if (group.students?.length && group.crshedule) {
          generateStudentsToTable(group, teachersAndGaps.teachers, teachersAndGaps.timegaps);
        }
      })();
    }
  }, [group]);

  const generateStudentsToTable = async (group, teachers, timeGaps) => {
    let resCRTables = [];
    const crdays = group.crshedule?.crdays || {};
    Object.keys(crdays).forEach((day) => {
      if (crdays[day]) resCRTables.push({ crDay: day });
    });

    const studentsPerDay = Math.ceil(group.students.length / resCRTables.length);
    let counter = 0;
    const cellsInTable = teachers.length * timeGaps.length - teachers.length;
    if (resCRTables.length && cellsInTable * resCRTables.length < group.students.length)
      return alert('Студенты не помещаются в таблицу!');
    const crTablesData = resCRTables.map((el) => {
      let index = 0;
      const tableData = rowsInit(teachers, timeGaps, group.groupType);
      const slStudents = group.students.slice(counter, studentsPerDay + counter);
      counter += studentsPerDay;
      const rndArrOfNum = GenerateRandomNumbers(cellsInTable);
      tableData.forEach((rowObj, i) => {
        Object.keys(rowObj).forEach((key) => {
          if (!rowObj[key]) {
            tableData[i][key] = slStudents[rndArrOfNum[index] - 1] || ' ';
            index++;
          }
        });
      });
      return { ...el, tableData };
    });
    crTablesRef.current = JSON.parse(JSON.stringify(crTablesData));
    setcrTables(crTablesData);
    setLoad(true);
    await updCRTablesGroups(crTablesData, group._id);
    setLoad(false);
  };

  const handleInputChange = (inputData, day, col, row) => {
    crTablesRef.current = crTablesRef.current.map((table) => {
      if (table.crDay === day) {
        table.tableData[col][row] = inputData;
      }
      return table;
    });
  };

  const handleInputSave = async () => {
    setcrTables(crTablesRef.current);
    setEdit(false);
    setLoad(true);
    await updCRTablesGroups(crTablesRef.current, group._id);
    await dispatch(getGroups());
    setLoad(false);
  };

  const handleCancel = () => {
    crTablesRef.current = JSON.parse(JSON.stringify(crTables));
    setEdit(false);
  };
  const handleGenerateTable = () => {
    if (!window.confirm('Перемешать студентов в таблице?')) return;
    const crdays = group.crshedule.crdays;
    const isDaysNotChecked = Object.keys(crdays).every((day) => crdays[day] === false);
    if (!group.crshedule || isDaysNotChecked) {
      alert('Не выбраны дни кодревью для этой группы');
      return history.push('/groups/schema');
    }
    generateStudentsToTable(group, teachers, timeGaps);
  };

  const onAddComment = async (e, group, colNum) => {
    if (isLoad) return;
    const currentDate = new Date().setHours(0, 0, 0, 0);
    const studentsName = e.target.innerText;
    if (colNum === 0 || studentsName === '' || studentsName === 'Педсовет' || !isAuth) return;
    setLoad(true);
    const lastRecord = await getComment(studentsName, group.name, currentDate);
    setLoad(false);
    const form = [
      { name: 'Comments Student' },
      { name: 'Comment', id: 'comment' },
      { name: 'Rating', id: 'rating', options: rating }
    ];
    const data = {
      comment: lastRecord.comment || '',
      rating: lastRecord.rating || '5'
    };
    const modal = await Modal.form(form, data);
    if (modal.canceled) return;
    const historyEl = {
      phase: group.phase,
      groupType: group.groupType,
      teacher: teachers[colNum - 1],
      date: currentDate, // если комент в тот же самый день - то он обновиться. если в другой - запушиться. поэтому отсекаем время от даты.
      // date: new Date(),
      rating: modal.result.rating,
      comment: modal.result.comment
    };

    await updateStudentComment(studentsName, group.name, historyEl);
  };

  return (
    <>
      <div>
        <div className="group-schedule-header">
          <div className="group-coderev">Код ревью</div>
          <div>
            {crTables.map((group, i) => (i ? ' - ' + DAYTORU[group.crDay] : DAYTORU[group.crDay]))}
          </div>
        </div>
      </div>
      {crTables.map((crTablegroup) => (
        <div key={crTablegroup.crDay} style={{ marginBottom: 50, opacity: (isLoad ? 0.5 : 1) }}>
          <table className="striped centered">
            <caption>{DAYTORU[crTablegroup.crDay]}</caption>
            <thead>
              <tr>
                {columns(group.name, teachers).map((column) => (
                  <th key={column.key}>{column.header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeGaps.map((time, i) => (
                <tr key={time}>
                  {crTablegroup.tableData.map((cell, colNum) => {
                    const row = `row${i + 1}`;
                    return (
                      <td
                        style={{
                          cursor:
                            cell[row] === ' ' || cell[row] === 'Педсовет' || !colNum
                              ? 'default'
                              : 'pointer'
                        }}
                        key={colNum}
                        onDoubleClick={(e) => {
                          onAddComment(e, group, colNum);
                        }}
                      >
                        {!isEdit && cell[row]}
                        {isEdit && (
                          <input
                            defaultValue={cell[row]}
                            onChange={(e) =>
                              handleInputChange(e.target.value, crTablegroup.crDay, colNum, row)
                            }
                          />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
      {isAuth && (
        <div style={{ textAlign: 'center' }}>
          <button
            className="btn"
            onClick={() => setEdit(true)}
            disabled={isLoad || !crTables.length}
          >
            EditMode
          </button>
          <button className="btn" onClick={handleInputSave} disabled={!isEdit || isLoad}>
            Save
          </button>
          <button className="btn" onClick={handleCancel} disabled={!isEdit || isLoad}>
            Cancel
          </button>
          <button
            className="btn"
            onClick={handleGenerateTable}
            disabled={isEdit || isLoad || !crTables.length}
          >
            NewGenerate
          </button>
        </div>
      )}
      {isLoad && <LinearLoader />}
    </>
  );
}

CodeReviewTable.propTypes = {
  isAuth: PropTypes.bool.isRequired,
  group: PropTypes.shape({
    crshedule: PropTypes.shape({
      crdays: PropTypes.shape({
        mon: PropTypes.bool.isRequired,
        thu: PropTypes.bool.isRequired,
        tue: PropTypes.bool.isRequired,
        wed: PropTypes.bool.isRequired,
        fri: PropTypes.bool.isRequired
      })
    }),
    crtables: PropTypes.array.isRequired,
    groupType: PropTypes.string.isRequired,
    isArchived: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    phase: PropTypes.number.isRequired,
    shedule: PropTypes.object.isRequired,
    students: PropTypes.array.isRequired
  })
};

export default CodeReviewTable;
