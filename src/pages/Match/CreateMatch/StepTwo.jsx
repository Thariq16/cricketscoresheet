import React from 'react'
import CustomSelectField from '../../../components/CustomSelectField/CustomSelectField'
import { toast } from 'react-toastify'
import { txt } from '../../../common/context'
import { PrimaryButton } from '../../../components/CustomMUI/CustomButtons'
import BallIcon from '../../../assets/images/svg/ball.svg'
import PitchIcon from '../../../assets/images/svg/pitch.svg'
import CustomNumberField from '../../../components/CustomNumberField/CustomNumberField'
import { CircularProgress } from '@mui/material'
import { ballTypes, matchTypes, pitchTypes } from '../../../constants/data'

function StepTwo({ formData, setFormData, handleSubmit, isLoading }) {

  const saveChanges = () => {
    if (!formData.ballType) {
      toast.error("Select a ball type")
      return
    }
    if (!formData.pitchType) {
      toast.error("Select a pitch type")
      return
    }
    if (!formData.matchType) {
      toast.error("Select a match type")
      return
    }
    if (!formData.overs) {
      toast.error("Enter number of overs")
      return
    }
    handleSubmit()
  }

  return (
    <div>
      <CustomSelectField
        title="Match Type" options={matchTypes}
        value={formData.matchType} setValue={(value) => setFormData("matchType", value)}
      />
      <CustomSelectField
        title="Ball Type" icon={BallIcon} options={ballTypes}
        value={formData.ballType} setValue={(value) => setFormData("ballType", value)}
      />
      <CustomSelectField
        title="Pitch Type" icon={PitchIcon} options={pitchTypes}
        value={formData.pitchType} setValue={(value) => setFormData("pitchType", value)}
      />
      <CustomNumberField
        title="No. of overs"
        value={formData.overs} maxValue={50}
        setValue={(value) => setFormData("overs", value)}
      />
      <PrimaryButton
        className="mt-15" onClick={saveChanges} disabled={isLoading}
        endIcon={isLoading && <CircularProgress color='inherit' size={'1.5rem'} />}
      >
        {txt.confirm}
      </PrimaryButton>
    </div>
  )
}

export default StepTwo