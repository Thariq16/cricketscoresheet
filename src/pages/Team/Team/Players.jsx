import { Grid } from '@mui/material'
import React from 'react'
import PlayerCard from '../../../components/Player/PlayerCard';

function Players({ teamDetails }) {

  return (
    <div>
      <Grid container spacing={2} className='mt-15'>
        {teamDetails.playerList.map((player, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
            <PlayerCard player={player} />
          </Grid>
        ))}
      </Grid>
    </div>
  )
}

export default Players