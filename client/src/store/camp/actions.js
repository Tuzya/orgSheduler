import actionTypes from '../types';

const setLoading = (isLoading) => ({ type: actionTypes.SET_CAMP_LOADING, payload: { isLoading } });
const setGroups = (groups) => ({ type: actionTypes.SET_GROUPS, payload: { groups } });
export const setGroup = (group) => ({ type: actionTypes.SET_GROUP, payload: { group } });
export const addGroup = (group) => ({ type: actionTypes.ADD_GROUP, payload: { group } });
export const delGroup = (id) => ({type: actionTypes.DEL_GROUP, payload: {id}})
const setError = (msg) => ({ type: actionTypes.ERROR, payload: { msg } });

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
    const group = await (await fetch(`/api/groups/${groupId}`)).json();
    if (group) dispatch(setGroup(group));
    else alert('Не удалось получить группу');
  } catch (e) {
    console.log('Group Page Error', e.message);
  } finally {
    dispatch(setLoading(false));
  }
}
