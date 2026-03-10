import React, { useEffect, useState } from 'react'
import FilterTabs from '../../../components/FilterTabs'
import { Box, LinearProgress, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { sendHttpRequest } from "../../../common/Common";
import { toast } from "react-toastify";

function ScoreCard({ matchDetails }) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(matchDetails.teamA.name)
  const [battingPerformances, setBattingPerformances] = useState([])
  const [bowlingPerformances, setBowlingPerformances] = useState([])

  useEffect(() => {
    getBattingData();
    getBowlingData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchDetails._id])


  async function getBattingData() {
    setIsLoading(true);
    sendHttpRequest("GET", "/batting/match/" + matchDetails._id).then(res => {
      setBattingPerformances(res.data.battingPerformances);
    }).catch((error) => {
      console.log(error.response)
      toast.error(error.response.data.message);
    }).finally(() => {
      setIsLoading(false);
    });
  }

  async function getBowlingData() {
    setIsLoading(true);
    sendHttpRequest("GET", "/bowling/match/" + matchDetails._id).then(res => {
      setBowlingPerformances(res.data.bowlingPerformances);
    }).catch((error) => {
      console.log(error.response)
      toast.error(error.response.data.message);
    }).finally(() => {
      setIsLoading(false);
    });
  }

  function getBattingStats(teamName) {
    const team = matchDetails.teamA.name === teamName ? matchDetails.teamA : matchDetails.teamB
    const teamPlayers = team.playerList.map(player => player._id)
    const filteredBattingData = battingPerformances.filter(battingPerformance => teamPlayers.includes(battingPerformance.playerId._id))
    return filteredBattingData
  }

  function getBowlingStats(teamName) {
    const team = matchDetails.teamA.name === teamName ? matchDetails.teamA : matchDetails.teamB
    const teamPlayers = team.playerList.map(player => player._id)
    const filteredBowlingData = bowlingPerformances.filter(bowlingPerformance => teamPlayers.includes(bowlingPerformance.playerId._id))
    return filteredBowlingData
  }

  if (isLoading) {
    return (
      <LinearProgress />
    )
  }

  return (
    <div>
      <Typography variant="body2" className='text-info mb-15' align="center" gutterBottom>
        {matchDetails.wonTossTeam.name} won the toss and chose to {matchDetails.batFirst ? 'bat' : 'bowl'} first
      </Typography>
      <FilterTabs tabs={[matchDetails.teamA.name, matchDetails.teamB.name]} setTabValue={setSelectedTeam} />
      <Box
        style={{ border: '1px solid var(--primary-color-400)', borderRadius: '8px', boxShadow: '0px 4px 4px 0px #EDE8EC14', overflow: 'auto' }} my={2}
      >
        <Table size="small">
          <caption>
            <b>Did not Bat:</b> {getBattingStats(selectedTeam).filter(row => !row.status.inPitch && !row.status.out).map(row => row.playerId.firstName + ' ' + row.playerId.lastName).join(', ')}
          </caption>
          <TableHead style={{ backgroundColor: 'var(--primary-color-400)' }}>
            <TableRow>
              <TableCell>Batting</TableCell>
              <TableCell align="center">R</TableCell>
              <TableCell align="center">B</TableCell>
              <TableCell align="center">0s</TableCell>
              <TableCell align="center">4s</TableCell>
              <TableCell align="center">6s</TableCell>
              <TableCell align="center">SR</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getBattingStats(selectedTeam).filter(row => row.status.inPitch || row.status.out).map((row, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  <Typography variant="caption" component="div" noWrap>
                    {row.playerId.firstName} {row.playerId.lastName}
                  </Typography>
                  <Typography variant="caption" component="div" className={row.status.inPitch && 'text-info'} color={row.status.out ? 'error' : ''} noWrap>
                    {row.status.inPitch ? 'Batting' : row.status.out ? 'Out' : ''}
                  </Typography>
                </TableCell>
                <TableCell align="center">{row.runs}</TableCell>
                <TableCell align="center">{row.ballsFaced}</TableCell>
                <TableCell align="center">{row.dots}</TableCell>
                <TableCell align="center">{row.boundaries}</TableCell>
                <TableCell align="center">{row.sixes}</TableCell>
                <TableCell align="center">
                  {row.ballsFaced === 0 ? 0 : ((row.runs / row.ballsFaced) * 100).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
            <TableRow style={{ backgroundColor: 'var(--primary-color-400)' }}>
              <TableCell component="th" scope="row">Total</TableCell>
              <TableCell align="center">
                {getBattingStats(selectedTeam).filter(row => row.status.inPitch || row.status.out).reduce((acc, row) => acc + row.runs, 0)}
              </TableCell>
              <TableCell align="center">
                {getBattingStats(selectedTeam).filter(row => row.status.inPitch || row.status.out).reduce((acc, row) => acc + row.ballsFaced, 0)}
              </TableCell>
              <TableCell align="center">
                {getBattingStats(selectedTeam).filter(row => row.status.inPitch || row.status.out).reduce((acc, row) => acc + row.dots, 0)}
              </TableCell>
              <TableCell align="center">
                {getBattingStats(selectedTeam).filter(row => row.status.inPitch || row.status.out).reduce((acc, row) => acc + row.boundaries, 0)}
              </TableCell>
              <TableCell align="center">
                {getBattingStats(selectedTeam).filter(row => row.status.inPitch || row.status.out).reduce((acc, row) => acc + row.sixes, 0)}
              </TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
      <Box
        style={{ border: '1px solid var(--primary-color-400)', borderRadius: '8px', boxShadow: '0px 4px 4px 0px #EDE8EC14', overflow: 'auto' }} my={2}
      >
        <Table size="small">
          <TableHead style={{ backgroundColor: 'var(--primary-color-400)' }}>
            <TableRow>
              <TableCell>Bowling</TableCell>
              <TableCell align="center">O</TableCell>
              <TableCell align="center">R</TableCell>
              <TableCell align="center">W</TableCell>
              <TableCell align="center">ECON</TableCell>
              <TableCell align="center">Extras</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getBowlingStats(selectedTeam).map((row, index) => (
              <TableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Typography variant="caption" component="div" color="text.secondary" noWrap>
                    {row.playerId.firstName} {row.playerId.lastName}
                  </Typography>
                </TableCell>
                <TableCell align="center">{~~(row.ballCount / 6) + ((row.ballCount % 6) / 10)}</TableCell>
                <TableCell align="center">{row.runs}</TableCell>
                <TableCell align="center">{row.wickets}</TableCell>
                <TableCell align="center">
                  {row.ballCount === 0 ? 0 : (row.runs / (~~(row.ballCount / 6) + ((row.ballCount % 6) / 10))).toFixed(2)}
                </TableCell>
                <TableCell align="center">{row.extras}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </div>
  )
}

export default ScoreCard