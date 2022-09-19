import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import './GroupPage.css';
import GroupShedule from './GroupShedule';
import CodeReviewTable from './CodeReviewTable';
import { getGroup, setGroup } from '../../store/camp/actions';
import { isObjEmpty } from '../../libs/functions';

function GroupPage({ isAuth }) {
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const { groups, isLoading } = useSelector((state) => state.camp);
  const group =
    groups.find((group) => group._id === groupId) || useSelector((state) => state.camp.group);

  useEffect(() => {
    if (isObjEmpty(group)) dispatch(getGroup(groupId));
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
