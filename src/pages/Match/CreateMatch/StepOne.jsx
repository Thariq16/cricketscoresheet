import React, { useState } from 'react'
import CustomTextField from '../../../components/CustomMUI/CustomTextField'
import { txt } from '../../../common/context'
import { PrimaryButton } from '../../../components/CustomMUI/CustomButtons'
import SelectTeamModal from '../../../components/team/SelectTeamModal'
import { toast } from 'react-toastify'

function StepOne({ formData, setFormData, handleSubmit }) {
  const [showSelectTeam, setShowSelectTeam] = useState('')

  const saveChanges = (e) => {
    e.preventDefault()

    if (formData.teamA._id === formData.teamB._id) {
      toast.error('Both teams cannot be same')
      return
    }

    if (formData.teamA.playerList.filter((player) => formData.teamB.playerList.map(playerB => playerB._id).includes(player._id)).length > 0) {
      toast.error("Some players are already in the other team.");
      return;
    }
    handleSubmit()
  }

  return (
    <div>
      <form onSubmit={saveChanges}>
        <CustomTextField
          label={txt.select_your_team} type="text" value={formData.teamA.name}
          onClick={() => setShowSelectTeam('teamA')}
          readOnly={true}
        />
        <CustomTextField
          label={txt.select_opposition_team} type="text" value={formData.teamB.name}
          onClick={() => setShowSelectTeam('teamB')}
          readOnly={true}
        />
        <CustomTextField
          label={txt.date} type="date" value={formData.matchDate} InputLabelProps={{ shrink: true }}
          onChange={(e) => setFormData("matchDate", e.target.value)}
        />
        <CustomTextField
          label={txt.time} type="time" value={formData.matchTime} InputLabelProps={{ shrink: true }}
          onChange={(e) => setFormData("matchTime", e.target.value)}
        />
        <CustomTextField
          label={txt.ground} type="text" value={formData.ground}
          onChange={(e) => setFormData("ground", e.target.value)}
        />
        <PrimaryButton className="mt-15" type="submit">{txt.continue}</PrimaryButton>
      </form>
      <SelectTeamModal
        show={!!showSelectTeam} closeModal={() => setShowSelectTeam('')}
        isShowMyTeams={showSelectTeam === 'teamA'}
        setSelectedTeam={(team) => { setFormData(showSelectTeam, team); setShowSelectTeam('') }}
      />
    </div>
  )
}

export default StepOne