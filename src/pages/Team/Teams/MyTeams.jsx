import React, { useContext, useEffect, useState } from 'react'
import { sendHttpRequest } from '../../../common/Common';
import { toast } from 'react-toastify';
import { Grid, LinearProgress } from '@mui/material';
import NoResults from '../../../components/NoResults';
import FilterTabs from '../../../components/FilterTabs';
import { AuthContext } from '../../../context/AuthContext';
import TeamCard from '../../../components/team/TeamCard';

function MyTeams() {
  const { userInfo } = useContext(AuthContext);
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tabValue, setTabValue] = useState('All');

  useEffect(() => {
    getTeams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);

  function getTeams() {
    setIsLoading(true);
    sendHttpRequest("GET", "/team/user/" + userInfo._id).then((res) => {
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

  const getFilteredTeams = () => {
    if (tabValue === 'All') {
      return teams;
    } else if (tabValue === 'Own') {
      return teams.filter(team => team.owner._id === userInfo._id);
    } else if (tabValue === 'Part of') {
      return teams.filter(team => team.owner._id !== userInfo._id);
    }
  }

  return (
    <div>
      <FilterTabs tabs={['All', 'Own', 'Part of']} setTabValue={setTabValue} />
      <Grid container spacing={2} style={{ marginTop: '1rem' }}>
        {getFilteredTeams().map((team, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} lg={3} key={index}>
            <TeamCard team={team} />
          </Grid>
        ))}
      </Grid>
    </div>
  )
}

export default MyTeams