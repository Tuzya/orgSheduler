import React, { useState, useEffect } from 'react';
import GroupItem from '../GroupItem/GroupItem';

function GroupsList({isAuth}) {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    (async () => {
      const fetchedGroups = await (await fetch('/api/groups/')).json();
      // Сортировка студентов по имени, для отображения списка в badge.
      fetchedGroups.map((group) => group.students.sort());
      setGroups(fetchedGroups);
    })();
  }, []);

  return (
    groups.length
      ? (
        <div className="collection">
          {
            groups.map((group) => (
              <GroupItem
                key={group._id}
                isAuth={isAuth}
                name={group.name}
                link={`/groups/${group._id}`}
                phase={group.phase}
                people={group.students}
              />
            ))
          }
        </div>
      )
      : <div className="spinner" />
  );
}

export default GroupsList;
