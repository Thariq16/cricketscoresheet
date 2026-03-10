import { Dialog, DialogActions, DialogContent, Typography } from '@mui/material'
import React from 'react'
import { PrimaryButton, SecondaryButton } from '../CustomMUI/CustomButtons';

function EndInningOrMatchAlert({ show, alert, closeModal, endInnings, endMatch, buttonType, forType }) {
  const handleEndInnings = () => {
    closeModal();
    endInnings();
  }

  const handleEndMatch = () => {
    closeModal();
    endMatch();
  }

  return (
    <Dialog open={show} onClose={closeModal} maxWidth='md'>
      <DialogContent>
        <Typography variant='h5'>{alert}</Typography>
      </DialogContent>
      <DialogActions>
        {buttonType === 'yesNo' ? (
          <>
            <SecondaryButton onClick={closeModal}>
              No
            </SecondaryButton>
            <PrimaryButton onClick={() => { forType === 'endInning' ? handleEndInnings() : handleEndMatch() }}>
              Yes
            </PrimaryButton>
          </>
        ) : (
          <PrimaryButton onClick={closeModal}>
            Okay
          </PrimaryButton>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default EndInningOrMatchAlert