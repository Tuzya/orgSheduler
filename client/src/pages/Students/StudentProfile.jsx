import * as React from 'react';
import { useParams } from 'react-router-dom';
import { getStudent } from '../../store/students/actions';

export default function StudentProfile() {
  const { studentId } = useParams();
const [student, setStudent] = React.useState({});
  React.useEffect(() => {
    (async () => {
      const student = await getStudent(studentId);
      if(student.err) return alert(student.err)
      setStudent(student);
    })();
  }, []);
  return <span>{JSON.stringify(student, null, ' ')}</span>;
}
