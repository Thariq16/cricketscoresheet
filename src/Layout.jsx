import React from "react"
import { Box } from "@mui/material";
import BottomNav from "./components/BottomNav";
import Navbar from "./components/Navbar";

export default function Layout(props) {
  return (
    <main style={{ display: 'flex', flexDirection: 'column', height: '100vh', maxWidth: '100vw', overflowX: 'hidden' }}>
      <Navbar />
      <Box sx={{ flexGrow: 1, my: 8 }}>
        {props.children}
      </Box>
      <BottomNav />
    </main>
  )
}