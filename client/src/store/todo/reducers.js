import actionTypes from "../types";


const initState = {
  todos: [
    { id: "001", value: "Помыть кота чисто", done: false },
    { id: "002", value: "Купить хлеб ", done: false },
    { id: "003", value: "Выучить Redux-Thunk ", done: false },
  ],
  loading: false,
  error: false,
};

export const todoReducer = (state = initState, action) => {
  switch (action.type) {

    case actionTypes.DONE_TODO:
      const newTodos = state.todos.map((todo) => {
        if (todo.id === action.payload.id) todo.done = !todo.done;
        return todo;
      });
      return { ...state, todos: newTodos };

    case actionTypes.DEL_ALL_TODOS:
      return {
        ...state,
        todos: [],
      };

    case actionTypes.ADD_TODO:
      return { ...state, todos: [...state.todos, action.payload.todo] };

    case actionTypes.DEL_TODO:
      return {
        ...state,
        todos: state.todos.filter((item) => item.id !== action.payload.id),
      };

    case actionTypes.LOADING:
      return { ...state, loading: true };

    case actionTypes.LOADED:
      return { ...state, loading: false };

    case actionTypes.ERROR:
      return { ...state, error: action.payload.msg };

    default:
      return state;
  }
};
