import React from 'react';
import GroupItem from '../../components/GroupItem/GroupItem';
import { getGroups } from '../../store/camp/actions';
import { useDispatch, useSelector } from 'react-redux';
import { DAYTORU, groupTypes } from '../../consts';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';

function GroupsList({ isAuth }) {
  const groups = useSelector((state) => state.camp.groups);
  const isLoading = useSelector((state) => state.camp.isLoading);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (groups.length === 0) dispatch(getGroups());
  }, [dispatch]);

  if (isLoading) return <div className="spinner" />;
  if (groups.length === 0)
    return (
      <div className="collection" style={{ textAlign: 'center' }}>
        Список групп пуст
      </div>
    );

  const filteredGroups = groups.filter(
    (group) => group.groupType !== groupTypes.inactive && group.groupType !== groupTypes.waitlist
  ).sort((a, b) => a.groupType.localeCompare(b.groupType));

  return (
    <Grid item xs={12} md={6}>
      <List sx={{ width: '100%', minWidth: 300, bgcolor: 'background.paper' }}>
        {filteredGroups.map((group) => {
          const codeReviewDays = Object.entries(group.crshedule.crdays)
            .filter((day) => day[1])
            .map((day) => ` ${DAYTORU[day[0]]}`)
          return <GroupItem
            key={group._id}
            isAuth={isAuth}
            name={group.name}
            groupPage={`/groups/${group._id}`}
            phase={group.phase}
            people={group.students?.map((student) => student.name).sort()}
            groupType={group.groupType}
            codeReviewDays={codeReviewDays}
          />
        })}
      </List>
    </Grid>
  );
}

export default GroupsList;
