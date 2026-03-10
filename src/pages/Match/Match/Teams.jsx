import { Grid } from '@mui/material'
import React, { useState } from 'react'
import PlayerCard from '../../../components/Player/PlayerCard';
import FilterTabs from '../../../components/FilterTabs';

function Teams({ matchDetails }) {
  const [tabValue, setTabValue] = useState(matchDetails.teamA.name);

  return (
    <div>
      <FilterTabs tabs={[matchDetails.teamA.name, matchDetails.teamB.name]} setTabValue={setTabValue} />
      <Grid container spacing={2} className='mt-15'>
        {tabValue === matchDetails.teamA.name ? matchDetails.teamA.playerList?.map((player, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
            <PlayerCard player={player} />
          </Grid>
        )) : matchDetails.teamB.playerList?.map((player, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
            <PlayerCard player={player} />
          </Grid>
        ))}
      </Grid>
    </div>
  )
}

export default Teams