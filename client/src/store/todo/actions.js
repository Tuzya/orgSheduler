import actionTypes from "../types";

export const addTodoAC = (todo) => ({ type: actionTypes.ADD_TODO, payload: { todo: todo } });
export const doneTodoAC = (id) => ({type: actionTypes.DONE_TODO, payload: { id: id }});
export const delTodoAC = (id) => ({ type: actionTypes.DEL_TODO, payload: { id: id }});
export const delAllTodosAC = () => ({ type: actionTypes.DEL_ALL_TODOS });

export const loadingAC = () => ({ type: actionTypes.LOADING });
export const loadedAC = () => ({ type: actionTypes.LOADED });

export const setError = (msg) => ({ type: actionTypes.ERROR, payload: {msg} });


export const getJokeThunk = () => async (dispatch) => {
  dispatch(loadingAC());
  dispatch(setError(false));
  try {
    const response = await fetch("https://api.chucknorris.io/jokes/random");
    const data = await response.json();
    const todo = {
      id: new Date().valueOf().toString(),
      value: data.value,
      done: false,
    };
    dispatch(addTodoAC(todo));
  } catch (err) {
    dispatch(setError(err.message));
    console.log("Err", err);
  } finally {
    dispatch(loadedAC());
  }
};
