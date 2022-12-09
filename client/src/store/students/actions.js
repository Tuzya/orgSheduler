import actionTypes from "../types";

const setStudents = (students) => ({type: actionTypes.SET_STUDENTS, payload: {students}});
const setStudent = (student) => ({type: actionTypes.SET_STUDENT, payload: {student}});
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

export const getStudent = (id) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await fetch(`/api/students/${id}`);
    if (!res.ok) throw new Error(`Server Error: ${res.statusText} ${res.status}`);
    const student = await res.json();
    if (student.err) throw new Error(`Err to get students: ${student.err}`);
    dispatch(setStudent(student));
  } catch (e) {
    console.error('Failed to fetch Students', e.message);
    alert(e.message);
  } finally {
    dispatch(setLoading(false));
  }
}

export const createStudents = async (studentsNamesArr, groupId) => {
  try {
    return (
      await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({studentsNamesArr, groupId}),
      })
    ).json();
  } catch (err) {
    console.log('createStudents err ', err.message);
    return err.message;
  }
};

// export const getStudent = async (id)  => {
//   try {
//     return (await fetch(`/api/students/${id}`)).json();
//   } catch (e) {
//     console.log('Failed to fetch Student', e.message);
//   }
// };

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
      await fetch('/api/students/history/comment', {
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

export const updateStudent = async (id, name, group_id, photoUrl) => {
  try {
    return (
      await fetch(`/api/students/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({ name, group_id, photoUrl })
      })
    ).json();
  } catch (e) {
    console.log('Group Page Error', e.message);
  }
};
