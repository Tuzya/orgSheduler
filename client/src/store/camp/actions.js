import actionTypes from '../types';

const setLoading = (isLoading) => ({ type: actionTypes.SET_CAMP_LOADING, payload: { isLoading } });
const setGroups = (groups) => ({ type: actionTypes.SET_GROUPS, payload: { groups } });
export const setGroup = (group) => ({ type: actionTypes.SET_GROUP, payload: { group } });
export const addGroup = (group) => ({ type: actionTypes.ADD_GROUP, payload: { group } });
export const delGroup = (id) => ({type: actionTypes.DEL_GROUP, payload: {id}})
const setError = (msg) => ({ type: actionTypes.ERROR, payload: { msg } });

//thunk async functions
export const getGroups = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await fetch('/api/groups/');

    if (!res.ok) throw new Error(`Server Error: ${res.statusText} ${res.status}`);
    const fetchedGroups = await res.json();
    if (fetchedGroups.err) throw new Error(`Err to get groups: ${fetchedGroups.err}`);

    // Сортировка студентов по имени, для отображения списка в badge.
    fetchedGroups.map((group) => group.students.sort());
    dispatch(setGroups(fetchedGroups));
  } catch (e) {
    console.error('Failed to fetch Groups', e.message);
    alert(e.message);
  } finally {
    dispatch(setLoading(false));
  }
};

export const getGroup = (groupId) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await fetch(`/api/groups/${groupId}`);
    if (!res.ok) throw new Error(`Server Error: ${res.statusText} ${res.status}`);
    const group = await res.json();
    if (group.err) throw new Error(`Err to get groups: ${group.err}`);
    dispatch(setGroup(group));
  } catch (e) {
    console.log('Group Page Error', e.message);
    alert(e.message);
  } finally {
    dispatch(setLoading(false));
  }
}

// async functions
export const createGroup = async (name, phase, groupType, students, shedule) => {
  try {
    return (
      await fetch('/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name,
          phase,
          groupType,
          students,
          shedule,
        }),
      })
    ).json();
  } catch (err) {
    console.log('Req GroupId err ', err.message);
  }
};

export const putGroup = async (name, phase, groupType, students, shedule, groupId) => {
  try {
    return (
      await fetch(`/api/groups/${groupId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name,
          phase,
          groupType,
          students,
          shedule
        }),
      })
    ).json();
  } catch (err) {
    console.log('Put group err ', err.message);
  }
};

export const updAllGroups = async (groups) => {
  try {
    return (
      await fetch(`/api/groups`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({groups}),
      })
    ).json();
  } catch (err) {
    console.log('UpdAll group err ', err.message);
  }
};

export const updCRTablesGroups = async (crtables, groupId) => {
  try {
    return (
      await fetch(`/api/groups/crtables/${groupId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({crtables}),
      })
    ).json();
  } catch (err) {
    console.log('Upd CRTables err ', err.message);
  }
};
