import React from 'react';
import { DAYS, GROUPS, groupTypes, MAX_NUMS_PHASES, schemaInit } from '../../consts';
import LinearLoader from '../../components/Loader/LinearLoader';
import { getSchemas, putSchemas } from '../../libs/reqFunct/Schemas';
import useInput from '../../hooks/input-hook';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import {Avatar, Box, Button, InputLabel, MenuItem, Select, Stack, Typography} from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import Divider from "@mui/material/Divider"
import EscalatorWarningIcon from '@mui/icons-material/EscalatorWarning';

export default function PairsSchema() {
  const [isLoad, setLoad] = React.useState(false);
  const [schemas, setSchemas] = React.useState(schemaInit);

  const { value: online, setValue: setOnline } = useInput(true);
  const { value: phase, setValue: setPhase } = useInput('1');

  React.useEffect(() => {
    (async () => {
      setLoad(true);
      const schemas = await getSchemas(phase);
      if (schemas) setSchemas((state) => ({ ...state, ...schemas }));
      setLoad(false);
    })();
  }, [phase]);

  const generateSchema = async (event, key, schema, phase) => {
    event.preventDefault();
    setLoad(true);
    const res = await putSchemas(key, schema, phase);
    setLoad(false);
    if (res?.message === 'ok')
      alert(`${key === 'offline' ? 'Оффлайн' : 'Онлайн'} схема обновлена...`);
    else alert(`Что то пошло не так... ${res?.err}`);
  };

  const setSchemasHandler = (week, day, key, people) => {
    setSchemas((state) => ({
      ...state,
      [key]: {
        ...state[key],
        [week]: { ...state[key][week], [day]: people }
      }
    }));
  };

  let line;
  online ? (line = 'online') : (line = 'offline');
  const weeks = Object.keys(schemas[line]);
  const phases = [...Array(MAX_NUMS_PHASES).keys()].map((x) => (++x).toString());

  return (
    <div id="#pairsschema">
      <Box sx={styles.formbox}>
        <Avatar sx={{ m: 2, width: 60, height: 60, bgcolor: 'secondary.main' }}>
          <EscalatorWarningIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Pairs Schema
        </Typography>
      </Box>
      <form name="radioGroup" onSubmit={(e) => generateSchema(e, line, schemas[line], phase)}>
        <div className="wrap">
          {weeks.map((week) => (
            <FormControl key={week}>
              <b>{week}</b>
              {DAYS.map((day) => (
                <div key={day} style={{marginTop: 15}}>
                  <FormLabel id={day}>{day}</FormLabel>
                  <Divider />
                  <RadioGroup aria-labelledby={day} name={'radio-buttons-group' + week}>
                    {Object.keys(GROUPS).map((group, i) => (
                      <FormControlLabel
                        key={i}
                        control={
                          <Radio
                            name={day + week}
                            type="radio"
                            disabled={isLoad}
                            checked={
                              schemas[line][week] && schemas[line][week][day] === GROUPS[group]
                            }
                            onChange={() => {
                              setSchemasHandler(week, day, line, GROUPS[group]);
                            }}
                          />
                        }
                        label={group}
                      />
                    ))}
                  </RadioGroup>
                </div>
              ))}
            </FormControl>
          ))}
        </div>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="group-name-label">Group Type *</InputLabel>
          <Select
            labelId="group-name-label"
            id="group-name"
            label="Group Type *"
            onChange={(e) => {
              setPhase(e.target.value);
            }}
            value={phase}
          >
            {phases.map((phaseNum) => {
              return (
                <MenuItem key={phaseNum} value={phaseNum}>
                  Phase {phaseNum}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        <Stack sx={{ p: 4 }} direction="row" spacing={2} justifyContent="center">
          <FormGroup>
            <FormControlLabel
              control={<Checkbox checked={online} onChange={(e) => setOnline(e.target.checked)} />}
              label="Online"
            />
          </FormGroup>
          <Button variant="contained" type="submit" disabled={isLoad}>
            Save {line} scheme
          </Button>
        </Stack>

        {isLoad && <LinearLoader />}
      </form>
    </div>
  );
}

const styles = {
  formbox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '20px'
  }
};
