import * as React from 'react';
import Button from '@mui/material/Button';
import { deleteStudent, getStudent, setStudent, updateStudent } from '../../store/students/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { getGroups } from '../../store/camp/actions';
import {
  Avatar,
  Box,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import LinearIndeterminate from '../../components/Loader/LinearIndeterminate';

export default function StudentEdit() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { studentId } = useParams();
  const groups = useSelector((state) => state.camp.groups);
  const student = useSelector((state) => state.students.student);
  const isLoading = useSelector((state) => state.students.isLoading);

  React.useEffect(() => {
    if (groups.length === 0) dispatch(getGroups());
    dispatch(getStudent(studentId));
  }, []);

  const submitHandlerStudent = async (event) => {
    event.preventDefault();
    if (student.group.name === 'Inactive') return onDeleteHandlerStudent();
    const res = await updateStudent(student._id, student.name, student.group._id, student.photoUrl);
    if (res.err) return alert(res.err);
    history.push('/students');
  };

  const onChangeHandler = (event, obj) => {
    const name = event.target.name;
    const value = event.target.value;

    if (name === 'select') {
      const groupName = obj.props.children;
      dispatch(
        setStudent({
          ...student,
          group: { ...student.group, _id: value, name: groupName }
        })
      );
    } else
      dispatch(
        setStudent({
          ...student,
          group: { ...student.group },
          [name]: value
        })
      );
  };

  const onDeleteHandlerStudent = () => {
    if (!confirm('Move student to Inactive group list?')) return;
    dispatch(deleteStudent(studentId));
    history.push('/students');
  };

  return (
    <Container component="main" maxWidth="xl" sx={{ mt: 0 }}>
      <Box sx={styles.formbox}>
        <Avatar sx={{ m: 1, width: 60, height: 60, bgcolor: 'secondary.main' }}>
          <BorderColorIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Student Edit
        </Typography>
      </Box>
      <Box component="form" noValidate sx={{ mt: 1 }}>
        <TextField
          type="text"
          margin="normal"
          required
          fullWidth
          id="name"
          label="Student(s) Name"
          name="name"
          value={student.name}
          placeholder="name"
          onChange={onChangeHandler}
        />

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="group-name-label">Group Name *</InputLabel>
          <Select
            labelId="group-name-label"
            id="group-name"
            label="Group Name *"
            onChange={onChangeHandler}
            value={student?.group._id}
            name="select"
          >
            {groups
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((group, index) => (
                <MenuItem key={group._id} value={group._id} id={'group-name-option-' + index}>
                  {group.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        <TextField
          type="text"
          margin="normal"
          fullWidth
          id="photoUrl"
          label="Photo url"
          name="photoUrl"
          value={student.photoUrl}
          placeholder="photoUrl"
          onChange={onChangeHandler}
        />

        <Stack sx={{ p: 4 }} direction="row" spacing={2} justifyContent="center">
          <Button
            variant="contained"
            color="error"
            disabled={isLoading || student.group.name === 'Inactive'}
            onClick={onDeleteHandlerStudent}
          >
            Delete
          </Button>
          <Button variant="contained" disabled={isLoading} onClick={submitHandlerStudent}>
            Update
          </Button>
          <Button variant="contained" disabled={isLoading} onClick={() => {history.goBack()}}>
            Cancel
          </Button>
        </Stack>
        {isLoading && <LinearIndeterminate />}
      </Box>
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
