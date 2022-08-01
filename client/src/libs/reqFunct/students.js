export const getStudents = async (name = '', groupType) => {
  try {
    return (await fetch(`/api/students?name=${name}&groupType=${groupType}`)).json();
  } catch (e) {
    console.log('Group Page Error', e.message);
  }
};

export const getStudent = async (name, groupName) => {
  try {
    return (await fetch(`/api/students`)).json();
  } catch (e) {
    console.log('Group Page Error', e.message);
  }
};

export const getComment = async (stName, grName) => {
  try {
    return (await fetch(`/api/students/history/comment/last?name=${stName}&group=${grName}`)).json();
  } catch (e) {
    console.log('Group Page Error', e.message);
  }
};

export const updateStudentComment = async (name, groupName, historyEl) => {
  try {
    return (
      await fetch('/api/students', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({ name, groupName, historyEl })
      })
    ).json();
  } catch (e) {
    console.log('Group Page Error', e.message);
  }
};
