import * as React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import { getShedule } from '../../libs/groups-splitter';
import './GroupEditForm.css';
import useInput from '../../hooks/input-hook';
import { getSchemas } from '../../libs/reqFunct/Schemas';
import { groupTypes, MAX_NUMS_PHASES } from '../../consts';
import { delGroup, getGroups, putGroup } from '../../store/camp/actions';
import Autocomplete from "@mui/material/Autocomplete/Autocomplete"

export default function GroupEditForm() {
  const history = useHistory();
  const { groupId } = useParams();
  const dispatch = useDispatch();

  const { value: name, bind: bindName, setValue: setName } = useInput('');
  const { value: phase, bind: bindPhase, setValue: setPhase } = useInput('');
  const { value: students, bind: bindStudents, setValue: setStudents } = useInput('');
  const { value: shedule, bind: bindShedule, setValue: setShedule } = useInput([], 'json');
  const { value: groupType, setValue: setGroupType } = useInput(false);
  const [isLoad, setLoad] = React.useState(true);
  React.useEffect(() => {
    (async () => {
      setLoad(true);
      try {
        const group = await (await fetch(`/api/groups/${groupId}`)).json();
        console.log('file-GroupEditForm.jsx group.students:', group.students);
        setName(group.name);
        setPhase(group.phase);
        setGroupType(group.groupType);
        // setStudents(String(group.students.map((student) => student.name)));
        setStudents(group.students);
        setShedule(JSON.stringify(group.shedule, '', 4));
      } catch (e) {
        console.error('Load error group', e.message);
        alert(`Load error group. ${e.message}`);
      } finally {
        setLoad(false);
      }
    })();
  }, [groupId, setName, setPhase, setShedule, setStudents, setGroupType]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password')
    });
  };

  const updateGroup = async (event) => {
    event.preventDefault();
    const res = await putGroup(
      //todo try-catch
      name,
      phase,
      groupType,
      students.split(/ *, */g),
      JSON.parse(shedule),
      groupId
    );
    if (res?.message === 'ok') {
      await dispatch(getGroups());
      return history.push(`/groups/${groupId}`);
    } else alert(`Что то пошло не так... ${res.err}`);
  };

  const regenerateSchedule = async (event) => {
    setLoad(true);
    event.preventDefault();
    const studentsArr = students.split(/ *, */g);

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
    try {
      const response = await fetch(`/api/groups/${groupId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      });
      if (response.status === 200) {
        await dispatch(delGroup(groupId));
        history.push('/groups');
      } else alert(`Error while delete: ${response.status}`);
    } catch (e) {
      console.log('Error while delete:', e.message);
      alert(`Error while delete: ${e.message}`);
    }
  };

  const handleChange = ({ target }) => {
    setGroupType(target.value);
  };

  if (isLoad) return <div className="spinner" />;

  return (
    <>
      <form name="editGroup" onSubmit={updateGroup}>
        <div className="input-field col s12">
          <input id="Groupname" type="text" {...bindName} placeholder="Groupname" />
          <label htmlFor="Groupname">Groupname</label>
        </div>
        <input
          type="number"
          {...bindPhase}
          placeholder="Phase"
          min="1"
          max={MAX_NUMS_PHASES.toString()}
        />
        <input type="text" {...bindStudents} placeholder="Students" />
        <div className="input-field" style={{ minWidth: '300px' }}>
          <select className="browser-default" onChange={handleChange} value={groupType}>
            {Object.keys(groupTypes).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <button type="button" className="btn" disabled={isLoad} onClick={regenerateSchedule}>
          generate pairs by scheme
        </button>
        <textarea name="schedule" {...bindShedule} disabled={isLoad} placeholder="Shedule" />
        <button type="submit" className="btn" disabled={isLoad}>
          Update
        </button>
        <button type="button" className="btn btn-danger" disabled={isLoad} onClick={deleteGroup}>
          DELETE
        </button>
      </form>

      <Container component="main" maxWidth='xl'>
        <CssBaseline />
        <Box
          sx={styles.formbox}
        >
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
            {console.log('file-GroupEditForm.jsx bindStudents:', bindStudents)}
            <TextField
              {...bindStudents}
              margin="normal"
              required
              fullWidth
              label="Students"
              type="text"
              id="students"
            />

            <Stack spacing={3} sx={{ width: 738 }}>
              <Autocomplete
                multiple
                id="tags-outlined"
                options={students}
                getOptionLabel={(option) => option.name}
                defaultValue={students}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}

                    label="Students"
                    placeholder="Добавить "
                  />
                )}
              />
            </Stack>

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
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

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
    marginTop: 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
}
