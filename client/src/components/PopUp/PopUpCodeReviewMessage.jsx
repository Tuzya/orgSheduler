import * as React from 'react';
import Button from '@mui/material/Button';
import { SnackbarProvider, useSnackbar } from 'notistack';
import { useSelector } from 'react-redux';
import { getCurrentHour, getCurrentMinutes, getCurrentWeekDay } from '../../libs/functions';

function PopUpComp({ message, variant }) {
  // variant could be success, error, warning, info, or default
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const popUpData = useSelector((state) => state.popup);

  React.useEffect(() => {
    let count = 0;
    let id = 0;
    if (popUpData.groupsCrTables.length && popUpData.teachersAndGaps.length) {
      const currentTime = new Date();
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

      const currentWeekDay = getCurrentWeekDay();

      const filteredByCurrentDay = popUpData.groupsCrTables.map((table) =>
        table.crtables.filter((crtables) => crtables.crDay === currentWeekDay)
      );
      // console.log('file-PopUpCodeReviewMessage.jsx filteredByCurrentDay:', filteredByCurrentDay);

      // const filteredByCurentHours = filteredByCurrentDay.map((crtables) =>
      //   crtables.map((crtable) =>
      //     crtable.tableData.map((row,i) => ())
      //
      //
      //   )
      // );
      // .map((data) => data.tableData.map((tableData, i) => tableData))

      var time = '10:00-10:10'.match(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/i);

      id = setInterval(() => {
        popUpHandler(++count, variant);
      }, 30000);
    }
    return () => clearInterval(id);
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
  return null;
}

export default function PopUpCodeReviewMessage() {
  return (
    <SnackbarProvider maxSnack={10} autoHideDuration={60000}>
      <PopUpComp />
    </SnackbarProvider>
  );
}
