import React from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import './GroupPage.css';
import GroupShedule from './GroupShedule';
import CodeReviewTable from './CodeReviewTable';
import ExamGeneration from './ExamGeneration';
import { getGroup, setGroup } from 'store/camp/actions';
import { isObjEmpty } from 'libs/functions';

function GroupPage({ isAuth }) {
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const { groups, group, isLoading } = useSelector((state) => state.camp);

  const groupWithStudentsAsNames = React.useMemo(
    () => ({ ...group, students: group.students?.map((student) => student.name) }),
    [group]
  );

  React.useEffect(() => {
    const group = groups.find((group) => group._id === groupId);
    if (group) dispatch(setGroup(group));
    else dispatch(getGroup(groupId));
  }, [dispatch]);

  if (isLoading) return <div className="spinner" />;

  if (isObjEmpty(group))
    return (
      <div className="group-page">
        <div className="group-schedule-header">
          <div>Группа не найдена</div>
        </div>
      </div>
    );

  // const isCodeReview = !Object.values(group.crshedule?.crdays).every((day) => !day);
  return (
    <div className="group-page">
      <div className="group-schedule-header">
        <div className="group-name">{group.name}</div>
        <div>{`(${group.groupType}, Phase: ${group.phase})`}</div>
      </div>
      {group.shedule ? <GroupShedule shedule={group.shedule} /> : <div />}
      <CodeReviewTable group={groupWithStudentsAsNames} isAuth={isAuth}/>
      {isAuth && <ExamGeneration></ExamGeneration>}
    </div>
  );
}

export default GroupPage;
