import { Card, CircularProgress } from '@mui/material';
import React, { useContext, useState } from 'react';
import { PrimaryButton } from '../../../components/CustomMUI/CustomButtons';
import { sendHttpRequest, WEB_BASE_URL } from '../../../common/Common';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import TournamentSettings from '../../../components/tournaments/TournamentSettings';

function Details({ tournamentDetails, refreshData }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const navigate = useNavigate();
  const { userInfo } = useContext(AuthContext);

  function startTournament() {
    let endpoint = '';
    let data = { tournamentId: tournamentDetails._id };

    // Set endpoint and data based on tournament type
    if (tournamentDetails.tournamentType === 'Group stage & Knockout') {
      endpoint = '/tournament/groups';
      data.numberOfGroups = tournamentDetails.numberOfGroups;
      data.userId = userInfo._id; // Add userId for assignGroups
    } else if (tournamentDetails.tournamentType === 'knockout') {
      endpoint = '/tournament/knockout';
      data.userId = userInfo._id;
    } else if (tournamentDetails.tournamentType === 'league') {
      endpoint = '/tournament/league';
      data.userId = userInfo._id;
    } else {
      toast.error('Unsupported tournament type');
      return;
    }

    setIsLoading(true);
    sendHttpRequest('POST', endpoint, null, JSON.stringify(data))
      .then(res => {
        refreshData();
        toast.success('Tournament started successfully!');
      })
      .catch((error) => {
        console.error('Error starting tournament:', error);
        toast.error(error.response?.data?.message || 'Failed to start tournament.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <div>
      <Card className="card" style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '12px' }}>        
        <h2 className="text-center text-primary my-0">
          {tournamentDetails.name} <br />
        </h2>
        <h3 className="text-center text-primary my-0">
          {tournamentDetails.matchList?.length} matches | {tournamentDetails.teamList?.length} / {tournamentDetails.teamCount} Teams
        </h3>
        <hr />
        <div className="flex-between">
          <div className="flex-center-vertical text-primary">
            <span> Date: {tournamentDetails.startDate} </span>
            <span> Ground: {tournamentDetails.ground} </span>
            <div> Pitch Type: {tournamentDetails.pitchType}</div>
          </div>
          <div className="flex-center-vertical text-primary">
            <span> Category: {tournamentDetails.tournamentType} </span>
            <span> Ball: {tournamentDetails.ballType} </span>
            <div> Overs: {tournamentDetails.overs}</div>
          </div>
        </div>
      </Card>
      {(tournamentDetails.createdBy?._id === userInfo._id || tournamentDetails.admin?._id === userInfo._id) &&
        <div className="flex-around blur-bg py-15 px-15" style={{ gap: '0.5rem' }}>
          <PrimaryButton onClick={() => setIsSettingsOpen(true)}>
            Settings
          </PrimaryButton>
          {tournamentDetails.teamCount !== tournamentDetails.teamList?.length ? (
            <PrimaryButton
              onClick={() => {
                navigator.clipboard.writeText(`${WEB_BASE_URL}/tournament/register/${tournamentDetails._id}`);
                toast.success('Link copied to clipboard');
              }}
            >
              Invite Team
            </PrimaryButton>
          ) : tournamentDetails.status === 'NOT-STARTED' ? (
            <PrimaryButton onClick={() => startTournament()} endIcon={isLoading && <CircularProgress size={'1.5rem'} />}>
              Start Tournament
            </PrimaryButton>
          ) : null}
        </div>
      }
      {isSettingsOpen && (
        <TournamentSettings
          tournamentId={tournamentDetails._id}
          onClose={() => setIsSettingsOpen(false)}
          isOpen={isSettingsOpen}
        />
      )}
    </div>
  );
}

export default Details;