import actionTypes from "../types";

const setStudents = (students) => ({type: actionTypes.SET_STUDENTS, payload: {students}});
const setLoading = (isLoad) => ({type: actionTypes.SET_STUD_LOADING, payload: {isLoad}})

export const getStudents = (searchProps) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
   const res = await fetch(`/api/students?search=${JSON.stringify(searchProps)}`);
    if (!res.ok) throw new Error(`Server Error: ${res.statusText} ${res.status}`);
   const students = await res.json();
    if (students.err) throw new Error(`Err to get students: ${students.err}`);
  dispatch(setStudents(students));
  } catch (e) {
    console.error('Failed to fetch Students', e.message);
    alert(e.message);
  } finally {
    dispatch(setLoading(false));
  }
}

export const getStudent = async (id)  => {
  try {
    return (await fetch(`/api/students/${id}`)).json();
  } catch (e) {
    console.log('Failed to fetch Student', e.message);
  }
};

export const getComment = async (stName, grName, date) => {
  try {
    return (await fetch(`/api/students/history/comment/last?name=${stName}&group=${grName}&date=${date}`)).json();
  } catch (e) {
    console.log('Group Page Error', e.message);
  }
};

export const updateStudentComment = async (name, groupId, historyEl) => {
  try {
    return (
      await fetch('/api/students', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({ name, groupId, historyEl })
      })
    ).json();
  } catch (e) {
    console.log('Group Page Error', e.message);
  }
};
