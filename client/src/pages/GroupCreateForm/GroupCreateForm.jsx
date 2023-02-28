import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import './GroupCreateForm.css';
import useInput from '../../hooks/input-hook';
import { getSchemas } from '../../libs/reqFunct/Schemas';
import { getShedule } from '../../libs/groups-splitter';
import { groupTypes, MAX_NUMS_PHASES } from '../../consts';
import { createGroup, addGroup } from '../../store/camp/actions';
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
import AddIcon from '@mui/icons-material/Add';
import LinearIndeterminate from '../../components/Loader/LinearIndeterminate';

export default function GroupCreateForm() {
  const history = useHistory();
  const [isLoad, setLoad] = React.useState(false);
  const { setValue: setGroupId } = useInput('');
  const { value: name, bind: bindName } = useInput(sessionStorage.getItem('name') || '');
  const { value: phase, bind: bindPhase } = useInput(sessionStorage.getItem('phase') || '');
  const { value: students, bind: bindStudents } = useInput(
    sessionStorage.getItem('students') || ''
  );
  // const { setValue: setSchedule } = useInput([]);
  const { value: groupType, setValue: setGroupType } = useInput('online');
  const dispatch = useDispatch();

  const generateSchedule = async (event) => {
    event.preventDefault();
    if (!students.length || parseInt(phase) > MAX_NUMS_PHASES || parseInt(phase) < 1 || !name)
      return alert('Ошибка валидации формы');
    // удаляем лишние пробелы между слов, убираем запятые в конце, исключаем повторяющиеся имена
    const studentsArr = [...new Set(students.replace(/\s+/g, ' ').replace(/,\s*$/, '').trim().split(/ *, */g))];

    setLoad(true);
    const schemas = await getSchemas(phase);
    const online = groupType === groupTypes.online;
    if (!schemas?.[online ? 'online' : 'offline']) {
      alert(
        `Схема для фазы ${phase} ${
          online ? 'онлайн' : 'оффлайн'
        } группы не существует.\nСперва создайте эту схему.`
      );
      setLoad(false);
      sessionStorage.setItem('name', name);
      sessionStorage.setItem('phase', phase);
      sessionStorage.setItem('students', students);
      return history.push('/groups/schema');
    }
    const generatedShedule = getShedule(
      studentsArr,
      4,
      groupType === groupTypes.online,
      phase,
      schemas,
      false
    );
    const group = await createGroup(name, phase, groupType, studentsArr, generatedShedule);
    if (group.err) {
      setLoad(false);
      return alert(group.err);
    }
    setGroupId(group._id);
    dispatch(addGroup(group));
    // setSchedule(generatedSchedule); // TODO: check if is is ok
    setLoad(false);
    sessionStorage.clear();
    return history.push(`/groups/${group._id}`);
  };

  const handleChange = ({ target }) => {
    setGroupType(target.value);
  };
  return (
    <>
      <Container component="main" maxWidth="xl" sx={{ mt: 0 }}>
        <Box sx={styles.formbox}>
          <Avatar sx={{ m: 1, width: 60, height: 60, bgcolor: 'secondary.main' }}>
            <AddIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Group create
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              {...bindName}
              type="text"
              margin="normal"
              required
              fullWidth
              id="name"
              label="Group Name"
            />
            <TextField
              {...bindStudents}
              type="text"
              margin="normal"
              required
              fullWidth
              id="Students"
              label="Students names by comma"
            />
            <TextField
              {...bindPhase}
              margin="normal"
              required
              fullWidth
              label="Phase"
              type="number"
              id="phase"
              InputProps={{ inputProps: { min: 1, max: MAX_NUMS_PHASES } }}
            />

            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="group-type-label">Group Type</InputLabel>
              <Select
                labelId="group-type-label"
                id="group-type"
                label="Group Type"
                onChange={handleChange}
                value={groupType}
              >
                {Object.keys(groupTypes)
                  .filter((type) => type !== groupTypes.waitlist && type !== groupTypes.inactive)
                  .map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            <Stack sx={{ p: 4 }} direction="row" spacing={2} justifyContent="center">
              <Button variant="contained" disabled={isLoad} onClick={generateSchedule}>
                Create
              </Button>
            </Stack>
            {isLoad && <LinearIndeterminate />}
          </Box>
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
