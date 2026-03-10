import React, { useEffect, useState } from 'react'
import { txt } from '../../../common/context'
import FilterTabs from '../../FilterTabs'
import { Box, Grid, LinearProgress, Typography } from '@mui/material';
import { sendHttpRequest } from '../../../common/Common';
import { toast } from 'react-toastify';
import StatsCard from './StatsCard';

function Stats({ userInfo }) {
  const [isLoading, setIsLoading] = useState(false);
  const [battingStats, setBattingStats] = useState([]);
  const [bowlingStats, setBowlingStats] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState(txt.Batting);

  useEffect(() => {
    getBattingData();
    getBowlingStatData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo._id])

  const getBattingData = () => {
    setIsLoading(true);
    sendHttpRequest("GET", `/batting/player/${userInfo._id}`).then((res) => {
      setBattingStats(res.data.battingStats)
    }).catch((error) => {
      console.log(error.response)
      toast.error(error.response.data.message);
    }).finally(() => {
      setIsLoading(false);
    });
  }

  const getBowlingStatData = () => {
    setIsLoading(true);
    sendHttpRequest("GET", `/player/bowlingStats/${userInfo._id}`).then((res) => {
      setBowlingStats(res.data.data)
    }).catch((error) => {
      console.log(error.response)
      toast.error(error.response.data.message);
    }).finally(() => {
      setIsLoading(false);
    });
  }

  if (isLoading) {
    return (
      <LinearProgress />
    )
  }

  return (
    <div>
      <FilterTabs tabs={[txt.Batting, txt.Bowling, txt.Fielding, txt.Captain]} setTabValue={setSelectedFilter} />
      <Box mt={2}>
        {selectedFilter === txt.Batting ? (
          <Grid container spacing={2}>
            {battingStats.map((battingStat, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} lg={3} key={index}>
                <Typography variant="body2" color='textSecondary' gutterBottom>{battingStat.title}</Typography>
                <Grid container spacing={2}>
                  {battingStat.data.map((stat, index2) => (
                    <Grid size={4} key={index2}>
                      <StatsCard
                        number={stat.number}
                        title={stat.title}
                        backgroundColor='blue'
                      />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            ))}
          </Grid>
        ) : selectedFilter === txt.Bowling ? (
          <Grid container spacing={2}>
            {bowlingStats.map((bowlingStat, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} lg={3} key={index}>
                <Typography variant="body2" color='textSecondary' gutterBottom>{bowlingStat.title}</Typography>
                <Grid container spacing={2}>
                  {bowlingStat.data.map((stat, index2) => (
                    <Grid size={4} key={index2}>
                      <StatsCard
                        number={stat.number}
                        title={stat.title}
                        backgroundColor='blue'
                      />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            ))}
          </Grid>
        ) : null}
      </Box>
    </div>
  )
}

export default Stats