import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { getStudent } from '../../store/students/actions';

import { useSelector, useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import LinearLoader from '../../components/Loader/LinearIndeterminate';

const ratingColor = {
  0: 'red',
  1: 'light-blue',
  2: 'lime',
  3: 'blue-grey lighten-3',
  4: 'light-green',
  5: 'green'
};

export default function StudentProfile() {
  const dispatch = useDispatch();
  const { studentId } = useParams();

  const students = useSelector((state) => state.students.data);
  const student =
    students.find((student) => student._id === studentId) ||
    useSelector((state) => state.students.student);
  const isLoading = useSelector((state) => state.students.isLoading);

  React.useEffect(() => {
    if (!students.length) dispatch(getStudent(studentId));
  }, [dispatch]);

  return (
    <div style={{ marginTop: 20 }}>
      <Link to="/students">to students list</Link>
      <br />
      {isLoading ? (
        <LinearLoader />
      ) : (
        <ul className="collection">
          <li key={student._id} className="collection-item ">
            {`${student.name}, ${student.group.name}`}
            <ul className="collection">
              {student.history.map((st) => (
                <li key={st._id} className="collection-item">
                  {`ph${st.phase}, ${st.groupName} ${st.groupType}, ${dayjs(st.date).format(
                    'DD-MM-YY'
                  )}, Проверял: ${st.teacher}`}
                  <div>
                    {`Комент: ${st.comment}`}
                    <span
                      className={`new badge ${ratingColor[st.rating]}`}
                      data-badge-caption={st.rating ? st.rating : '-'}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      )}
    </div>
  );
}
