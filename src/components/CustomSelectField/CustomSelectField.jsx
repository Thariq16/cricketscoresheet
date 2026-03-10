import { KeyboardArrowRight } from '@mui/icons-material'
import React, { useState } from 'react'
import OptionsBottonSheet from './OptionsBottonSheet'

function CustomSelectField({ title, icon, value, setValue, options }) {
  const [showOptionsMenu, setShowOptionsMenu] = useState(false)

  return (
    <>
      <div
        style={{ fontSize: "16px" }} className='flex-between w-100'
        onClick={() => setShowOptionsMenu(true)}
      >
        <p style={{ color: 'var(--primary-color-700)' }}>{title}</p>
        <b className='d-flex text-info'>
          {value} <KeyboardArrowRight />
        </b>
      </div>
      <OptionsBottonSheet
        errorMsg={`Please select a ${title}`}
        isOpen={showOptionsMenu}
        onDismiss={() => setShowOptionsMenu(false)}
        title={title} description={`Select the desired ${title}`} providedIcon={icon}
        options={options} value={value} setValue={setValue}
      />
    </>
  )
}

export default CustomSelectField