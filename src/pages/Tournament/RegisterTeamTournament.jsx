import React, { useState } from 'react'
import FileUpload from '../../components/FileUpload/FileUpload'
import { toast } from 'react-toastify'
import { sendHttpRequest } from '../../common/Common'
import { useNavigate, useParams } from 'react-router-dom'
import { PrimaryButton } from '../../components/CustomMUI/CustomButtons'
import { CircularProgress } from '@mui/material'
import Header from '../../components/Header'
import SelectTeamModal from '../../components/team/SelectTeamModal'

function RegisterTeamTournament() {
  const { tournamentId } = useParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [view, setView] = useState('SelectTeam')
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [paymentSlip, setPaymentSlip] = useState(null)

  const validateTeam = async (team) => {
    setIsLoading(true);
    if (!team) {
      toast.error("Please select a team");
      setIsLoading(false);
      return;
    }

    let tournamentDetails;
    try {
      const response = await sendHttpRequest("GET", "/tournament/" + tournamentId)
      tournamentDetails = response.data.data;
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
      return;
    } finally {
      setIsLoading(false);
    }

    if (tournamentDetails.registrationRequests.some(request => request.team._id === team._id)) {
      toast.error("Team already registered");
      setIsLoading(false);
      return;
    }

    const existingPlayerIds = tournamentDetails.registrationRequests.flatMap((request) => request.team.playerList);

    if (team.playerList.filter((player) => existingPlayerIds.includes(player._id)).length > 0) {
      toast.error("Cannot register team: Some players are already registered in other teams.");
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    setSelectedTeam(team);
    setView('Payment');
  }

  const registerTournament = async () => {
    if (!paymentSlip) {
      toast.error("Please upload proof of payment");
      setIsLoading(false);
      return;
    }

    try {
      const data = {
        tournamentId: tournamentId,
        team: selectedTeam._id,
        paymentSlip: "",
      }

      const response = await sendHttpRequest("PUT", "/tournament/register", null, JSON.stringify(data))
      toast.success(response.data.message)
      navigate("/tournament/all")
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      {view === 'SelectTeam' ? (
        <SelectTeamModal show={true} setSelectedTeam={(team) => validateTeam(team)} closeModal={() => { }} />
      ) : view === 'Payment' ? (
        <div className='page-wrapper'>
          <Header title='Register Team' isModal={true} closeModal={() => setView('SelectTeam')} />
          <FileUpload
            heading="Upload proof of payment"
            onChange={(value) => setPaymentSlip(value)}
          />
          <PrimaryButton
            onClick={() => registerTournament()}
            endIcon={isLoading && <CircularProgress />}
          >
            Register Team
          </PrimaryButton>
        </div>
      ) : null}
    </div>
  )
}

export default RegisterTeamTournament