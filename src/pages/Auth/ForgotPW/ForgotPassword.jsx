import React, { useState } from "react";
import { Container, Box } from "@mui/material";
import VerifyPhone from "./VerifyPhone";
import CreatePassword from "./CreatePassword";

function ForgotPassword() {
  const [playerId, setPlayerId] = useState("");
  const [step, setStep] = useState(1);

  return (
    <Box py={2} className="flex-center" style={{ minHeight: '100vh' }}>
      <Container>
        {step === 1 ? (
          <VerifyPhone playerId={playerId} setPlayerId={setPlayerId} goToNextStep={() => setStep(2)} />
        ) : (
          <CreatePassword playerId={playerId} />
        )}
      </Container>
    </Box>
  );
}

export default ForgotPassword;