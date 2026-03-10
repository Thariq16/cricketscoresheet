import { KeyboardArrowRight } from '@mui/icons-material'
import React, { useState } from 'react'
import NumberBottonSheet from './NumberBottonSheet'

function CustomNumberField({ title, icon, value, setValue, maxValue }) {
  const [showNumberMenu, setShowNumberMenu] = useState(false)

  return (
    <>
      <div
        style={{ fontSize: "16px" }} className='flex-between w-100'
        onClick={() => setShowNumberMenu(true)}
      >
        <p style={{ color: 'var(--primary-color-700)' }}>{title}</p>
        <b className='d-flex text-info'>
          {value} <KeyboardArrowRight />
        </b>
      </div>
      <NumberBottonSheet
        isOpen={showNumberMenu}
        onDismiss={() => setShowNumberMenu(false)}
        title={title} providedIcon={icon}
        value={value} setValue={setValue} maxValue={maxValue}
      />
    </>
  )
}

export default CustomNumberField