import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { sendHttpRequest } from "../../common/Common";
import { PrimaryButton } from "../CustomMUI/CustomButtons";
import AddAdminModal from "./AddAdminModal";
import BottomDrawer from "../BottomDrawer";
import { useNavigate } from "react-router-dom";

export default function TournamentSettings({ tournamentId, onClose, isOpen }) {
  const [tournamentDetails, setTournamentDetails] = useState(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (tournamentId) {
      getTournamentDetails(tournamentId);
    }
  }, [tournamentId]);

  function getTournamentDetails(id) {
    setIsLoading(true);
    sendHttpRequest("GET", "/tournament/" + id)
      .then((res) => {
        setTournamentDetails(res.data.data);
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Failed to load tournament");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  if (!tournamentDetails) return null; // or spinner

  return (
    <>
      <BottomDrawer
        isOpen={isOpen}
        onDismiss={onClose}
        title={`Settings - ${tournamentDetails.name}`}
      >
        <div className="page-wrapper flex-center-vertical">
          <PrimaryButton
            className="mb-15"
            onClick={() => navigate('/tournament/update/' + tournamentDetails._id)}
            disabled={isLoading}
          >
            Edit Tournament
          </PrimaryButton>

          <PrimaryButton
            onClick={() => setIsAdminModalOpen(true)}
            disabled={isLoading}
          >
            Admins
          </PrimaryButton>
        </div>
      </BottomDrawer>
      

      {isAdminModalOpen && (
        <AddAdminModal
          id={tournamentDetails._id}
          existingAdmins={tournamentDetails?.admins?.map((a) => a._id)}
          reloadTournamentDetails={() => getTournamentDetails(tournamentDetails._id)}
          onClose={() => setIsAdminModalOpen(false)}
          open={isAdminModalOpen}
        />
      )}
    </>
  );
}