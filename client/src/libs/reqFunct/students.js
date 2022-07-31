export const getStudents = async () => {
  try {
    return (await fetch(`/api/students`)).json();
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

export const getComment = async (commentId) => {
  try {
    return (await fetch(`/history/comment/:${commentId}`)).json();
  } catch (e) {
    console.log('Group Page Error', e.message);
  }
};

// phase: Number, groupType: String, date: Date, teacher: String, comment: String
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
