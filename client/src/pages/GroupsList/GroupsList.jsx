import React from 'react';
import GroupItem from '../../components/GroupItem/GroupItem';
import { getGroups } from '../../store/camp/actions';
import { useDispatch, useSelector } from 'react-redux';
import { groupTypes } from '../../consts';

function GroupsList({ isAuth }) {
  const groups = useSelector((state) => state.camp.groups);
  const isLoading = useSelector((state) => state.camp.isLoading);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (groups.length === 0) dispatch(getGroups());
  }, [dispatch]);

  if (isLoading) return <div className="spinner">Loading Groups...</div>;
  if (groups.length === 0)
    return (
      <div className="collection" style={{ textAlign: 'center' }}>
        Список групп пуст
      </div>
    );

  return (
    <div className="collection">
      {groups
        .filter(
          (group) =>
            group.groupType !== groupTypes.inactive && group.groupType !== groupTypes.waitlist
        )
        .map((group) => (
          <GroupItem
            key={group._id}
            isAuth={isAuth}
            name={group.name}
            link={`/groups/${group._id}`}
            phase={group.phase}
            people={group.students?.map((student) => student.name).sort()}
            groupType={group.groupType}
          />
        ))}
    </div>
  );
}

export default GroupsList;
