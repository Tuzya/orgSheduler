import { createTheme } from "@mui/material";

export const GROUPS = {
  groups: 'groups',
  pairs: 'pairs',
  solo: 'solo'
};

export const groupTypes = {
  online: 'online',
  msk: 'msk',
  spb: 'spb'
}

export const DAYS = ["mon", "tue", "wed", "thu", "fri"];

export const DAYTORU = {
  "mon": 'пн.',
  "tue": 'вт.',
  "wed": 'ср.',
  "thu": 'чт.',
  "fri": 'пт.',
};

const days = Object.fromEntries(DAYS.map((day)=>([[day], GROUPS.solo])));
export const daysCR = Object.fromEntries(DAYS.map((day)=>([[day], false])));
const offSoloDays = {
  w1: days,
  w2: days,
  w3: days,
};

const onSoloDays = {
  w1: days,
  w2: days,
  w3: days,
  w4: days,
};

export const schemaInit = {
  offline: offSoloDays,
  online: onSoloDays,
};

export const PEOPLE_PER_PAIR = 2;
export const PEOPLE_PER_GR = 3;
export const MAX_NUMS_PHASES = 3;

export const rating = [
  {name: "5", id: "5"},
  {name: "4", id: "4"},
  {name: "3", id: "3"},
  {name: "2", id: "2"},
  {name: "1", id: "1"},
  {name: "0", id: "0"},
];

export const theme = createTheme({
  palette: {
    primary: { main: '#4520ab' },
    secondary: { main: '#4db6ac' },
    type: 'light'
  }
});


