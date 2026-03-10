import React, { useContext, useEffect, useState } from 'react'
import { sendHttpRequest } from '../../../common/Common';
import { toast } from 'react-toastify';
import { Grid, LinearProgress } from '@mui/material';
import TournamentCard from '../../../components/tournaments/TournamentCard';
import NoResults from '../../../components/NoResults';
import FilterTabs from '../../../components/FilterTabs';
import { AuthContext } from '../../../context/AuthContext';

function MyTournaments() {
  const { userInfo } = useContext(AuthContext);
  const [tournaments, setTournaments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tabValue, setTabValue] = useState('All');

  useEffect(() => {
    getTournaments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);

  function getTournaments() {
    setIsLoading(true);
    sendHttpRequest("GET", "/tournament/user/" + userInfo._id).then((res) => {
      setTournaments(res.data.data);
    }).catch((error) => {
      toast.error(error.response.data.message)
    }).finally(() => {
      setIsLoading(false);
    });
  }

  if (isLoading) {
    return <LinearProgress />;
  } else if (tournaments.length === 0) {
    return <NoResults text="tournaments" />
  }

  const getFilteredTournaments = () => {
    if (tabValue === 'All') {
      return tournaments;
    } else if (tabValue === 'Ongoing') {
      return tournaments.filter(tournament => tournament.status === 'STARTED');
    } else if (tabValue === 'Upcoming') {
      return tournaments.filter(tournament => tournament.status === 'NOT-STARTED');
    } else if (tabValue === 'Participated') {
      return tournaments.filter(tournament => tournament.status === 'COMPLETE');
    }
  }

  return (
    <div>
      <FilterTabs tabs={['All', 'Ongoing', 'Upcoming', 'Participated']} setTabValue={setTabValue} />
      <Grid container spacing={2} style={{ marginTop: '1rem' }}>
        {getFilteredTournaments().map((tournament, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} lg={3} key={index}>
            <TournamentCard tournament={tournament} />
          </Grid>
        ))}
      </Grid>
    </div>
  )
}

export default MyTournaments