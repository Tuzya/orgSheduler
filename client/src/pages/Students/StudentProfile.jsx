import * as React from 'react';
import { useParams } from 'react-router-dom';
import { getStudent } from '../../store/students/actions';

export default function StudentProfile() {
  const { studentId } = useParams();

  React.useEffect(() => {
    (async () => {
      const student = await getStudent(studentId);
      if(student.err) return alert(student.err)
      console.log('file-StudentProfile.jsx student:', student);
    })();
  }, []);
  return <p>StudentsProfilePage</p>;
}
