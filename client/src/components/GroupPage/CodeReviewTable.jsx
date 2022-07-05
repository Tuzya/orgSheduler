import React from 'react';
import { getCRSchemas, putCRSchemas } from '../../libs/reqFunct/Schemas';
import { daysCR } from '../../consts';

function CodeReviewTable({ name, students }) {
  const teachers = ['Тарас', 'Рома', 'Даша', 'Денис', 'Олег', 'nnn', 'nnn2'];
  const times = [
    '14:30-14:55',
    '15:00-15:25',
    '16:00-16:30',
    '16:30-17:00',
    '17:00-17:30',
  ];

  let rowsInit = [
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

  const [rows, setRows] = React.useState([rowsInit]);
  const [schemaCR, setCR] = React.useState([]);
  const [isLoad, setLoad] = React.useState(false);

  // console.log('file-CodeReviewTable.jsx rowsInit:', rowsInit);
  // console.log('file-CodeReviewTable.jsx rows:', rows);
  console.log('file-CodeReviewTable.jsx schemaCR:', schemaCR);

  React.useEffect(() => {
    let index = 0;
    if (students.length) {
      rowsInit.forEach((colObj, i) => {
        Object.keys(colObj).forEach((key) => {
          if (!colObj[key]) {
            rowsInit[i][key] = students[index] || ' ';
            index++;
          }
        });
      });
    }
    setRows(rowsInit);
  }, [students]);

  React.useEffect(() => {
    (async () => {
      setLoad(true);
      if (name) {
        try {
          const CRSchema = await getCRSchemas();
          console.log('file-CodeReviewTable.jsx CRSchema:', CRSchema);
          const thisGroupCRSchema = CRSchema.schema.find((groupsNdays) => groupsNdays.group.name === name);
          setCR(thisGroupCRSchema);
        } catch (e) {
          console.error('Failed CodeReviewSchema', e.message);
        } finally {
          setLoad(false);
        }
      }
    })();
  }, [name]);

  const columns = React.useMemo(
    () => [
      { header: name, key: 'col1' },
      ...teachers.map((tname, i) => ({ header: tname, key: `col${i + 2}` })),
    ],
    []
  );

  return (
    <>
      <div>
        <div className="group-schedule-header">
          <div className="group-coderev">Код ревью</div>
          <div>{`14 июнь (вт) — 16 июнь (чт)`}</div>
        </div>
      </div>
      <table>
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
                {rows.map((cell, j) => {
                  // return <td key={cell[column.key]}>{cell[column.key]}</td>;
                  return <td key={j}>{cell[`col${i + 1}`]}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

export default CodeReviewTable;
