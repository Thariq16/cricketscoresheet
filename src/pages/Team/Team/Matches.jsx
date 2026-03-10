import React, { useContext, useEffect, useState } from "react";
import { Grid, LinearProgress } from "@mui/material";
import { AuthContext } from "../../../context/AuthContext";
import { sendHttpRequest } from "../../../common/Common";
import { toast } from "react-toastify";
import FilterTabs from "../../../components/FilterTabs";
import MatchCard from "../../../components/Match/MatchCard";
import NoResults from "../../../components/NoResults";

function Matches({ teamId }) {
  const { userInfo } = useContext(AuthContext);
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tabValue, setTabValue] = useState('All');

  useEffect(() => {
    getMatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);

  function getMatches() {
    setIsLoading(true);
    sendHttpRequest("GET", "/match/team/" + teamId).then((res) => {
      setMatches(res.data.matches);
    }).catch((error) => {
      toast.error(error.response.data.message)
    }).finally(() => {
      setIsLoading(false);
    });
  }

  const getFilteredMatches = () => {
    if (tabValue === 'All') {
      return matches;
    } else if (tabValue === 'Ongoing') {
      return matches.filter(match => match.status === 'STARTED');
    } else if (tabValue === 'Upcoming') {
      return matches.filter(match => match.status === 'NOT-STARTED');
    } else if (tabValue === 'Participated') {
      return matches.filter(match => match.status === 'COMPLETE');
    }
  }


  if (isLoading) {
    return <LinearProgress />;
  } else if (matches.length === 0) {
    return <NoResults text="matches" />
  }

  return (
    <div>
      <FilterTabs tabs={['All', 'Ongoing', 'Upcoming', 'Participated']} setTabValue={setTabValue} />
      <Grid container spacing={2} style={{ marginTop: '1rem' }}>
        {getFilteredMatches().map((match, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} lg={3} key={index}>
            <MatchCard match={match} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default Matches;
