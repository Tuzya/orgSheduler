import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import "./GroupPage.css";
import GroupShedule from "./GroupShedule";

function GroupPage() {
  const { groupId } = useParams();
  const [name, setName] = useState("");
  const [phase, setPhase] = useState("");
  // const [students, setStudents] = useState([]);
  const [shedule, setShedule] = useState([]);
  const [isOnline, setOnline] = useState(false);

  useEffect(() => {
    (async () => {
      const group = await (await fetch(`/api/groups/${groupId}`)).json();
      setName(group.name);
      setPhase(group.phase);
      // setStudents(group.students);
      setShedule(group.shedule);
      setOnline(group.online);
    })();
  }, []);

  return name ? (
    <div className="group-page">
      <div className="group-schedule-header">
        <div className="group-name">
          {name}
        </div>
        <div>{`(${isOnline ? "Online" : "Offline"}, Phase: ${phase})`}</div>
      </div>
      {shedule ? <GroupShedule shedule={shedule}/> : <div />}
    </div>
  ) : (
    <div className="spinner" />
  );
}

export default GroupPage;
