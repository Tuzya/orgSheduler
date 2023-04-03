import actionTypes from '../types';

const initState = {
  groups: [],
  group: {},
  isLoading: true,
  error: false
};

export const campReducer = (state = initState, action) => {
  switch (action.type) {
    case actionTypes.SET_GROUPS:
      return { ...state, groups: action.payload.groups };

    case actionTypes.SET_GROUP:
      const groups_set = state.groups.map((group) => {
        if (group._id === action.payload.group._id) return action.payload.group;
        return group;
      });
      return { ...state, group: action.payload.group, groups: groups_set };

    case actionTypes.ADD_GROUP:
      return { ...state, groups: [...state.groups, action.payload.group] };

    case actionTypes.DEL_GROUP:
      const groups_del = state.groups.filter((group) => group._id !== action.payload.id);
      return { ...state, groups: groups_del };

    case actionTypes.SET_CAMP_LOADING:
      return { ...state, isLoading: action.payload.isLoading };

    case actionTypes.ERROR:
      return { ...state, error: action.payload.msg };

    default:
      return state;
  }
};
