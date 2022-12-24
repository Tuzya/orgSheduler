import actionTypes from '../types';

const initState = {
  teachersAndGaps: [],
  groupsCrTables: [],
};

export const popupReducer = (state = initState, action) => {
  switch (action.type) {
    case actionTypes.SET_POPUPDATA:
      return {
        ...state,
        teachersAndGaps: action.payload.data.teachersAndGaps,
        groupsCrTables: action.payload.data.groupsCrTables
      };

    default:
      return state;
  }
};
