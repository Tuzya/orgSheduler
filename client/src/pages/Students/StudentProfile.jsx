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
    (async () => {
      setLoading(true);
      try {
        const student = await getStudent(studentId); //todo переписать чтоб данные брались и апдейтились в редакс
        if (student.err) return alert(student.err);
        setStudent(student);

        if (!groups.length) dispatch(getGroups());
      } catch (e) {
        console.error('Err to get students or Groups', e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [dispatch]);

  const submitHandlerStudent = async (event) => {
    event.preventDefault();
    const res = await updateStudent(student._id, student.name, student.group._id, student.photoUrl);
    if (res.err) return alert(res.err);
    setEdit(false);
  };

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    if (name === 'select') {
      const groupName = event.target.options[event.target.selectedIndex].text;
      setStudent((state) => ({
        ...state,
        group: { ...state.group, _id: value, name: groupName }
      }));
    } else
      setStudent((state) => ({
        ...state,
        group: { ...state.group },
        [name]: value
      }));
  };

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
                  {`ph${st.phase}, ${st.groupType}, ${dayjs(st.date).format(
                    'DD-MM-YY'
                  )}, Проверял: ${
                    //todo st.groupType исправить на group.groupType
                    st.teacher
                  }`}
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
