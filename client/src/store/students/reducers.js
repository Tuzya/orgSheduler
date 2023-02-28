import actionTypes from "../types";


const initState = {
  data: [],
  student: {
    name: '',
    group: { _id: '', name: '' },
    photoUrl: '',
    history: []
  },
  isLoading: true,
};

export const studentsReducer = (state = initState, action) => {
  switch (action.type) {

    case actionTypes.SET_STUDENTS:
      return { ...state, data: action.payload.students };

    case actionTypes.SET_STUDENT:
      return { ...state, student: action.payload.student };

    case actionTypes.DEL_STUDENT:
      const students = state.data.filter((student) => student._id !== action.payload.id)
      return { ...state, students };

    case actionTypes.SET_STUD_LOADING:
      return { ...state, isLoading: action.payload.isLoad };

    default:
      return state;
  }
};
