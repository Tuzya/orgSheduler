import * as React from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import JoinInnerIcon from '@mui/icons-material/JoinInner';

export default function FloatingButton({onClickFloatingBtn}) {
  return (
    <Box sx={{ '& > :not(style)': { m: 1 } }} >
      <Fab color="primary" variant="extended" title="check code review" onClick={onClickFloatingBtn}>
        <JoinInnerIcon/>
      </Fab>
    </Box>
  );
}
