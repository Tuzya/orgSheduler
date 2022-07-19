import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import './GroupPage.css';
import GroupShedule from './GroupShedule';
import CodeReviewTable from './CodeReviewTable';

function GroupPage({ isAuth }) {
  const { groupId } = useParams();
  const [group, setGroup] = useState({});
  const [isLoad, setLoad] = useState(true);

  useEffect(() => {
    (async () => {
      setLoad(true);
      try {
        const group = await (await fetch(`/api/groups/${groupId}`)).json();
        if (!group) alert('Не удалось получить группу');
        setGroup(group);
      } catch (e) {
        console.log('Group Page Error', e.message);
      } finally {
        setLoad(false);
      }
    })();
  }, []);

  if (isLoad) return <div className="spinner" />;
  return (
    <div className="group-page">
      <div className="group-schedule-header">
        <div className="group-name">{group.name}</div>
        <div>{`(${group.online ? 'Online' : 'Offline'}, Phase: ${group.phase})`}</div>
      </div>
      {group.shedule ? <GroupShedule shedule={group.shedule} /> : <div />}
      {group.students ? <CodeReviewTable group={group} isAuth={isAuth} /> : <div />}
    </div>
  );
}

export default GroupPage;
