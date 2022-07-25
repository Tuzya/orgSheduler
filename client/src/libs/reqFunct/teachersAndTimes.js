export const getTeachersAndGaps = async () => {
  try {
    return (await fetch('/api/teachersandtime')).json();
  } catch (e) {
    console.log('Group Page Error', e.message);
  }
};
