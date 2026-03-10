import React from 'react'
import Image from "../assets/images/NoResults.png";
import { Card, CardContent, Typography } from '@mui/material';

function NoResults(props) {
  return (
    <Card
      elevation={0}
      style={{ border: '1px solid var(--neutral-white)', borderRadius: '8px', boxShadow: '0px 4px 4px 0px #EDE8EC14' }}
      className='text-center'
    >
      <CardContent>
        <img src={Image} style={{ maxHeight: '25vh' }} alt='no results' />
        <Typography variant='h5' align='center' className='text-primary'>No {props.text} found</Typography>
      </CardContent>
    </Card>
  )
}

export default NoResults