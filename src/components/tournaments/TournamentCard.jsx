import { Card, CardActionArea, CardContent, Chip, Typography, Box, Grid } from '@mui/material'
import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

function TournamentCard({ tournament }) {
  const navigate = useNavigate();
  const { userInfo } = useContext(AuthContext);

  return (
    <Card
      elevation={0}
      style={{ border: '1px solid var(--primary-color-400)', borderRadius: '8px', boxShadow: '0px 4px 4px 0px #EDE8EC14', height: '100%' }}
    >
      <CardActionArea 
        style={{ height: '100%' }}
        onClick={() => navigate(`/tournament/info/${tournament._id}`)}
      >
        <CardContent style={{ padding: 0, height: '100%', display: "flex", flexDirection: "column" }}>
          <Box sx={{ px: 2, py: 1, height: '100%' }}>
            <Grid container spacing={1}>
              
              
              {/* Tournament Name and Date */}
              <Grid size={8}>
                <Typography variant='h6' className='text-primary' align='left'>{tournament.name}</Typography>
              </Grid>
              <Grid size={4}>
                <Typography variant='body2' className='text-info' align='right'>{tournament.startDate}</Typography>
              </Grid>

              
              
              {/* Status Information */}
              <Grid size={12}>
                {tournament.status === 'NOT-STARTED' ? (
                  <Typography variant='body2' className='text-info' align='center'>
                    Registered Teams: {tournament.registrationRequests.length} / {tournament.teamCount}
                  </Typography>
                ) : (
                  <Typography variant='body2' className='text-info' align='center'>
                    Completed Matches: {tournament.fixtures.filter((fixture) => fixture.status === 'STARTED' || fixture.status === 'COMPLETED').length} / {tournament.fixtures.length}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Box>
          
          <Box style={{ background: 'var(--neutral-white)' }} sx={{ px: 2, py: 1, height: '100%' }}>
            {tournament.createdBy === userInfo._id && (
            <Grid size={12}>
              <Typography variant='body1' align='center' className='text-info' gutterBottom>Hosting</Typography>
            </Grid>
            )}
            <Grid container spacing={1}>
              <Grid size={12}>
                <Typography variant='body2' gutterBottom align='left'>{tournament.ground}</Typography>
              </Grid>
              
              {tournament.status === 'NOT-STARTED' && (
                <Grid size={12}>
                  <Typography variant='body2' gutterBottom align='left'>
                    Registration Deadline: {tournament.registrationDeadline}
                  </Typography>
                </Grid>
              )}
              
              <Grid size={6}>
                <Typography variant='body2' gutterBottom>Format: {tournament.tournamentType}</Typography>              </Grid>
              <Grid size={6}>
                <Typography variant='body2' gutterBottom align='right'>Status: {tournament.status}</Typography>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default TournamentCard