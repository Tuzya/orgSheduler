import React, { useState, useEffect } from 'react';
import GroupItem from '../../components/GroupItem/GroupItem';
import {getGroups} from "../../store/camp/actions"
import {useDispatch, useSelector} from "react-redux"

function GroupsList({ isAuth }) {

  const groups = useSelector((state) => state.camp.groups);
  const isLoading = useSelector((state) => state.camp.isLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    if(groups.length === 0) dispatch(getGroups())
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
      {groups.map((group) => (
        <GroupItem
          key={group._id}
          isAuth={isAuth}
          name={group.name}
          link={`/groups/${group._id}`}
          phase={group.phase}
          people={group.students.map((student) => student.name).sort()}
          groupType={group.groupType}
        />
      ))}
    </div>
  );
}

export default GroupsList;
