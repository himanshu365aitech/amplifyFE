import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import socket from "../../socket";
import Room from "../Room/Room";

const Main = () => {
  const [err, setErr] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [roomName, setRoomName] = useState(null);
  const [showRoom, setShowRoom] = useState(false);
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    // Parse fullName from URL
    const urlParams = new URLSearchParams(window.location.search);
    const fullNameFromUrl = urlParams.get("fullName");
    setFullName(fullNameFromUrl || "");

    socket.on("FE-error-user-exist", ({ error }) => {
      if (!error) {
        setRoomName("Testing Room");
        setShowRoom(true);
      } else {
        setErr(error);
        setErrMsg("User name already exists");
      }
    });
  }, []);

  function clickJoin() {
    const userName = fullName;
    console.log("roomName: ", roomName);
    socket.emit("BE-check-user", { roomId: roomName, userName });
    console.log("BE-check-user: ", { roomId: roomName, userName });
    setRoomName("Testing Room");
    setShowRoom(true);
  }

  return (
    <>
      {!showRoom ? (
        <MainContainer>
          <JoinButton onClick={clickJoin}>Join</JoinButton>
          {err ? <Error>{errMsg}</Error> : null}
        </MainContainer>
      ) : (
        <Room roomId={roomName} />
      )}
    </>
  );
};

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Error = styled.div`
  margin-top: 10px;
  font-size: 20px;
  color: #e85a71;
`;

const JoinButton = styled.button`
  height: 40px;
  margin-top: 35px;
  outline: none;
  border: none;
  border-radius: 15px;
  color: #d8e9ef;
  background-color: #4ea1d3;
  font-size: 25px;
  font-weight: 500;

  :hover {
    background-color: #7bb1d1;
    cursor: pointer;
  }
`;

export default Main;