import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { getStudent, updateStudent } from '../../store/students/actions';
import { getGroups } from '../../store/camp/actions';
import { useSelector, useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import StudentEdit from './SdudentEdit';
import LinearLoader from '../../components/Loader/LinearLoader';

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

  const groups = useSelector((state) => state.camp.groups);
  const [isLoading, setLoading] = React.useState(true);

  const [isEdit, setEdit] = React.useState(false);
  const [student, setStudent] = React.useState({
    name: '',
    group: { id: '', name: '' },
    photoUrl: '',
    history: []
  });

  React.useEffect(() => {
        if (!groups.length) dispatch(getGroups());
    (async () => {
      setLoading(true);
        const student = await getStudent(studentId);
        if (student.err) return alert(student.err);
        setStudent(student);
        setLoading(false);
    })();
  }, [dispatch]);



  if (isEdit)
    return (
      <StudentEdit
        groups={groups}
        student={student}
        submitHandlerStudent={submitHandlerStudent}
        onChangeHandler={onChangeHandler}
      />
    );
  return (
    <div style={{ marginTop: 20 }}>
      <Link to="/students">to students list</Link>
      <br />
      <button onClick={() => setEdit(true)}>EDIT</button>
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
