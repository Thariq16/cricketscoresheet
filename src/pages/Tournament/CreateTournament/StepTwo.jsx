import React from 'react'
import CustomSelectField from '../../../components/CustomSelectField/CustomSelectField'
import { toast } from 'react-toastify'
import { txt } from '../../../common/context'
import { PrimaryButton } from '../../../components/CustomMUI/CustomButtons'
import BallIcon from '../../../assets/images/svg/ball.svg'
import PitchIcon from '../../../assets/images/svg/pitch.svg'
import CustomNumberField from '../../../components/CustomNumberField/CustomNumberField'
import { ballTypes, pitchTypes, tournamentTypes } from '../../../constants/data'

function StepTwo({ formData, setFormData, handleSubmit }) {
  
  const saveChanges = () => {
    if (!formData.ballType) {
      toast.error("Select a ball type")
      return
    }
    if (!formData.pitchType) {
      toast.error("Select a pitch type")
      return
    }
    if (!formData.tournamentType) {
      toast.error("Select a tournament type")
      return
    }
    if (!formData.overs) {
      toast.error("Enter number of overs")
      return
    }
    if (!formData.teamCount) {
      toast.error("Enter number of teams")
      return
    }
    handleSubmit()
  }

  return (
    <div>
      <CustomSelectField
        title="Ball Type" icon={BallIcon} options={ballTypes}
        value={formData.ballType} setValue={(value) => setFormData("ballType", value)}
      />
      <CustomSelectField
        title="Pitch Type" icon={PitchIcon} options={pitchTypes}
        value={formData.pitchType} setValue={(value) => setFormData("pitchType",value)}
      />
      <CustomSelectField
        title="Tournament Type" options={tournamentTypes}
        value={formData.tournamentType} setValue={(value) => setFormData("tournamentType", value)}
      />
      {formData.tournamentType === "Group stage & Knockout" && (
        <>
          <CustomSelectField
            title="Number of Groups"
            options={["2", "4"]}
            value={formData.numberOfGroups ? String(formData.numberOfGroups) : ""}
            setValue={(value) => setFormData("numberOfGroups", value)}
          />
          <div style={{ marginBottom: 8, color: '#666', fontSize: 14 }}>
            {formData.numberOfGroups === "2" && "Top 2 teams from each group advance to knockout (semifinals)."}
            {formData.numberOfGroups === "4" && "Top 1 team from each group advances to knockout (semifinals)."}
            {!formData.numberOfGroups && "Select number of groups. Only 2 or 4 groups are allowed."}
          </div>
        </>
      )}
      <CustomNumberField
        title="No. of overs"
        value={formData.overs} maxValue={50}
        setValue={(value) => setFormData("overs", value)}
      />
      <CustomNumberField
        title="No. of teams"
        value={formData.teamCount} maxValue={20}
        setValue={(value) => setFormData("teamCount", value)}
      />
      <PrimaryButton className="mt-15" onClick={() => saveChanges()}>{txt.continue}</PrimaryButton>
    </div>
  )
}

export default StepTwo