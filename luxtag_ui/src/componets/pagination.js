import React from 'react';
import {Stack, Pagination} from '@mui/material';

const pagination = () => {
  return (
    <Stack spacing={2} sx={{margin : "20px"}}>
      <Pagination count={10} />
    </Stack>
  )
}

export default pagination