import React from 'react';
import dayjs from 'dayjs';

import './students.css';
import { getStudents } from '../../libs/reqFunct/students';
import { DebounceInput } from 'react-debounce-input';
import LinearLoader from "../../components/Loader/LinearLoader"
import {groupTypes} from "../../consts"

const ratingColor = {
  0: 'red',
  1: 'light-blue',
  2: 'lime',
  3: 'blue-grey lighten-3',
  4: 'light-green',
  5: 'green'
};

export default function Schema() {
  const [students, setStudents] = React.useState([]);
  const [search, setSearch] = React.useState({name: '', groupType: groupTypes.online})
  const [isLoad, setLoad] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      setLoad(true);
      const students = await getStudents(search.name, search.groupType);
      setStudents(students);
      setLoad(false);
    })()
  }, [search]);
  return (
    <>
      <DebounceInput
        className={'px-2'}
        placeholder={'search here...'}
        minLength={2}
        debounceTimeout={600}
        onChange={(e) => {
          setSearch((state) => ({...state, name: e.target.value}));
        }}
      />
      <div>
        <div className="input-field" style={{ minWidth: '300px' }}>
          <select
            className="browser-default"
            onChange={(e) => {
              setSearch((state) => ({...state, groupType: e.target.value}));
            }}
          >
            {Object.keys(groupTypes).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>
      {isLoad && <LinearLoader/>}
      <div style={{ marginTop: 20 }}>
        <ul className="collection">
          {students.map((student) => (
            <li key={student._id} className="collection-item ">
              {`${student.name}, ${student.group}`}
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
      </div>
    </>
  );
}
