import { Grid } from '@mui/material'
import React from 'react'
import RegisteredTeams from './RegisteredTeams'
import TeamCard from '../../../components/team/TeamCard'

function Teams({ tournamentDetails, isAdmin, reloadTournament }) {
  return (
    <div>
      {isAdmin ? (
        <RegisteredTeams tournamentDetails={tournamentDetails} reloadTournament={reloadTournament} />
      ) : (
        <Grid container spacing={2}>
          {tournamentDetails.teamList?.map((team, index) => (
            <Grid size={12} key={index}>
              <TeamCard team={team} />
            </Grid>
          ))}
        </Grid>
      )}
    </div >
  )
}

export default Teams