import React from 'react';
import { useHistory } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';

import useInput from '../../hooks/input-hook';
import { groupTypes } from '../../consts';
import { addGroup, getGroups} from '../../store/camp/actions';
import {
  Avatar,
  Button,
  TextField,
  Box,
  Typography,
  Container,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import LinearIndeterminate from "../../components/Loader/LinearIndeterminate"
import {createStudents} from "../../store/students/actions"


export default function StudentsCreateForm() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [isLoad, setLoad] = React.useState(false);
  const groups = useSelector((state) => state.camp.groups).filter((group) => (group.groupType === groupTypes.waitlist));
  const { value: studentsNames, bind: bindNames } = useInput('');
  const { value: groupId, setValue: setGroupId } = useInput('');
  React.useEffect(() => {
    if(groups.length === 0) {
      dispatch(getGroups());
    }
  }, [])
  const createStudent = async (event) => {
    event.preventDefault();
    if (!studentsNames || !groupId) return alert('Ошибка валидации формы');
    const studentsNamesArr = studentsNames.split(/ *, */g);
    setLoad(true);

    const students = await createStudents(studentsNamesArr, groupId);
    console.log('file-StudentsCreate.jsx students:', students);
    if (students.err) {
      setLoad(false);
      return alert(students.err);
    }
    alert(`${studentsNames} created successfully.`)
    // dispatch(addGroup(group));

    setLoad(false);

    // return history.push(`/groups/${group._id}`);
  };

  const handleChange = ({ target }) => {
    setGroupId(target.value);
  };
  return (
    <>
      <Container component="main" maxWidth="xl" sx={{ mt: 0 }}>
        <Box sx={styles.formbox}>
          <Avatar sx={{ m: 1, width: 60, height: 60, bgcolor: 'secondary.main' }}>
            <BorderColorIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Students create
          </Typography>
        </Box>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              {...bindNames}
              type="text"
              margin="normal"
              required
              fullWidth
              id="name"
              label="Student(s) Name"
            />

            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="group-name-label">Group Name *</InputLabel>
              <Select
                labelId="group-name-label"
                id="group-name"
                label="Group Name *"
                onChange={handleChange}
                value={groupId}
              >
                {groups.sort((a, b) => a.name.localeCompare(b.name)).map((group) => (
                  <MenuItem key={group._id} value={group._id}>
                    {group.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>


            <Stack sx={{ p: 4 }} direction="row" spacing={2} justifyContent="center">
              <Button variant="contained" disabled={isLoad} onClick={createStudent}>
                Create
              </Button>
            </Stack>
            {isLoad && <LinearIndeterminate/>}
          </Box>

      </Container>
    </>
  );
}

const styles = {
  formbox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
};



