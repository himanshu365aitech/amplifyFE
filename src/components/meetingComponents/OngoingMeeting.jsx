import React, { useEffect, useState } from "react";
import Main from "../WebRtc/src/components/Main/Main";
import styled from "styled-components";
import socket from "../WebRtc/src/socket"; // Make sure this import path is correct
import axios from "axios";
const OngoingMeeting = ({ users, iframeLink }) => {
  const [breakRoomID, setBreakRoomID] = useState(null);
  const [fullName, setFullName] = useState("");
  const [showWebRTC, setShowWebRTC] = useState(false);
  const [breakoutRooms, setBreakoutRooms] = useState([]);
  const [role, setRole] = useState("");
  useEffect(() => {
    const extractedFullName = getFullNameFromQuery();
    setFullName(extractedFullName);
    const params = new URLSearchParams(window.location.search);
    setRole(params.get("role"));
  }, []);

  const getFullNameFromQuery = () => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return params.get("fullName") || "Guest";
    }
    return "Guest";
  };
  const fetchBreakoutRooms = async () => {
    const roomIdFromURL = window.location.pathname.split("/")[2];
    try {
      const response = await axios.get(
        `https://amplifymeetingbe.onrender.com/api/meeting/${roomIdFromURL}`
      );
      setBreakoutRooms(response.data);
    } catch (error) {
      console.error("Error fetching breakout rooms:", error);
    }
  };
  useEffect(() => {
    fetchBreakoutRooms();
  });
  const createBreakoutRoom = async () => {
    const roomIdFromURL = window.location.pathname.split("/")[2]; // This will give "66e151e0cb17166db632fc3f"

    try {
      const response = await axios.post(
        `https://amplifymeetingbe.onrender.com/api/meeting/${roomIdFromURL}`,
        {
          name: `Breakout-${Date.now()}`,
        }
      );
      console.log("breakout", response.data);
      setBreakoutRooms([...breakoutRooms, response.data]);
    } catch (error) {
      console.error("Error creating breakout room:", error);
    }
  };

  const getRoleFromQuery = () => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return params.get("role") || "Participant"; // Default to "Participant" if no role is found
    }
    return "Participant";
  };
  function joinBreakoutRoom(breakoutRoomId) {
    console.log("Joining breakout room:", breakoutRoomId);
    localStorage.setItem("BreakoutRoomID", JSON.stringify(breakoutRoomId));
    window.location.reload();
    setBreakRoomID(breakoutRoomId);
    setShowWebRTC(true);
    // Emit an event to notify the server about joining a breakout room
    socket.emit("BE-join-breakout-room", {
      roomId: breakoutRoomId,
      userName: fullName,
    });
  }

  return (
    <div>
      <h1>Welcome, {fullName}</h1>
      <BreakoutControls>
        {role == "Moderator" && (
          <Button onClick={createBreakoutRoom}>Create Breakout Room</Button>
        )}
        {breakoutRooms.map((breakoutRoomId) => (
          <Button
            key={breakoutRoomId.name}
            onClick={() => joinBreakoutRoom(breakoutRoomId.name)}
          >
            Join Breakout Room {breakoutRoomId.name}
          </Button>
        ))}
      </BreakoutControls>

      <div
        style={{ width: "100%", paddingBottom: "56.25%", position: "relative" }}
      >
        <Main initialBreakRoomID={breakRoomID} />
      </div>
    </div>
  );
};

const BreakoutControls = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 20px;
`;

const Button = styled.button`
  height: 40px;
  margin: 5px;
  outline: none;
  border: none;
  border-radius: 15px;
  color: #d8e9ef;
  background-color: #ff6600;
  font-size: 16px;
  font-weight: 500;
  padding: 10px 20px;

  &:hover {
    background-color: #ff6600;
    cursor: pointer;
  }
`;

export default OngoingMeeting;
