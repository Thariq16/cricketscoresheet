import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardHeader,
  Grid,
  Divider,
  CardContent,
  CircularProgress,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { sendHttpRequest } from "../../../common/Common";

export default function Groups() {
  const { tournamentId } = useParams();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchGroups() {
      try {
        const response = await sendHttpRequest("GET", `/tournament/${tournamentId}/groups`);
        if (isMounted) {
          // Sort teams by points and NRR
          const sortedGroups = response.data.groups.map((group) => ({
            ...group,
            teams: group.teams.sort((a, b) => b.points - a.points || b.nrr - a.nrr),
          }));
          setGroups(sortedGroups || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to fetch groups");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchGroups();

    return () => {
      isMounted = false;
    };
  }, [tournamentId]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", my: 4 }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading groups...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          border: 1,
          borderColor: "error.main",
          borderRadius: 1,
          p: 2,
          textAlign: "center",
          bgcolor: "error.light",
          color: "error.contrastText",
          my: 2,
        }}
      >
        <Typography variant="body1">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      {groups.length > 0 ? (
        <Grid container spacing={3}>
          {groups.map((group, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                elevation={0}
                sx={{
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 2,
                  boxShadow: 3,
                  display: "flex",
                  flexDirection: "column",
                  bgcolor: "#F8F8F8", 
                  color: "primary.contrastText", 
                }}
              >
                <CardHeader title={group.name || "Unnamed Group"} 
                sx={{
                    '& .MuiCardHeader-title': {
                      color: '#000000'
                    },
                   
                  }}
                  />
                <Divider />
                <CardContent sx={{ flexGrow: 1, p: 1 }}>
                  {group.teams && group.teams.length > 0 ? (
                    <Table size="small" aria-label={`Standings for ${group.name}`}>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: "bold" }}>Team</TableCell>
                          <TableCell align="center" sx={{ fontWeight: "bold" }}>
                            W
                          </TableCell>
                          <TableCell align="center" sx={{ fontWeight: "bold" }}>
                            L
                          </TableCell>
                          <TableCell align="center" sx={{ fontWeight: "bold" }}>
                            Pts
                          </TableCell>
                          <TableCell align="center" sx={{ fontWeight: "bold" }}>
                            NRR
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {group.teams.map((teamEntry, idx) => (
                          <TableRow key={idx}>
                            <TableCell>
                              <Tooltip
                                title={teamEntry.teamId?.name || "Unknown Team"}
                                arrow
                              >
                                <Typography
                                  variant="body2"
                                  sx={{
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {teamEntry.teamId?.name || "Unknown Team"}
                                </Typography>
                              </Tooltip>
                            </TableCell>
                            <TableCell align="center">
                              {teamEntry.wins ?? 0}
                            </TableCell>
                            <TableCell align="center">
                              {teamEntry.losses ?? 0}
                            </TableCell>
                            <TableCell align="center">
                              {teamEntry.points ?? 0}
                            </TableCell>
                            <TableCell align="center">
                              {typeof teamEntry.nrr === "number"
                                ? teamEntry.nrr.toFixed(2)
                                : "-"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <Box sx={{ textAlign: "center", py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        No teams in this group.
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            No groups assigned yet.
          </Typography>
        </Box>
      )}
    </Box>
  );
}