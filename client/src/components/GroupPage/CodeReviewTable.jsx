import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import { GenerateRandomNumbers } from '../../libs/randomNumber';
import { updCRTablesGroups } from '../../libs/reqFunct/groups';
import LinearLoader from '../Loader/LinearLoader';
import { isObjEmpty } from '../../libs/functions';
import { DAYS, DAYTORU } from '../../consts';
import {getTeachersAndGaps} from "../../libs/reqFunct/teachersAndTimes"


const times = [
  '14:30-14:55',
  '15:00-15:25',
  '15:30-15:55',
  '16:00-16:25',
  '16:30-16:55',
  '17:00-17:25'
];

const rowsInit = (teachers) => [
  times.reduce(function (acc, cur, i) {
    acc[`row${i + 1}`] = cur;
    return acc;
  }, {}),
  ...teachers.map(() =>
    times.reduce(function (acc, cur, i) {
      acc[`row${i + 1}`] = '';
      if (i === 1) acc[`row${i + 1}`] = 'Педсовет';
      return acc;
    }, {})
  )
];

function CodeReviewTable({ group, isAuth }) {
  const crTablesRef = React.useRef([]);
  const [isLoad, setLoad] = React.useState(false);
  const [crTables, setcrTables] = React.useState([]);
  const [teachers, setTeachers] = React.useState(['Тарас', 'Рома', 'Денис', 'Олег', 'Сергей', 'Алексей']);
  const [isEdit, setEdit] = React.useState(false);

  const history = useHistory();

  React.useEffect(() => {
    if (!isObjEmpty(group)) {
      (async () => {

        const teachers_ = await getTeachersAndGaps() || []; //????????????
        console.log('file-CodeReviewTable.jsx teachers_:', teachers_);

        const crdays = group.crshedule?.crdays || {};
        const tableDays = group.crtables.map((table) => table.crDay);
        const prevSelectedDays = Object.fromEntries(
          DAYS.map((day) => [[day], tableDays.includes(day)])
        );
        const isScheduleSame = JSON.stringify(crdays) === JSON.stringify(prevSelectedDays);
        if (isScheduleSame) {
          crTablesRef.current = JSON.parse(JSON.stringify(group.crtables));
          return setcrTables(group.crtables);
        }
        if (group.students?.length && group.crshedule) {
          generateStudentsToTable(group, teachers);
        }
      })();
    }
  }, [group]);

  const columns = React.useMemo(
    () => [
      { header: group.name, key: 'row1' },
      ...teachers.map((tname, i) => ({ header: tname, key: `row${i + 2}` }))
    ],
    []
  );

  const generateStudentsToTable = async (group, teachers) => {
    let resCRTables = [];
    const crdays = group.crshedule?.crdays || {};
    Object.keys(crdays).forEach((day) => {
      if (crdays[day]) resCRTables.push({ crDay: day });
    });

    const studentsPerDay = Math.ceil(group.students.length / resCRTables.length);
    let counter = 0;
    const cellsInTable = teachers.length * times.length - teachers.length;
    if (resCRTables.length && cellsInTable * resCRTables.length < group.students.length)
      return alert('Студенты не помещаются в таблицу!');
    const crTablesData = resCRTables.map((el) => {
      let index = 0;
      const tableData = rowsInit(teachers);
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
    generateStudentsToTable(group, teachers);
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
      {crTables.map((group) => (
        <div key={group.crDay} style={{ marginBottom: 50 }}>
          <table className="striped centered">
            <caption>{DAYTORU[group.crDay]}</caption>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column.key}>{column.header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {times.map((time, i) => (
                <tr key={time}>
                  {group.tableData.map((cell, colNum) => {
                    const row = `row${i + 1}`;
                    return (
                      <td key={colNum}>
                        {!isEdit && cell[row]}
                        {isEdit && (
                          <input
                            defaultValue={cell[row]}
                            onChange={(e) =>
                              handleInputChange(e.target.value, group.crDay, colNum, row)
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

export default CodeReviewTable;