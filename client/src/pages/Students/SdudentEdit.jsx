import * as React from 'react';
import { useParams } from 'react-router-dom';
import { getStudent, updateStudent } from '../../store/students/actions';
import { groupTypes } from '../../consts';
import { getGroups } from '../../store/camp/actions';
import { useSelector, useDispatch } from 'react-redux';

export default function StudentEdit() {
  const dispatch = useDispatch();
  const { studentId } = useParams();
  const groups = useSelector((state) => state.camp.groups);
  const isLoading = useSelector((state) => state.camp.isLoading);
  const [student, setStudent] = React.useState({
    name: '',
    group: { id: '', name: '' },
    photoUrl: ''
  });
  console.log('file-StudentProfile.jsx student:', student);
  React.useEffect(() => {
    (async () => {
      const student = await getStudent(studentId);
      if (student.err) return alert(student.err);
      setStudent(student);

      if (!groups.length) dispatch(getGroups());
    })();
  }, [dispatch]);

  if (isLoading) return <div className="spinner">Loading...</div>;

  const submitHandlerStudent = async (event) => {
    event.preventDefault();
    const res = await updateStudent(student._id, student.name, student.group._id, student.photoUrl);
    if (res.err) return alert(res.err);
  };

  const onChangeHandler = (event) => {
    setStudent((state) => ({
      ...state,
      group: { ...state.group },
      [event.target.name]: event.target.value
    }));
  };


  return (
    <div className="input-field" style={{ minWidth: '300px' }}>
      <form onSubmit={submitHandlerStudent}>
        <input name="name" value={student.name} placeholder="name" onChange={onChangeHandler} />
        <select
          className="browser-default"
          onChange={(e) => {
            setStudent((state) => ({
              ...state,
              group: { ...state.group, _id: e.target.value }
            }));
          }}
        >
          <option  defaultValue={student.group._id}>
            {student.group.name}
          </option>
          {groups.map((group) => (
            <option key={group._id} value={group._id}>
              {group.name}
            </option>
          ))}
        </select>
        <input
          name="photoUrl"
          value={student.photoUrl}
          placeholder="photoUrl"
          onChange={onChangeHandler}
        />
        <button type="submit">SAVE</button>
      </form>
    </div>
  );
}
