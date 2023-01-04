import * as React from 'react';
import Button from '@mui/material/Button';
import { SnackbarProvider, useSnackbar } from 'notistack';
import { useSelector } from 'react-redux';
import { getCurrentWeekDay, indexOfCurrentTimeGaps } from '../../libs/functions';
import FloatingButton from './FloatingButton';

function PopUpComp() {
  // variant could be success, error, warning, info, or default
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const popUpData = useSelector((state) => state.popup);
  const [timeGaps, setTimeGaps] = React.useState({});
  const [teachers, setTeachers] = React.useState({});
  const [tablesByCurrentDay, setTablesByCurrentDay] = React.useState([]);

  React.useEffect(() => {
    if (popUpData.groupsCrTables.length && popUpData.teachersAndGaps.length) {
      const currentTime = new Date();
      const teachers = popUpData.teachersAndGaps.reduce(
        (acc, data) => ({ ...acc, [data.groupType]: data.teachers }),
        {}
      );
      setTeachers(teachers);
      const timeGaps = popUpData.teachersAndGaps.reduce((acc, data) => {
        return {
          ...acc,
          [data.groupType]: data.timegaps.map((timegap) => {
            const startCRTime = timegap.split('-')[0].split(':');
            currentTime.setHours(Number(startCRTime[0]));
            currentTime.setMinutes(Number(startCRTime[1]));
            return currentTime.getTime();
          })
        };
      }, {});
      setTimeGaps(timeGaps);

      const currentWeekDay = getCurrentWeekDay();
      const tablesByCurrentDay = popUpData.groupsCrTables.reduce((acc, group) => {
        const crtables = group.crtables.filter((table) => table.crDay === currentWeekDay);
        if (crtables.length)
          return [...acc, { name: group.name, groupType: group.groupType, crtables }];
        return [...acc];
      }, []);
      setTablesByCurrentDay(tablesByCurrentDay);
    }
  }, [popUpData]);

  const action = (snackbarId) => (
    <Button
      onClick={() => {
        closeSnackbar(snackbarId);
      }}
    >
      close
    </Button>
  );
  const popUpHandler = (message = '', variant = 'info') => {
    enqueueSnackbar(message, {
      variant,
      action,
      preventDuplicate: true
    });
  };

  const onClickFloatingBtn = () => {
    const matchedCodeReview = tablesByCurrentDay.reduce((acc, group) => {
      const i = indexOfCurrentTimeGaps(timeGaps[group.groupType]);
      if (i === -1) return [...acc];
      const matched = group.crtables.reduce((crtablesAcc, crtables) => {
        const tableData = crtables.tableData
          .map((tableData, index) => {
            if (index === 0) return { student: ' ' };
            return {
              time: crtables.tableData[0][`row${i + 1}`],
              group: group.name,
              teacher: index !== 0 ? teachers[group.groupType][index - 1] : undefined,
              student: tableData[`row${i + 1}`]
            };
          })
          .filter((data) => data.student !== ' ' && data.student !== 'Педсовет');
        return [...crtablesAcc, ...tableData];
      }, []);
      return [...acc, ...matched];
    }, []);
    matchedCodeReview.forEach((dataCR) => {
      const codeReviewInfo = `time: ${dataCR.time}, teacher: ${dataCR.teacher}, group: ${dataCR.group} student: ${dataCR.student}`;
      popUpHandler(codeReviewInfo);
    });
  };
  return <FloatingButton onClickFloatingBtn={onClickFloatingBtn} />;
}

export default function PopUpCodeReviewMessage() {
  return (
    <SnackbarProvider maxSnack={15} autoHideDuration={180000}>
      <PopUpComp />
    </SnackbarProvider>
  );
}
