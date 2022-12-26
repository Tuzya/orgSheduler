import * as React from 'react';
import Button from '@mui/material/Button';
import { SnackbarProvider, useSnackbar } from 'notistack';
import { useSelector } from 'react-redux';

function PopUpComp({ message, variant }) {
  // variant could be success, error, warning, info, or default
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const popUpData = useSelector((state) => state.popup);

  React.useEffect(() => {
    let count = 0;
    let id = 0;
    if (popUpData.groupsCrTables.length && popUpData.teachersAndGaps.length) {
      id = setInterval(() => {
        popUpHandler(++count, variant);
      }, 3000);
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
