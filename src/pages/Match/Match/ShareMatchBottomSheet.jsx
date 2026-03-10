import React, { useState } from 'react'
import BottomDrawer from '../../../components/BottomDrawer'
import { PrimaryButton } from '../../../components/CustomMUI/CustomButtons'
import { Box, Button } from '@mui/material'

function ShareMatchBottomSheet() {
  const [openShareDrawer, setOpenShareDrawer] = useState(false)

  return (
    <div>
      <PrimaryButton onClick={() => setOpenShareDrawer(true)}>Share Match</PrimaryButton>
      <BottomDrawer
        isOpen={openShareDrawer} onDismiss={() => setOpenShareDrawer(false)}
        title="Share Match"
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" gridGap={2}>
          <Button
            onClick={() =>
              window.open(
                "https://api.whatsapp.com/send?text=" + window.location.href,
                "_blank"
              )
            }
          >
            <img src="/images/Whatsapp.png" alt="WhatsApp" width="100%" height="auto" />
          </Button>
          <Button
            onClick={() =>
              window.open(
                "https://www.facebook.com/sharer/sharer.php?u=" + window.location.href,
                "_blank"
              )
            }
          >
            <img src="/images/Facebook.png" alt="Facebook" width="100%" height="auto" />
          </Button>
          <Button
            onClick={() =>
              window.open(
                "https://twitter.com/intent/tweet?url=" + window.location.href,
                "_blank"
              )
            }
          >
            <img src="/images/x.png" alt="X" width="100%" height="auto" />
          </Button>
        </Box>
      </BottomDrawer>
    </div>
  )
}

export default ShareMatchBottomSheet