import React, { useState, useEffect } from 'react';
import GroupItem from '../GroupItem/GroupItem';

function GroupsList({ isAuth }) {
  const [groups, setGroups] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/groups/');

        if(!res.ok) throw new Error(`Server Error: ${res.statusText} ${res.status}`);
        const fetchedGroups = await res.json();
        if(fetchedGroups.err) throw new Error(`Err to get groups: ${fetchedGroups.err}`);

        // Сортировка студентов по имени, для отображения списка в badge.
        fetchedGroups.map((group) => group.students.sort());
        setGroups(fetchedGroups);
      } catch (e) {
        console.error('Failed to fetch Groups', e.message);
        alert(e.message)
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
