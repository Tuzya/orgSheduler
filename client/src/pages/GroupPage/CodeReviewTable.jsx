import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Modal } from '@daypilot/modal';

import LinearLoader from '../../components/Loader/LinearLoader';
import { GenerateRandomNumbers } from '../../libs/randomNumber';
import { getTeachersAndGaps } from '../../libs/reqFunct/teachersAndTimes';
import { isObjEmpty } from '../../libs/functions';
import { DAYS, DAYTORU, groupTypes, rating } from '../../consts';
import { getComment, updateStudentComment } from '../../store/students/actions';
import { updCRTablesGroups } from '../../store/camp/actions';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Input from '@mui/material/Input';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import createTheme from '@mui/material/styles/createTheme';

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

  const generateStudentsToTable = (group, teachers, timeGaps) => {
    let resCRTables = [];
    const crdays = group.crshedule?.crdays || {};
    Object.keys(crdays).forEach((day) => {
      if (crdays[day]) resCRTables.push({ crDay: day });
    });

    const studentsPerDay = Math.ceil(group.students.length / resCRTables.length);
    let counter = 0;
    const cellsInTable = teachers.length * timeGaps.length - teachers.length;
    if (resCRTables.length && cellsInTable * resCRTables.length < group.students.length)
    alert('Студенты не помещаются в таблицу!');
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
    handleInputSave();
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
    const res = await updCRTablesGroups(crTablesRef.current, group._id);
    if (res.err) alert(`Update Table Error ${res.err}`);
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
    console.log('file-CodeReviewTable.jsx group:', group);
    if (isLoad) return;
    const currentDate = new Date().setHours(0, 0, 0, 0);
    const studentsName = e.target.innerText;
    if (colNum === 0 || studentsName === '' || studentsName === 'Педсовет' || !isAuth) return;
    setLoad(true);
    const lastRecord = await getComment(studentsName, group._id, currentDate);
    setLoad(false);
    if (lastRecord.err) {
      return alert(`Get Comment Error: ${lastRecord.err}`);
    }
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
      groupName: group.name,
      teacher: teachers[colNum - 1],
      date: currentDate, // если комент в тот же самый день - то он обновиться. если в другой - запушиться. поэтому отсекаем время от даты.
      rating: modal.result.rating,
      comment: modal.result.comment
    };

    const lastComment = await updateStudentComment(studentsName, group._id, historyEl);
    if (modal.result.comment === lastComment.comment && modal.result.rating === lastComment.rating)
      alert('Comment Saved to DB');
    else alert(`Error to save comment: ${lastComment.err}`);
  };

  const handleFocus = (event) => event.target.select();

  if (!crTables.length) return <></>;
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
        <ThemeProvider
          theme={createTheme({ typography: { fontSize: 16, fontFamily: '"Comfortaa", cursive' } })}
          key={crTablegroup.crDay}
        >
          <TableContainer component={Paper} sx={{ marginBottom: 10, opacity: isLoad ? 0.5 : 1 }}>
            <Table className="stripped" sx={{ minWidth: 650 }} aria-label="simple table">
              <caption>{DAYTORU[crTablegroup.crDay]}</caption>
              <TableHead>
                <TableRow>
                  {columns(group.name, teachers).map((column, i) => (
                    <TableCell key={column.key} align={i ? 'right' : 'left'}>
                      {' '}
                      {column.header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {timeGaps.map((time, i) => (
                  <TableRow key={time}>
                    {crTablegroup.tableData.map((cell, colNum) => {
                      const row = `row${i + 1}`;
                      return (
                        <TableCell
                          key={colNum}
                          align={colNum ? 'right' : 'left'}
                          component="th"
                          scope="row"
                          sx={{
                            cursor:
                              cell[row] === ' ' || cell[row] === 'Педсовет' || !colNum
                                ? 'default'
                                : 'pointer'
                          }}
                          onDoubleClick={(e) => {
                            onAddComment(e, group, colNum);
                          }}
                        >
                          {!isEdit ? (
                            cell[row]
                          ) : (
                            <Input
                              type="text"
                              defaultValue={cell[row]}
                              onChange={(e) =>
                                handleInputChange(e.target.value, crTablegroup.crDay, colNum, row)
                              }
                              onClick={handleFocus}
                            />
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </ThemeProvider>
      ))}
      {isAuth && (
        <Stack sx={{ pt: 4 }} direction="row" spacing={2} justifyContent="center">
          <Button
            variant="contained"
            onClick={() => setEdit(true)}
            disabled={isLoad || !crTables.length}
          >
            EditMode
          </Button>
          <Button variant="contained" onClick={handleInputSave} disabled={!isEdit || isLoad}>
            Save
          </Button>
          <Button variant="contained" onClick={handleCancel} disabled={!isEdit || isLoad}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleGenerateTable}
            disabled={isEdit || isLoad || !crTables.length}
          >
            NewGenerate
          </Button>
        </Stack>
      )}
      {isLoad && <LinearLoader />}
    </>
  );
}

// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   '&:nth-of-type(odd)': {
//     backgroundColor: '#fff2cc'
//   },
//   '&:nth-of-type(even)': {
//     backgroundColor: '#cfe2f3'
//   },
//   // hide last border
//   '&:last-child td, &:last-child th': {
//     border: 0
//   }
// }));

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
