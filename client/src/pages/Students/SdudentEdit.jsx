import * as React from 'react';
import Button from "@mui/material/Button"

export default function StudentEdit({ groups, student, submitHandlerStudent, onChangeHandler }) {

  return (
    <div className="input-field" style={{ minWidth: '300px' }}>
      <form onSubmit={submitHandlerStudent}>
        <input name="name" value={student.name} placeholder="name" onChange={onChangeHandler} />
        <br/>
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
        <br/>
        <input
          name="photoUrl"
          value={student.photoUrl}
          placeholder="photoUrl"
          onChange={onChangeHandler}
        />
        <br/>
        <Button type="submit">SAVE</Button>
        <Button type="button">DELETE</Button>
      </form>
    </div>
  );
}
