import * as React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

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
import Autocomplete from '@mui/material/Autocomplete/Autocomplete';

import { getShedule } from '../../libs/groups-splitter';
import './GroupEditForm.css';
import useInput from '../../hooks/input-hook';
import { getSchemas } from '../../libs/reqFunct/Schemas';
import { groupTypes, MAX_NUMS_PHASES } from '../../consts';
import { delGroup, getGroups, putGroup } from '../../store/camp/actions';

export default function GroupEditForm() {
  const history = useHistory();
  const { groupId } = useParams();
  const dispatch = useDispatch();

  const { value: name, bind: bindName, setValue: setName } = useInput('');
  const { value: phase, bind: bindPhase, setValue: setPhase } = useInput('');
  const { value: students, setValue: setStudents } = useInput([]);
  const { value: shedule, bind: bindShedule, setValue: setShedule } = useInput([], 'json');
  const { value: groupType, setValue: setGroupType } = useInput(false);

  const [defaultStudents, setDefaultStudents] = React.useState([]);
  const [allStudents, setAllStudents] = React.useState([]);
  const [deletedStudents, setDeletedStudents] = React.useState([]);
  const [isLoad, setLoad] = React.useState(true);
  React.useEffect(() => {
    (async () => {
      setLoad(true);
      try {
        const group = await (await fetch(`/api/groups/${groupId}`)).json();
        const allStudents = await (
          await fetch(`/api/students?search=${JSON.stringify({ groupType: group.groupType })}`)
        ).json();
        let waitListStudents = await (
          await fetch(`/api/students?search=${JSON.stringify({ groupType: groupTypes.waitlist })}`)
        ).json();
        if (waitListStudents.length) allStudents.push(...waitListStudents); // добавляем в список студентов из waitlist

        const defaultStudents = group.students.map((student1) =>
          allStudents.find((student2) => student1._id === student2._id)
        );
        setAllStudents(allStudents.sort((a, b) => a.name.localeCompare(b.name)));
        setName(group.name);
        setPhase(group.phase);
        setGroupType(group.groupType);
        setStudents(group.students);
        setDefaultStudents(defaultStudents.sort((a, b) => a.name.localeCompare(b.name)));
        setShedule(JSON.stringify(group.shedule, '', 4));
      } catch (e) {
        console.error('Load error group', e.message);
        alert(`Load error group. ${e.message}`);
      } finally {
        setLoad(false);
      }
    })();
  }, [groupId, setName, setPhase, setShedule, setStudents, setGroupType]);

  const updateGroup = async (event) => {
    event.preventDefault();
    if (!students.length || parseInt(phase) > MAX_NUMS_PHASES || parseInt(phase) < 1 || !name)
      return alert('Ошибка валидации формы');
    setLoad(true);
    const res = await putGroup(
      name,
      phase,
      groupType,
      students.map((student) => student._id),
      deletedStudents,
      JSON.parse(shedule),
      groupId
    );
    if (res?.message === 'ok') {
      await dispatch(getGroups());
      return history.push(`/groups/${groupId}`);
    } else alert(`Что то пошло не так... ${res.err}`);
    setLoad(false);
  };

  const regenerateSchedule = async (event) => {
    setLoad(true);
    event.preventDefault();
    const studentsArr = students.map((student) => student.name);
    setDefaultStudents(students);
    const schemas = await getSchemas(phase);
    if (schemas) {
      const generatedShedule = getShedule(
        studentsArr,
        undefined,
        groupType === groupTypes.online,
        phase,
        schemas,
        true
      );
      setShedule(JSON.stringify(generatedShedule, '', 4));
    }
    setLoad(false);
  };

  const deleteGroup = async (event) => {
    event.preventDefault();
    if (!window.confirm(`Удалить группу ${name}?`)) return;
    setLoad(true);
    try {
      const response = await fetch(`/api/groups/${groupId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      });
      const delData = await response.json();
      if (delData.err) throw new Error(`Error while delete: ${delData.err}`);
      await dispatch(delGroup(groupId));
      setLoad(false);
      history.push('/groups');
    } catch (err) {
      console.log('Error while delete:', err.message);
      alert(`Error while delete: ${err.message}`);
      setLoad(false);
    }
  };

  const handleChange = ({ target }) => {
    setGroupType(target.value);
  };

  const onInputStudentsHandler = (students, reason, student) => {
    if (reason === 'removeOption') {
      setDeletedStudents((prevSt) => [...new Set([...prevSt, student.option._id])]);
      setStudents(students);
    }
    if (reason === 'selectOption') {
      setStudents(students);
      setDeletedStudents((prevSt) =>
        prevSt.filter(
          (deletedStudent) => !students.map((student) => student._id).includes(deletedStudent)
        )
      );
    }
  };

  if (isLoad) return <div className="spinner" />;

  return (
    <>
      <Container component="main" maxWidth="xl" sx={{ mt: 0 }}>
        <Box sx={styles.formbox}>
          <Avatar sx={{ m: 1, width: 60, height: 60, bgcolor: 'secondary.main' }}>
            <BorderColorIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Group edit
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
                {Object.keys(groupTypes).map((type) => (
                  <MenuItem disabled={true} key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Stack spacing={3} sx={{ mt: 2, width: 738 }}>
              <Autocomplete
                multiple
                id="tags-outlined"
                options={allStudents}
                getOptionLabel={(option) => option?.name}
                defaultValue={defaultStudents}
                filterSelectedOptions
                disableClearable
                onChange={(event, value, reason, details) => {
                  onInputStudentsHandler(value, reason, details);
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Students" placeholder="Добавить " />
                )}
              />
            </Stack>

            <Stack sx={{ pt: 2 }} direction="row" spacing={2} justifyContent="center">
              <Button variant="contained" disabled={isLoad} onClick={regenerateSchedule}>
                generate pairs by scheme
              </Button>
            </Stack>

            <TextField
              sx={styles.textarea}
              {...bindShedule}
              placeholder="Shedule"
              name="schedule"
              disabled={isLoad}
              multiline
            />

            <Stack sx={{ pt: 4 }} direction="row" spacing={2} justifyContent="center">
              <Button variant="contained" disabled={isLoad} onClick={updateGroup}>
                Update
              </Button>
              <Button variant="contained" color="error" disabled={isLoad} onClick={deleteGroup}>
                Delete
              </Button>
            </Stack>
          </Box>
        </Box>
      </Container>
    </>
  );
}

const styles = {
  textarea: {
    overflowY: 'scroll',
    height: '300px',
    width: '738px',
    resize: 'none',
    border: 'lightgrey 1px solid',
    mt: 2
  },
  formbox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
};
