import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import './Schema.css';
import { daysCR, groupTypes } from '../../consts';
import { getTeachersAndGaps, updateTeachersAndGaps } from '../../libs/reqFunct/teachersAndTimes';
import useInput from '../../hooks/input-hook';
import { getGroups, updAllGroups } from '../../store/camp/actions';
import {
  Avatar,
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import LinearIndeterminate from '../../components/Loader/LinearIndeterminate';
import Checkbox from '@mui/material/Checkbox';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

export default function CodeReviewSchema() {
  const [groups, setGroups] = React.useState([]);
  const [isLoad, setLoad] = React.useState(true);

  const { value: groupType, setValue: setGrType } = useInput(groupTypes.online);
  const { value: teachers, bind: bindTeachers, setValue: setTeachers } = useInput('');
  const { value: timegaps, bind: bindTimegaps, setValue: setTimegaps } = useInput('');
  const history = useHistory();
  const dispatch = useDispatch();

  React.useEffect(() => {
    (async () => {
      setLoad(true);
      try {
        const fetchedGroups = await (await fetch('/api/groups/')).json();
        if (fetchedGroups.err) {
          setLoad(false);
          return alert(` Err to get groups: ${fetchedGroups.err}`);
        }
        let schemaCRInitGroups = fetchedGroups?.map((group) => {
          if (!group.crshedule) group.crshedule = { crdays: { ...daysCR } };
          group.students = group.students.map((student) => student.name);
          return group;
        });

        setGroups(schemaCRInitGroups);
      } catch (e) {
        console.error('Failed CodeReviewSchema', e.message);
      } finally {
        setLoad(false);
      }
    })();
  }, []);

  React.useEffect(() => {
    (async () => {
      setLoad(true);
      try {
        const teachersAndGaps = await getTeachersAndGaps(groupType);
        if (teachersAndGaps?.err) {
          setLoad(false);
          return alert(`Error to get list of teachers: ${teachersAndGaps.err}`);
        }
        if (teachersAndGaps) {
          setTeachers(String(teachersAndGaps.teachers));
          setTimegaps(String(teachersAndGaps.timegaps));
        }
      } catch (e) {
        console.error('Failed to get teachers or timegaps', e.message);
      } finally {
        setLoad(false);
      }
    })();
  }, [groupType]);

  const setDaysAndGroup = (dayName, grName, isChecked) => {
    setGroups((state) => {
      return state.map((group) => {
        if (group.name === grName) {
          group.crshedule.crdays[dayName] = isChecked;
        }
        return group;
      });
    });
  };
  const setCRSchemasToGroups = async (event, groups) => {
    event.preventDefault();
    setLoad(true);
    try {
      const resGr = await updAllGroups(groups);
      const resTG = await updateTeachersAndGaps(
        teachers.split(/ *, */g),
        timegaps.split(/ *, */g),
        groupType
      );
      if (resGr?.message === 'ok' && resTG?.message === 'ok') {
        await dispatch(getGroups());
        setLoad(false);
        alert('Code Review Schema updated.');
        history.push('/');
      } else alert(`Что то пошло не так... ${resGr?.err + resTG?.err}`);
    } catch (err) {
      console.log('Error generateCRSchema', err.message);
      setLoad(false);
    }
  };

  return (
    <Container component="main" maxWidth="xl" sx={{ mt: 0 }}>
      <Box sx={styles.formbox}>
        <Avatar sx={{ m: 1, width: 60, height: 60, bgcolor: 'secondary.main' }}>
          <CodeIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Code Review Schema
        </Typography>
      </Box>
      <Box component="form" noValidate sx={{ mt: 1 }}>
        <TextField
          {...bindTeachers}
          id="teachers"
          type="text"
          value={teachers}
          label="Teachers"
          margin="normal"
          required
          fullWidth
        />

        <TextField
          {...bindTimegaps}
          id="timegaps"
          type="text"
          className="validate"
          value={timegaps}
          label="Time Gaps"
          margin="normal"
          required
          fullWidth
        />
        <Box sx={{ mt: 2 }}>
          {groups
            .filter((group) => group.groupType === groupType)
            .map((group) => (
              <div key={group.name} style={{ marginTop: 15 }}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">{`${group.groupType} ${group.phase} Ph 
                    ${group.name} ${group.students.length} st.`}</FormLabel>
                  <FormGroup aria-label="position" row>
                    {Object.keys(group.crshedule.crdays).map((day) => (
                      <FormControlLabel
                        key={day}
                        value="top"
                        control={
                          <Checkbox
                            checked={group.crshedule.crdays[day]}
                            onChange={(e) => setDaysAndGroup(day, group.name, e.target.checked)}
                          />
                        }
                        label={day}
                      />
                    ))}
                  </FormGroup>
                </FormControl>
              </div>
            ))}
        </Box>

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="group-name-label">Group Type *</InputLabel>
          <Select
            labelId="group-name-label"
            id="group-name"
            label="Group Type *"
            onChange={(e) => {
              setGrType(e.target.value);
            }}
            value={groupType}
          >
            {Object.keys(groupTypes).map((type) => {
              return (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        <Stack sx={{ p: 4 }} direction="row" spacing={2} justifyContent="center">
          <Button
            variant="contained"
            type="button"
            disabled={isLoad}
            onClick={(e) => setCRSchemasToGroups(e, groups)}
          >
            Save CodeReview scheme
          </Button>
        </Stack>
      </Box>
      {isLoad && <LinearIndeterminate />}
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
