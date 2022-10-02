import React from 'react';
import dayjs from 'dayjs';

import './students.css';

import { DebounceInput } from 'react-debounce-input';
import LinearLoader from '../../components/Loader/LinearLoader';
import { groupTypes } from '../../consts';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  TableContainer,
  Table,
  TableBody,
  TablePagination,
  TableCell,
} from '@mui/material';

import { getStudents } from '../../store/students/actions';
import { getGroups } from '../../store/camp/actions';
import TableRow from "@mui/material/TableRow"
import BgLetterAvatars from "../../components/BgLettersAvatar/BgLettersAvatar"


const ratingColor = {
  0: 'red',
  1: 'light-blue',
  2: 'lime',
  3: 'blue-grey lighten-3',
  4: 'light-green',
  5: 'green'
};

export default function Schema() {
  const [search, setSearch] = React.useState({
    name: '',
    groupType: groupTypes.online,
    groupId: ''
  });
  const [rowsPerPage, setRowsPerPage] = React.useState(25)
  const [page, setPage] = React.useState(0)
  const dispatch = useDispatch();
  const { data: students, isLoading } = useSelector((store) => store.students);
  const groups = useSelector((store) => store.camp.groups);
  const filteredGroups = React.useMemo(
    () => groups.filter((group) => group.groupType === search.groupType),
    [groups, search]
  );
  const history = useHistory();

  React.useEffect(() => {
    if (groups.length === 0) dispatch(getGroups());
  }, []);

  React.useEffect(() => {
    dispatch(getStudents(search));
  }, [search]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
              setSearch((state) => ({ ...state, groupType: e.target.value, groupId: '' }));
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
              setSearch((state) => ({ ...state, groupId: e.target.value }));
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
      {isLoading ? <LinearLoader /> : <div style={{height: 20}}/>}
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
            aria-labelledby="tableTitle"
            size={'small'}
            aria-label="enhanced table"
          >
            {/*<EnhancedTableHead*/}
            {/*  classes={classes}*/}
            {/*  numSelected={selected.length}*/}
            {/*  order={order}*/}
            {/*  orderBy={orderBy}*/}
            {/*  onSelectAllClick={handleSelectAllClick}*/}
            {/*  onRequestSort={handleRequestSort}*/}
            {/*  rowCount={rows.length}*/}
            {/*/>*/}
            <TableBody>
              {students.map((student, index) => {
                return <TableRow
                  hover
                  // aria-checked={isItemSelected}
                  tabIndex={-1}
                  onClick={(e) => {
                    history.push(`/students/${student._id}`);
                  }}
                  key={student._id}
                  // selected={isItemSelected}
                  style={{ cursor: 'pointer' }}
                >

                  <TableCell>
                    <BgLetterAvatars name={student.name}/>
                  </TableCell>
                  <TableCell component="th" scope="row" padding="none">
                    {student.name}
                  </TableCell>
                  <TableCell>{student.group.name}</TableCell>
                  <TableCell align="right">{'some comments'}</TableCell>
                </TableRow>
              })}


            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={students.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </>
    </>
  );
}
