import actionTypes from "../types";


const initState = {
};

export const todoReducer = (state = initState, action) => {
  switch (action.type) {

    case '':
      return { ...state };


    default:
      return state;
  }
};
