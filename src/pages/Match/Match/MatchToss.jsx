import React, { useState } from 'react'
import { Box, Card, CardActionArea, CircularProgress, Container, Grid, Typography } from '@mui/material'
import { txt } from "../../../common/context";
import { PrimaryButton } from '../../../components/CustomMUI/CustomButtons';
import { sendHttpRequest } from '../../../common/Common';
import { toast } from 'react-toastify';
import TeamImg from '../../../assets/images/team.jpg'
import OptionsBottonSheet from '../../../components/CustomSelectField/OptionsBottonSheet';
import BatBallIcon from "../../../assets/images/svg/batBallWithGrayBg.svg";
import Header from '../../../components/Header';
import { useNavigate, useLocation } from 'react-router-dom';

export default function MatchToss() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedMatch = location.state.matchDetails;
  const [wonTossTeam, setWonTossTeam] = useState('');
  const [chooseTo, setChooseTo] = useState('');
  const [showBatOrFieldOption, setShowBatOrFieldOption] = useState(false);
  const options = ["Bat", "Field"];
  const [isLoading, setIsLoading] = useState(false);

  const updateTossWonDetails = async () => {

    const data = {
      wonTossTeam,
      chooseTo,
      matchId: selectedMatch?._id
    }

    setIsLoading(true);
    try {
      await sendHttpRequest("POST", `/match/toss`, null, JSON.stringify(data));
      navigate(-1);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error.response);
    } finally {
      setIsLoading(false);
    }
  }

  const showBatOrFieldOptionHandler = (team) => {
    setWonTossTeam(team);
    setChooseTo('');
    setShowBatOrFieldOption(true);
  }

  return (
    <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Header title='Toss' />
      <Container>
        <Typography variant='body1' gutterBottom>Select the team that won the toss to proceed</Typography>
        <Grid container spacing={2}>
          <Grid size={6}>
            <Card
              elevation={0}
              style={{ border: '1px solid var(--neutral-white)', borderRadius: '8px', boxShadow: '0px 4px 4px 0px #EDE8EC14' }}
            >
              <CardActionArea onClick={() => showBatOrFieldOptionHandler(selectedMatch.teamA._id)}>
                <img src={TeamImg} className='teamLogo' alt="" width='100%' />
                <Typography variant='h6' align='center'>{selectedMatch.teamA.name}</Typography>
              </CardActionArea>
            </Card>
            {wonTossTeam === selectedMatch.teamA._id &&
              <Box mt={2}>
                <Typography variant='body1' align='center'>Won the toss</Typography>
                {chooseTo &&
                  <Typography variant='body1' align='center'>Choose to {chooseTo}</Typography>
                }
              </Box>
            }
          </Grid>
          <Grid size={6}>
            <Card
              elevation={0}
              style={{ border: '1px solid var(--neutral-white)', borderRadius: '8px', boxShadow: '0px 4px 4px 0px #EDE8EC14' }}
            >
              <CardActionArea onClick={() => showBatOrFieldOptionHandler(selectedMatch.teamB._id)}>
                <img src={TeamImg} className='teamLogo' alt="" width='100%' />
                <Typography variant='h6' align='center'>{selectedMatch.teamB.name}</Typography>
              </CardActionArea>
            </Card>
            {wonTossTeam === selectedMatch.teamB._id &&
              <Box mt={2}>
                <Typography variant='body1' align='center'>Won the toss</Typography>
                {chooseTo &&
                  <Typography variant='body1' align='center'>Choose to {chooseTo}</Typography>
                }
              </Box>
            }
          </Grid>
        </Grid>
        <PrimaryButton
          className='mt-15'
          onClick={updateTossWonDetails} disabled={!wonTossTeam || !chooseTo || isLoading}
          endIcon={isLoading && <CircularProgress color='inherit' size={'1.5rem'} />}
        >
          {txt.continue_to_scoresheet}
        </PrimaryButton>
      </Container>
      <OptionsBottonSheet
        errorMsg={`Please select what this team should start with`}
        isOpen={showBatOrFieldOption}
        onDismiss={() => setShowBatOrFieldOption(false)}
        title={'Choose to'} description={'Select what this team should start with'} providedIcon={BatBallIcon}
        options={options} setValue={setChooseTo}
      />
    </div>
  )
}
