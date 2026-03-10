import React from 'react'
import CloseIcon from "../assets/images/svg/close.svg";
import RightArrow from "../assets/images/svg/rightArrow.svg";
import { Drawer, Typography } from '@mui/material';

const BottomDrawer = ({ isOpen, onDismiss, title, providedIcon, children, description }) => {
  return (
    <Drawer
      anchor='bottom'
      open={isOpen}
      onClose={onDismiss}
      slotProps={{
        paper: {
          sx: {
            borderTopLeftRadius: '20px',
            borderTopRightRadius: '20px',
          },
        },
      }}
    >
      <div className='px-15 py-15'>
        <div className="flex-between mb-15">
          <img src={providedIcon || RightArrow} alt="Drawer Icon" />
          <img src={CloseIcon} alt="Close" style={{ cursor: 'pointer' }} onClick={onDismiss} />
        </div>
        <Typography variant='h6'>{title}</Typography>
        <Typography variant='subtitle2' className="mb-15">{description}</Typography>
        {children}
      </div>
    </Drawer>
  )
}

export default BottomDrawer