import { Box, Button } from '@mui/material'
import React, { useState } from 'react'

function FilterTabs({ tabs, setTabValue }) {
  const [value, setValue] = useState(tabs[0]);
  return (
    <Box display='flex' justifyContent='space-evenly' alignItems='center' style={{ gap: '0.5rem', overflowX: 'auto', scrollbarWidth: 'none' }}>
      {tabs.map((tab, index) => (
        <Button
          key={index} variant={tab === value ? 'contained' : 'outlined'} size='small' disableElevation
          className={tab === value ? 'primary-btn' : 'primary-hollow-btn'} fullWidth
          onClick={() => { setValue(tab); setTabValue(tab) }}
          style={{ textTransform: 'none' }}
        >
          {tab}
        </Button>
      ))}
    </Box>
  )
}

export default FilterTabs