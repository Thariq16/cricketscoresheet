import React, { useContext } from "react";
import { Grid, Box, IconButton, Typography } from "@mui/material";
import { CustomCardButton } from "../CustomMUI/CustomSmallButton";
import MinusIcon from "../../assets/images/svg/MinusIcon.svg";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const TeamCard = ({ team, buttonName, onClick, isRemove }) => {
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        backgroundColor: "#BFDCEB", 
        padding: 2,
        borderRadius: 2,
        mb: 2,
      }}
    >
      <Grid container alignItems="center" spacing={2}>
        <Grid item xs onClick={() => navigate(`/team/info/${team._id}`)} className="cursor-pointer">
          <Typography sx={{ color: "#000", fontFamily: "DM Sans", fontWeight: 400, fontSize: "15px" }}>
            {team.name}
          </Typography>
          <Typography sx={{ color: "var(--color1)", fontFamily: "DM Sans", fontWeight: 400, fontSize: "13px" }}>
            {team.teamLocation}
          </Typography>
        </Grid>

        {team.owner._id === userInfo._id && (
          <Grid item>
            <Typography variant="body2" className='text-info'>Admin</Typography>
          </Grid>
        )}

        <Grid item>
          {isRemove ? (
            <IconButton onClick={() => onClick(team)}>
              <img src={MinusIcon} alt="remove" />
            </IconButton>
          ) : onClick ? (
            <CustomCardButton
              onClick={() => onClick(team)}
              disabled={false}
              name={buttonName}
            />
          ) : (
            <CustomCardButton
              onClick={() => navigate(`/team/info/${team._id}`)}
              disabled={false}
              name='View'
            />
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default TeamCard;