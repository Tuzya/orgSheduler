import * as React from 'react';
import { useParams } from 'react-router-dom';
import { getStudent, updateStudent } from '../../store/students/actions';
import { groupTypes } from '../../consts';
import { getGroups } from '../../store/camp/actions';
import { useSelector, useDispatch } from 'react-redux';

export default function StudentEdit({ groups, student, submitHandlerStudent, onChangeHandler }) {

  return (
    <div className="input-field" style={{ minWidth: '300px' }}>
      <form onSubmit={submitHandlerStudent}>
        <input name="name" value={student.name} placeholder="name" onChange={onChangeHandler} />
        <select
          name="select"
          className="browser-default"
          onChange={onChangeHandler}
        >
          <option defaultValue={student.group._id}>{student.group.name}</option>
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
