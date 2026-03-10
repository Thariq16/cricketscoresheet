import React, { useState } from "react";
import { Card, CardActions, CardContent, Grid, LinearProgress } from "@mui/material";
import { sendHttpRequest } from "../../../common/Common";
import { toast } from "react-toastify";
import { PrimaryButton, SecondaryButton } from "../../../components/CustomMUI/CustomButtons";
import FilterTabs from "../../../components/FilterTabs";
import moment from "moment";
import TeamCard from "../../../components/team/TeamCard";

const RegisteredTeams = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [tabValue, setTabValue] = useState('Approved Teams');

  const approveTeam = (teamId) => {
    if (props.tournamentDetails.status === "STARTED") {
      toast.error("Tournament is already started");
      return;
    }

    if (props.tournamentDetails.teamCount === props.tournamentDetails.teamList.length) {
      toast.error("Maximum number of teams are approved");
      return;
    }

    const data = {
      tournamentId: props.tournamentDetails._id,
      teamId: teamId,
    };

    setIsLoading(true);
    sendHttpRequest("PUT", `/tournament/register/approve`, null, JSON.stringify(data)).then(() => {
      props.reloadTournament();
    }).catch((error) => {
      toast.error(error.response.data.message);
    }).finally(() => {
      setIsLoading(false);
    });
  }

  const rejectTeam = (teamId) => {
    if (props.tournamentDetails.status === "STARTED") {
      toast.error("Tournament is already started");
      return;
    }

    const data = {
      tournamentId: props.tournamentDetails._id,
      teamId: teamId,
    };

    setIsLoading(true);
    sendHttpRequest("PUT", `/tournament/register/reject`, null, JSON.stringify(data)).then(() => {
      props.reloadTournament();
    }).catch((error) => {
      toast.error(error.response.data.message);
    }).finally(() => {
      setIsLoading(false);
    });
  }

  if (isLoading) {
    return <LinearProgress />
  }

  return (
    <div>
      <FilterTabs tabs={['Approved Teams', 'Registered Teams']} setTabValue={setTabValue} />
      {tabValue === 'Approved Teams' ? (
        <Grid container className="mt-15" spacing={2}>
          {props?.tournamentDetails?.registrationRequests?.filter(request => request.approved === true).map((request, index) => (
            <Grid key={index} item size={12}>
              <Card elevation={0} style={{ border: '2px solid var(--neutral-white)', borderRadius: '8px', backgroundColor: '#BFDCEB' }}>
                <CardContent>
                  <TeamCard team={request.team} />
                  <div className="mt-15">Registered Date: {moment(request.registeredDate).format('DD/MM/YYYY')}</div>
                </CardContent>
                <CardActions>
                  <SecondaryButton onClick={() => { window.open(request.paymentSlip, "_blank"); }}>
                    View Payment
                  </SecondaryButton>
                  <PrimaryButton className="delete-btn" onClick={() => rejectTeam(request.team._id)}>
                    Refuse
                  </PrimaryButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container className="mt-15" spacing={2}>
          {props?.tournamentDetails?.registrationRequests?.filter(request => request.approved === false).map((request, index) => (
            <Grid key={index} item size={12}>
              <Card elevation={0} style={{ border: '1px solid var(--neutral-white)', borderRadius: '8px' }}>
                <CardContent>
                  <TeamCard team={request.team} />
                  <div className="mt-15">Registered Date: {moment(request.registeredDate).format('DD/MM/YYYY')}</div>
                </CardContent>
                <CardActions>
                  <SecondaryButton onClick={() => { window.open(request.paymentSlip, "_blank"); }}>
                    View Payment
                  </SecondaryButton>
                  <PrimaryButton onClick={() => approveTeam(request.team._id)}>Approve</PrimaryButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default RegisteredTeams;