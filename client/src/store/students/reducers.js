import actionTypes from "../types";


const initState = {
  data: [],
  isLoading: true,
};

export const studentsReducer = (state = initState, action) => {
  switch (action.type) {

    case actionTypes.SET_STUDENTS:
      return { ...state, data: action.payload.students };

    case actionTypes.SET_STUD_LOADING:
      return { ...state, isLoading: action.payload.isLoad };

    default:
      return state;
  }
};
