import { Box } from '@mui/material'
import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import MatchCard from '../../../components/Match/MatchCard';
import { AuthContext } from '../../../context/AuthContext';
import { DeleteButton, PrimaryButton, SecondaryButton } from '../../../components/CustomMUI/CustomButtons';
import DeleteMatchBottomSheet from '../DeleteMatchBottomSheet';
import ShareMatchBottomSheet from './ShareMatchBottomSheet';

function Details({ matchDetails }) {
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showDeleteMatch, setShowDeleteMatch] = useState(false);

  return (
    <div>
      <MatchCard match={matchDetails} />
      {(matchDetails.status === 'NOT-STARTED' && matchDetails.createdBy._id === userInfo._id) ? (
        <Box my={2}>
          <Box className='flex-between' sx={{ gap: 5, mb: 2 }}>
            <SecondaryButton onClick={() => navigate('/match/update/' + matchDetails._id)}>Edit</SecondaryButton>
            <DeleteButton onClick={() => setShowDeleteMatch(true)}>Delete</DeleteButton>
          </Box>
          <PrimaryButton onClick={() => navigate("/match/toss", { state: { matchDetails } })}>
            Proceed for Toss
          </PrimaryButton>
        </Box>
      ) : (matchDetails.status === 'STARTED' && matchDetails.createdBy._id === userInfo._id) ? (
        <PrimaryButton className='my-15' onClick={() => navigate("/match/score-sheet", { state: { selectedMatch: matchDetails } })}>
          Score Match
        </PrimaryButton>
      ) : null}
      <ShareMatchBottomSheet />
      <DeleteMatchBottomSheet
        isOpen={showDeleteMatch} match={matchDetails}
        onDismiss={() => setShowDeleteMatch(false)}
      />
    </div>
  )
}

export default Details