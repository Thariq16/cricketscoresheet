import React, { useContext, useEffect, useState } from 'react'
import { sendHttpRequest } from '../../../common/Common';
import { toast } from 'react-toastify';
import { Grid, LinearProgress } from '@mui/material';
import NoResults from '../../../components/NoResults';
import { AuthContext } from '../../../context/AuthContext';
import TeamCard from '../../../components/team/TeamCard';

function OtherTeams() {
  const { userInfo } = useContext(AuthContext);
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getTournaments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);

  function getTournaments() {
    setIsLoading(true);
    sendHttpRequest("GET", "/team/other/" + userInfo._id).then((res) => {
      setTeams(res.data);
    }).catch((error) => {
      toast.error(error.response.data.message)
    }).finally(() => {
      setIsLoading(false);
    });
  }

  if (isLoading) {
    return <LinearProgress />;
  } else if (teams.length === 0) {
    return <NoResults text="teams" />
  }

  return (
    <div>
      <Grid container spacing={2} style={{ marginTop: '1rem' }}>
        {teams.map((team, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} lg={3} key={index}>
            <TeamCard team={team} />
          </Grid>
        ))}
      </Grid>
    </div>
  )
}

export default OtherTeams