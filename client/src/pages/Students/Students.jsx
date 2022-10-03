import React from 'react';
import dayjs from 'dayjs';

import './students.css';

import { DebounceInput } from 'react-debounce-input';
import LinearLoader from '../../components/Loader/LinearLoader';
import { groupTypes } from '../../consts';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { TableContainer, Table, TableBody, TablePagination, TableCell } from '@mui/material';

import { getStudents } from '../../store/students/actions';
import { getGroups } from '../../store/camp/actions';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';

import BgLetterAvatars from '../../components/BgLettersAvatar/BgLettersAvatar';

// const ratingColor = {
//   0: 'red',
//   1: 'light-blue',
//   2: 'lime',
//   3: 'blue-grey lighten-3',
//   4: 'light-green',
//   5: 'green'
// };

export default function Schema() {
  const history = useHistory();
  const dispatch = useDispatch();

  const [search, setSearch] = React.useState({
    name: '',
    groupType: groupTypes.online,
    groupId: '',
    page: 0,
    limit: 25
  });
  const { data: students, isLoading } = useSelector((store) => store.students);
  const groups = useSelector((store) => store.camp.groups);

  const filteredGroups = React.useMemo(
    () => groups.filter((group) => group.groupType === search.groupType),
    [groups, search.groupType]
  );

  React.useEffect(() => {
    if (groups.length === 0) dispatch(getGroups());
  }, []);

  React.useEffect(() => {
    dispatch(getStudents(search));
  }, [search]);

  const totalStudents = React.useMemo(
    () =>
      groups
        .filter((group) => group.groupType === search.groupType)
        .reduce((total, group) => {
          return total + group.students.length;
        }, 0),
    [groups, search.groupType]
  );
  console.log('file-Students.jsx totalStudents:', totalStudents);
  console.log('file-Students.jsx groups:', groups);

  const handleChangePage = (event, newPage) => {
    setSearch({ ...search, page: newPage });
  };

  const handleChangeRowsPerPage = (event) => {
    setSearch({ ...search, page: 0, limit: parseInt(event.target.value, 10) });
  };

  return (
    <>
      <DebounceInput
        className={'px-2'}
        placeholder={'search students by name here...'}
        minLength={2}
        debounceTimeout={600}
        onChange={(e) => {
          setSearch((state) => ({ ...state, name: e.target.value }));
        }}
      />
      <div>
        <div className="input-field" style={{ minWidth: '300px' }}>
          <select
            className="browser-default"
            onChange={(e) => {
              setSearch((state) => ({ ...state, groupType: e.target.value, groupId: '', page: 0 }));
            }}
          >
            {Object.keys(groupTypes).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <br />
          <select
            className="browser-default"
            onChange={(e) => {
              setSearch((state) => ({ ...state, groupId: e.target.value, page: 0 }));
            }}
          >
            <option key={'fff007'} value={''}>
              All Groups
            </option>
            {filteredGroups.map((group) => (
              <option key={group._id} value={group._id}>
                {group.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {isLoading ? <LinearLoader /> : <div style={{ height: 20 }} />}
      {/*<div style={{ marginTop: 20 }}>*/}
      {/*  <ul className="collection">*/}
      {/*    {students.map((student) => (*/}
      {/*      <li key={student._id} className="collection-item ">*/}
      {/*        <Link to={`/students/${student._id}`}>{student.name}</Link>, {student.group?.name}*/}
      {/*        <ul className="collection">*/}
      {/*          {student.history.map((st) => (*/}
      {/*            <li key={st._id} className="collection-item">*/}
      {/*              {`ph${st.phase}, ${st.groupType}, ${dayjs(st.date).format(*/}
      {/*                'DD-MM-YY'*/}
      {/*              )}, Проверял: ${st.teacher}`}*/}
      {/*              <div>*/}
      {/*                {`Комент: ${st.comment}`}*/}
      {/*                <span*/}
      {/*                  className={`new badge ${ratingColor[st.rating]}`}*/}
      {/*                  data-badge-caption={st.rating ? st.rating : '-'}*/}
      {/*                />*/}
      {/*              </div>*/}
      {/*            </li>*/}
      {/*          ))}*/}
      {/*        </ul>*/}
      {/*      </li>*/}
      {/*    ))}*/}
      {/*  </ul>*/}
      {/*</div>*/}

      <>
        <TableContainer>
          <Table
            // className={classes.table}
            sx={{ minWidth: 650 }}
            aria-labelledby="tableTitle"
            size={'small'}
            aria-label="simple table"
          >
            <TableHead>
              <TableRow component="tr">
                <TableCell />
                <TableCell>Name</TableCell>
                <TableCell>Group</TableCell>
                <TableCell align="right">{'Rating'}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => {
                return (
                  <TableRow
                    hover
                    tabIndex={-1}
                    onClick={() => {
                      history.push(`/students/${student._id}`);
                    }}
                    key={student._id}
                    style={{ cursor: 'pointer' }}
                  >
                    <TableCell>
                      <BgLetterAvatars name={student.name} />
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {student.name}
                    </TableCell>
                    <TableCell>{student.group.name}</TableCell>
                    <TableCell align="right">
                      {student.history.length
                        ? student.history.reduce((totalRt, el) => totalRt + Number(el.rating), 0) /
                          student.history.length
                        : '-'}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        {!search.name && !search.groupId && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalStudents}
            rowsPerPage={search.limit}
            page={search.page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </>
    </>
  );
}
