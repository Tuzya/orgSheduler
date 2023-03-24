import actionTypes from '../types';
import { getTeachersAndGaps } from '../../libs/reqFunct/teachersAndTimes';

// const setTeachers = (teachers) => ({ type: actionTypes.SET_TEACHERS, payload: { teachers } });
// const setTimegaps = (timeGaps) => ({ type: actionTypes.SET_TIMEGAPS, payload: { timeGaps } });
// const setCrtables = (crTables) => ({ type: actionTypes.SET_CRTABLES, payload: { crTables } });
const setPopUpData = (data) => ({ type: actionTypes.SET_POPUPDATA, payload: { data } });

export const getPopUpData = () => async (dispatch) => {
  try {
    const teachersAndGaps = await getTeachersAndGaps();
    const groups = await (await fetch('/api/groups/')).json();
    if (teachersAndGaps?.err || groups.err)
      return alert(`Error to get popUpData: ${teachersAndGaps.err || groups.err}`);
    const data = {
      teachersAndGaps: teachersAndGaps,
      groupsCrTables: groups
        .filter((group) => group.crtables.length)
        .map((group) => ({ name: group.name, groupType: group.groupType, crtables: group.crtables })),
    };
    dispatch(setPopUpData(data));
  } catch (e) {
    console.error('Failed to fetch popUpData', e.message);
    alert(e.message);
  }
};
