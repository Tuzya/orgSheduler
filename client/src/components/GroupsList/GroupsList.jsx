import React, { useState, useEffect } from 'react';
import GroupItem from '../GroupItem/GroupItem';

function GroupsList({ isAuth }) {
  const [groups, setGroups] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const fetchedGroups = await (await fetch('/api/groups/')).json();
        // Сортировка студентов по имени, для отображения списка в badge.
        fetchedGroups.map((group) => group.students.sort());
        setGroups(fetchedGroups);
      } catch (e) {
        console.error('Failed to fetch Groups', e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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
          people={group.students}
          groupType={group.groupType}
        />
      ))}
    </div>
  );
}

export default GroupsList;
