export const getTeachersAndGaps = async (groupType) => {
  try {
    return (await fetch(`/api/teachersandtime?groupType=${groupType}`)).json();
  } catch (e) {
    console.log('Group Page Error', e.message);
  }
};

export const updateTeachersAndGaps = async (teachers, timegaps, groupType) => {
  try {
    return (
      await fetch('/api/teachersandtime', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({ teachers, timegaps, groupType })
      })
    ).json();
  } catch (e) {
    console.log('Group Page Error', e.message);
  }
};
