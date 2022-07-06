import React from 'react';

const teachers = ['Тарас', 'Рома', 'Даша', 'Денис', 'Олег', 'nnn', 'nnn2'];
const times = [
  '14:30-14:55',
  '15:00-15:25',
  '16:00-16:30',
  '16:30-17:00',
  '17:00-17:30',
];

const rowsInit = () => [
  times.reduce(function (acc, cur, i) {
    acc[`col${i + 1}`] = cur;
    return acc;
  }, {}),
  ...teachers.map(() =>
    times.reduce(function (acc, cur, i) {
      acc[`col${i + 1}`] = '';
      if (i === 1) acc[`col${i + 1}`] = 'Педсовет';
      return acc;
    }, {})
  ),
];

function CodeReviewTable({ group }) {
  const [isLoad, setLoad] = React.useState(false);
  const [crTables, setcrTables] = React.useState([]);

  React.useEffect(() => {
    let resCRTables = [];
    if (group.students.length) {
      Object.keys(group.crshedule.crdays).forEach((day, i) => {
        if (group.crshedule.crdays[day]) {
          resCRTables.push({ crDay: day });
        }
      });
      const studentsPerDay = Math.ceil(
        group.students.length / resCRTables.length
      );
      let counter = 0;
      const crTablesN = resCRTables.map((el) => {
        let index = 0;
        const tableData = rowsInit();
        const slStudents = group.students.slice(
          counter,
          studentsPerDay + counter
        );
        counter += studentsPerDay;
        const step = Math.floor(
          ((teachers.length * times.length) - teachers.length) / slStudents.length
        );
        console.log('file-CodeReviewTable.jsx step:', step);
        let stepIndex = 0;
        // console.log('file-CodeReviewTable.jsx tableData:', tableData);
        tableData.forEach((colObj, i) => {
          stepIndex = stepIndex + step;
          Object.keys(colObj).forEach((key) => {
            if (!colObj[key])  {
              tableData[i][key] = slStudents[index] || ' ';
              index++;
              // console.log('file-CodeReviewTable.jsx stepIndex:', stepIndex);
            }
          });
        });
        return {
          ...el,
          tableData: tableData,
        };
      });
      console.log('file-CodeReviewTable.jsx crTables:', crTablesN);
      setcrTables(crTablesN);
    }

    // setRows(rowsInit);
  }, [group]);

  const columns = React.useMemo(
    () => [
      { header: group.name, key: 'col1' },
      ...teachers.map((tname, i) => ({ header: tname, key: `col${i + 2}` })),
    ],
    []
  );
  // return null;
  return (
    <>
      <div>
        <div className="group-schedule-header">
          <div className="group-coderev">Код ревью</div>
          <div>{`14 июнь (вт) — 16 июнь (чт)`}</div>
        </div>
      </div>
      {crTables.map((group) => (
        <div key={group.crDay} style={{ marginBottom: 50 }}>
          <table>
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
                    {group.tableData.map((cell, j) => {
                      // return <td key={cell[column.key]}>{cell[column.key]}</td>;
                      return <td key={j}>{cell[`col${i + 1}`]}</td>;
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
    </>
  );
}

export default CodeReviewTable;
