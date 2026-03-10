import React, { useContext, useEffect, useState } from 'react'
import { sendHttpRequest } from '../../../common/Common';
import { toast } from 'react-toastify';
import { Grid, LinearProgress } from '@mui/material';
import NoResults from '../../../components/NoResults';
import TournamentCard from '../../../components/tournaments/TournamentCard';
import { AuthContext } from '../../../context/AuthContext';

function OtherTournaments() {
  const { userInfo } = useContext(AuthContext);
  const [tournaments, setTournaments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getTournaments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);

  function getTournaments() {
    setIsLoading(true);
    sendHttpRequest("GET", "/tournament/open/" + userInfo._id).then((res) => {
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

  return (
    <div>
      <Grid container spacing={2} style={{ marginTop: '1rem' }}>
        {tournaments.map((tournament, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} lg={3} key={index}>
            <TournamentCard tournament={tournament} />
          </Grid>
        ))}
      </Grid>
    </div>
  )
}

export default OtherTournaments