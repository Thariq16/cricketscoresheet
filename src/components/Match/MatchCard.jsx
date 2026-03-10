import { Card, CardActionArea, CardContent, Typography, Box, Grid } from '@mui/material'
import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

function MatchCard({ match }) {
  const location = useLocation();
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <Card
      elevation={0}
      style={{ border: '1px solid var(--primary-color-400)', borderRadius: '8px', boxShadow: '0px 4px 4px 0px #EDE8EC14', height: '100%' }}
    >
      <CardActionArea
        disabled={location.pathname.startsWith('/match/info')} style={{ height: '100%' }}
        onClick={() => navigate(`/match/info/${match._id}`)}
      >
        <CardContent style={{ padding: 0, height: '100%', display: "flex", flexDirection: "column" }}>
          <Box sx={{ px: 2, py: 1, height: '100%' }}>
            <Grid container spacing={1}>
              <Grid size={5}>
                <Typography variant='h6' className='text-primary' align='left'>
                  {match.teamA?.name || 'TBD'}
                </Typography>
                {match.status !== "NOT-STARTED" && (
                  <>
                    {match.inning1?.battingTeam?._id === match.teamA._id ? (
                      <Typography variant='body2' className='text-info' align='left'>
                        {match?.inning1?.runs?.toString().padStart(3, '0') + "/" + match?.inning1?.wickets?.toString().padStart(2, '0')}
                      </Typography>
                    ) : (
                      <>
                        <Typography variant='body2' className='text-info' align='left'>
                          {match?.inning2?.runs?.toString().padStart(3, '0') + "/" + match?.inning2?.wickets?.toString().padStart(2, '0')}
                        </Typography>
                        {match.status === "STARTED" && (
                          <Typography variant='body2' className='text-info' align='left'>
                            Target : {(match?.inning1?.runs + 1)?.toString().padStart(3, '0')}
                          </Typography>
                        )}
                      </>
                    )}
                  </>
                )}
              </Grid>
              <Grid size={2}>
                <Typography variant='h6' className='text-primary' align='center'>vs</Typography>
              </Grid>
              <Grid size={5}>
                <Typography variant='h6' className='text-primary' align='right'>
                  {match.teamB?.name || 'TBD'}
                </Typography>
                {match.status !== "NOT-STARTED" && (
                  <>
                    {match.inning1?.battingTeam?._id === match.teamB._id ? (
                      <Typography variant='body2' className='text-info' align='right'>
                        {match?.inning1?.runs?.toString().padStart(3, '0') + "/" + match?.inning1?.wickets?.toString().padStart(2, '0')}
                      </Typography>
                    ) : (
                      <>
                        <Typography variant='body2' className='text-info' align='right'>
                          {match?.inning2?.runs?.toString().padStart(3, '0') + "/" + match?.inning2?.wickets?.toString().padStart(2, '0')}
                        </Typography>
                        {match.status === "STARTED" && (
                          <Typography variant='body2' className='text-info' align='right'>
                            Target : {(match?.inning1?.runs + 1)?.toString().padStart(3, '0')}
                          </Typography>
                        )}
                      </>
                    )}
                  </>
                )}
              </Grid>
              <Grid size={12}>
                {match.status === "COMPLETE" && (
                  <Typography variant='body2' className='text-info' align='center'>
                    {match.winningTeam?.name} Won by {" "}
                    {match.winningTeam?._id === match?.inning1?.battingTeam?._id ? ((match?.inning1?.runs + 1) - match?.inning2?.runs) : match?.inning2?.runs}
                    {" "}Runs
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Box>
          <Box style={{ background: 'var(--neutral-white)' }} sx={{ px: 2, py: 1, height: '100%' }}>
            <Grid container spacing={1}>
              {match.createdBy._id === userInfo._id && (
                <Grid size={12}>
                  <Typography variant='body1' align='center' className='text-info' gutterBottom>Hosting</Typography>
                </Grid>
              )}
              <Grid size={6}>
                <Typography variant='body2' gutterBottom>{match.matchDate}</Typography>
                <Typography variant='body2' gutterBottom>{match.matchType}</Typography>
                <Typography variant='body2' gutterBottom>{match.ground}</Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant='body2' gutterBottom align='right'>{match.pitchType}</Typography>
                <Typography variant='body2' gutterBottom align='right'>{match.overs} overs</Typography>
                <Typography variant='body2' gutterBottom align='right'>{match.ballType}</Typography>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default MatchCard