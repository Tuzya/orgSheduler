import React from 'react';
import dayjs from 'dayjs';

import './students.css';

import { DebounceInput } from 'react-debounce-input';
import LinearLoader from '../../components/Loader/LinearLoader';
import { groupTypes } from '../../consts';
import { useDispatch, useSelector } from 'react-redux';
import { getStudents } from '../../store/students/actions';
import { getGroups } from '../../store/camp/actions';

const ratingColor = {
  0: 'red',
  1: 'light-blue',
  2: 'lime',
  3: 'blue-grey lighten-3',
  4: 'light-green',
  5: 'green'
};

export default function Schema() {
  const [search, setSearch] = React.useState({ name: '', groupType: groupTypes.online, groupName: '' });

  const dispatch = useDispatch();
  const { data: students, isLoading } = useSelector((store) => store.students);
  const groups = useSelector((store) => store.camp.groups);
  const groupNames = React.useMemo(
    () => groups.filter((group) => group.groupType === search.groupType).map((group) => group.name),
    [groups, search]
  );

  React.useEffect(() => {
    if (groups.length === 0) dispatch(getGroups());
  }, []);

  React.useEffect(() => {
    dispatch(getStudents(search));
  }, [search]);

  return (
    <>
      <DebounceInput
        className={'px-2'}
        placeholder={'search students by name here...'}
        minLength={2}
        debounceTimeout={600}
        onChange={(e) => {
          setSearch((state) => ({ ...state, name: e.target.value }));
        }}
      />
      <div>
        <div className="input-field" style={{ minWidth: '300px' }}>
          <select
            className="browser-default"
            onChange={(e) => {
              setSearch((state) => ({ ...state, groupType: e.target.value }));
            }}
          >
            {Object.keys(groupTypes).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <br/>
          <select
            className="browser-default"
            onChange={(e) => {
              setSearch((state) => ({ ...state, groupName: e.target.value }));
            }}
          >
            <option key={'007'} value="" selected>
              Все группы
            </option>
            {groupNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {isLoading && <LinearLoader />}
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
