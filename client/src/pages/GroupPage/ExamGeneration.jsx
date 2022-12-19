import { Button } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';

export default function ExamGeneration() {
  const group = useSelector((store) => store.camp.group);

  const createExam = async () => {
    const repository = prompt('Please enter exam repository url');
    try {
      if (!repository) {
        return;
      }
      const res = await fetch('/api/exam', {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({ groupId: group._id, name: group.name, repository })
      });

      if (res.status === 200) {
        alert('Exam successfully created');
        return;
      }

      const data = await res.json();
      throw new Error(`Server Error: ${res.statusText} ${data.msg}`);
    } catch (error) {
      console.error('Exam Creation', error.message);
      alert(error.message);
    }
  };

  return (
    <div className="group-exam">
      <div className="group-exam_header">Генерация Экзамена</div>
      <Button
        variant="contained"
        type="button"
        className="group-exam-btn"
        onClick={() => {
          createExam();
        }}
      >
        Exam
      </Button>
    </div>
  );
}
