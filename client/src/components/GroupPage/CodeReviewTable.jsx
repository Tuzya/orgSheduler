import React from 'react';
import { GenerateRandomNumbers } from '../../libs/randomNumber';

const teachers = ['Тарас', 'Рома', 'Даша', 'Денис', 'Олег'];
const times = [
  '14:30-14:55',
  '15:00-15:25',
  '15:30-15:55',
  '16:00-16:25',
  '16:30-16:55',
  '17:00-17:25',
];

const rowsInit = () => [
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
  ),
];

function CodeReviewTable({ group, isAuth }) {
  const crTablesRef = React.useRef([]);
  const [isLoad, setLoad] = React.useState(false);
  const [crTables, setcrTables] = React.useState([]);
  const [isEdit, setEdit] = React.useState(false);

  React.useEffect(() => {
    let resCRTables = [];
    console.log('file-CodeReviewTable.jsx group:', group);
    if (group.crtables?.length) return;
    if (group.students.length && group.crshedule) {
      Object.keys(group.crshedule.crdays).forEach((day, i) => {
        if (group.crshedule.crdays[day]) {
          resCRTables.push({ crDay: day });
        }
      });

      const studentsPerDay = Math.ceil(
        group.students.length / resCRTables.length
      );
      let counter = 0;
      const cellsInTable = teachers.length * times.length - teachers.length;
      if (cellsInTable * resCRTables.length < group.students.length)
        return alert('Студенты не помещаются в таблицу!');
      const crTablesData = resCRTables.map((el) => {
        let index = 0;
        const tableData = rowsInit();
        const slStudents = group.students.slice(
          counter,
          studentsPerDay + counter
        );
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
        return {
          ...el,
          tableData: tableData,
        };
      });
      crTablesRef.current = JSON.parse(JSON.stringify(crTablesData));
      setcrTables(crTablesData);
    }
  }, [group]);

  const columns = React.useMemo(
    () => [
      { header: group.name, key: 'row1' },
      ...teachers.map((tname, i) => ({ header: tname, key: `row${i + 2}` })),
    ],
    []
  );
  // return null;

  const handleInputChange = (inputData, day, col, row) => {
    crTablesRef.current = crTablesRef.current.map((table) => {
      if (table.crDay === day) {
        table.tableData[col][row] = inputData;
      }
      return table;
    });
  };

  const handleInputSave = () => {
    setcrTables(crTablesRef.current);
    setEdit(false);
  };

  const handleCancel = () => {
    crTablesRef.current = JSON.parse(JSON.stringify(crTables));
    setEdit(false);
  };

  return (
    <>
      <div>
        <div className="group-schedule-header">
          <div className="group-coderev">Код ревью</div>
          <div>{crTables.map((group, i) => (i ? ' - '+ group.crDay : group.crDay))}</div>
        </div>
      </div>
      {crTables.map((group) => (
        <div key={group.crDay} style={{ marginBottom: 50 }}>
          <table className="striped centered">
            <caption>{group.crDay}</caption>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column.key}>{column.header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {times.map((time, i) => {
                return (
                  <tr key={time}>
                    {group.tableData.map((cell, colNum) => {
                      const row = `row${i + 1}`;
                      // return <td key={cell[column.key]}>{cell[column.key]}</td>;
                      return (
                        <td key={colNum}>
                          {!isEdit && cell[row]}
                          {isEdit && (
                            <input
                              defaultValue={cell[row]}
                              onChange={(e) =>
                                handleInputChange(
                                  e.target.value,
                                  group.crDay,
                                  colNum,
                                  row
                                )
                              }
                            />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
      {isAuth && <div style={{ textAlign: 'center' }}>
        <button className="btn" onClick={() => setEdit(true)}>
          EditMode
        </button>
        <button className="btn" onClick={handleInputSave} disabled={!isEdit}>
          Save
        </button>
        <button className="btn" onClick={handleCancel} disabled={!isEdit}>
          Cancel
        </button>
      </div>}
    </>
  );
}

export default CodeReviewTable;
