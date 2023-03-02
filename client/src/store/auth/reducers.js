import actionTypes from "../types";

const initState = {
  isAuth: false,
  user: {},
  isLoading: true,
};

export const authReducer = (state = initState, action) => {
  switch (action.type) {

    case actionTypes.SET_AUTH:
      return { ...state, isAuth: action.payload.isAuth };

    case actionTypes.SET_USER:
      return {...state, user: action.payload.user};

    case actionTypes.SET_AUTH_LOADING:
      return {...state, isLoading: action.payload.isLoading};

      default:
      return state;
  }
};
