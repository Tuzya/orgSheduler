import * as React from 'react';
import Button from '@mui/material/Button';
import { getStudent, updateStudent } from '../../store/students/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getGroups } from '../../store/camp/actions';

export default function StudentEdit() {
  const dispatch = useDispatch();
  const groups = useSelector((state) => state.camp.groups);
  const student = useSelector((state) => state.students.student);
  const { studentId } = useParams();

  const [studentValues, setStudentstudentValues] = React.useState({
    name: '',
    group: { id: '', name: '' },
    photoUrl: '',
    history: []
  });

  React.useEffect(() => {
    if (groups.length === 0) dispatch(getGroups());
    dispatch(getStudent(studentId));
  }, []);

  const submitHandlerStudent = async (event) => {
    event.preventDefault();
    const res = await updateStudent(student._id, student.name, student.group._id, student.photoUrl);
    if (res.err) return alert(res.err);
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

  return (
    <div className="input-field" style={{ minWidth: '300px' }}>
      <form onSubmit={submitHandlerStudent}>
        <input name="name" value={student.name} placeholder="name" onChange={onChangeHandler} />
        <br />
        <select name="select" className="browser-default" onChange={onChangeHandler}>
          <option defaultValue={student.group._id}>{student.group.name}</option>
          {groups.map((group) => (
            <option key={group._id} value={group._id}>
              {group.name}
            </option>
          ))}
        </select>
        <br />
        <input
          name="photoUrl"
          value={student.photoUrl}
          placeholder="photoUrl"
          onChange={onChangeHandler}
        />
        <br />
        <Button type="submit">SAVE</Button>
        <Button type="button">DELETE</Button>
      </form>
    </div>
  );
}
