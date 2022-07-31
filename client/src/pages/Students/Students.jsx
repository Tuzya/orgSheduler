import React from 'react';
import './students.css';
import { getStudents } from '../../libs/reqFunct/students';
import dayjs from 'dayjs';

const ratingColor = {
  0: 'red',
  1: 'blue',
  2: 'yellow',
  3: 'grey',
  4: 'light-green',
  5: 'green'
};

export default function Schema() {
  const [students, setStudents] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      const students = await getStudents();
      setStudents(students);
    })();
  }, []);
  return (
    <>
      <ul className="collection">
        {students.map((student) => (
          <li key={student._id} className="collection-item ">
            {`Студент: ${student.name}, Группа: ${student.group}`}
            <ul className="collection">
              {student.history.map((st) => (
                <li key={st._id} className="collection-item">
                  {`ph${st.phase}, ${st.groupType}, ${dayjs(st.date).format(
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
        ))}
      </ul>
    </>
  );
}
