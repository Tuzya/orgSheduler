import React from 'react';
import './students.css';

import { DebounceInput } from 'react-debounce-input';;
import { groupTypes } from '../../consts';
import { useDispatch, useSelector } from 'react-redux';
import {Link, useHistory} from 'react-router-dom';
import {
  TableContainer,
  Table,
  TableBody,
  TablePagination,
  TableCell,
  createTheme,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Container
} from '@mui/material';

import { getStudents } from '../../store/students/actions';
import { getGroups } from '../../store/camp/actions';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';

import BgLetterAvatars from '../../components/BgLettersAvatar/BgLettersAvatar';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import LinearIndeterminate from '../../components/Loader/LinearIndeterminate';
import Input from '@mui/material/Input';
import Badge from "@mui/material/Badge"
import IconButton from "@mui/material/IconButton"
import EditIcon from '@mui/icons-material/Edit';
import PetsIcon from '@mui/icons-material/Pets';
import Avatar from "@mui/material/Avatar"
import ListItemAvatar from "@mui/material/ListItemAvatar/ListItemAvatar"

export default function Students() {
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

  React.useEffect(() => {
    if (groups.length === 0) dispatch(getGroups());
  }, []);

  React.useEffect(() => {
    // todo перевести на поиск из стора
    dispatch(getStudents(search));
  }, [search]);

  const filteredGroups = React.useMemo(
    () => groups.filter((group) => group.groupType === search.groupType),
    [groups, search.groupType]
  );

  const totalStudents = React.useMemo(
    () =>
      filteredGroups.reduce((total, group) => {
        return total + group.students.length;
      }, 0),
    [groups, search.groupType]
  );

  const handleChangePage = (event, newPage) => {
    setSearch({ ...search, page: newPage });
  };

  const handleChangeRowsPerPage = (event) => {
    setSearch({ ...search, page: 0, limit: parseInt(event.target.value, 10) });
  };

  return (
    <Container component="main" maxWidth="xl" sx={{ mt: 0 }}>
      <Box sx={{mb:5}}>
        <FormControl fullWidth  sx={{ mt: 2 }}>
          <DebounceInput
            element={Input}
            placeholder={'search students by name here...'}
            minLength={2}
            debounceTimeout={600}
            onChange={(e) => {
              setSearch((state) => ({ ...state, name: e.target.value }));
            }}
          />
        </FormControl>

        <FormControl fullWidth  size="small" sx={{ mt: 2 }}>
          <InputLabel id="group-type-label">Group Type</InputLabel>
          <Select
            labelId="group-type-label"
            id="group-type"
            label="Group Type"
            value={search.groupType}
            onChange={(e) => {
              setSearch((state) => ({
                ...state,
                groupType: e.target.value,
                groupId: '',
                page: 0
              }));
            }}
          >
            {Object.keys(groupTypes).map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth  size="small" sx={{ mt: 2 }}>

          <Select
            onChange={(e) => {
              setSearch((state) => ({ ...state, groupId: e.target.value, page: 0 }));
            }}
            value={search.groupId}
            displayEmpty
          >
            <MenuItem key="fff007" value={''}>
              All Groups
            </MenuItem>
            {filteredGroups?.map((group) => (
              <MenuItem key={group._id} value={group._id}>
                {group.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {isLoading ? <LinearIndeterminate /> : <div style={{height: 4}}/>}

      <ThemeProvider theme={createTheme({ typography: { fontSize: 16 } })}>
        <TableContainer sx={{mt:5}}>
          <Table
            // className={classes.table}
            sx={{ minWidth: 650 }}
            aria-labelledby="tableTitle"
            size={'medium'}
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
                const rating = student.history.length
                  ? Math.round(
                    student.history.reduce(
                      (totalRt, el) => totalRt + Number(el.rating),
                      0
                    ) / student.history.length
                  )
                  : '-'
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
                      <Badge badgeContent={rating.toString()} color="success">
                        <BgLetterAvatars name={student.name} />
                      </Badge>

                    </TableCell>
                    <TableCell component="th" scope="row">
                      {student.name}
                    </TableCell>
                    <TableCell>{student.group?.name}</TableCell>
                    <TableCell align="right">
                      <Link to={`/students/${student._id}/edit`}>
                        <IconButton edge="end" aria-label="edit">
                          <EditIcon />
                        </IconButton>
                      </Link>
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
      </ThemeProvider>
    </Container>
  );
}

const styles = {
  formbox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
};
