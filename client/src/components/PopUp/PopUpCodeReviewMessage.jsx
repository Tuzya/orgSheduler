import * as React from 'react';
import Button from '@mui/material/Button';
import { SnackbarProvider, useSnackbar } from 'notistack';
import { useSelector } from 'react-redux';

function PopUpComp() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const popUpData = useSelector((state) => state.popup);

  React.useEffect(() => {
    let count = 0;
    if (popUpData.groupsCrTables.length && popUpData.teachersAndGaps.length) {
      setInterval(() => {
        handleClickVariant('This is a success message! ' + ++count);
      }, 3000);
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
  const handleClickVariant = (message) => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(message, {
      variant: 'info',
      action, preventDuplicate: true
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
