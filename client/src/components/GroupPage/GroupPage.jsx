import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import './GroupPage.css';
import GroupShedule from './GroupShedule';
import CodeReviewTable from './CodeReviewTable';
import {getGroup, setGroup} from '../../store/camp/actions';

function GroupPage({ isAuth }) {
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const { groups, group, isLoading } = useSelector((state) => state.camp);

  useEffect(() => {
    const group = groups.find((group) => (group._id === groupId))
    if (group) dispatch(setGroup(group))
    else dispatch(getGroup(groupId));
  }, [dispatch]);

  if (isLoading) return <div className="spinner" />;
  return (
    <div className="group-page">
      <div className="group-schedule-header">
        <div className="group-name">{group.name}</div>
        <div>{`(${group.groupType}, Phase: ${group.phase})`}</div>
      </div>
      {group.shedule ? <GroupShedule shedule={group.shedule} /> : <div />}
      {group.students ? <CodeReviewTable group={group} isAuth={isAuth} /> : <div />}
    </div>
  );
}

export default GroupPage;
