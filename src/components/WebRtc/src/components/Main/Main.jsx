import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import socket from "../../socket";
import { Room } from "../Room/Room";

const Main = ({ initialBreakRoomID }) => {
  const roomRef = useRef();
  const userRef = useRef();
  const [err, setErr] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [roomId, setRoomId] = useState(null);
  const [showRoom, setShowRoom] = useState(false);
  const [showBreakoutUI, setShowBreakoutUI] = useState(false);
  const [showBreakouttoMain, setShowBreakouttoMain] = useState(false);

  // Function to clear localStorage
  const clearLocalStorage = () => {
    localStorage.clear();
  };

  // Extract fullName from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fullName = params.get("fullName");

    if (fullName && userRef.current) {
      userRef.current.value = decodeURIComponent(fullName); // Decode in case there are encoded spaces or characters
    }
  }, []);

  useEffect(() => {
    const handleError = ({ error }) => {
      if (error) {
        setErr(true);
        setErrMsg("User name already exists");
      } else {
        const userName = userRef.current.value;
        sessionStorage.setItem("user", userName);
      }
    };

    socket.on("FE-error-user-exist", handleError);

    return () => {
      socket.off("FE-error-user-exist", handleError);
    };
  }, []);

  useEffect(() => {
    if (initialBreakRoomID) {
      setRoomId(initialBreakRoomID);
      setShowRoom(true);
    }
  }, [initialBreakRoomID]);

  useEffect(() => {
    if (localStorage.getItem("BreakoutRoomID") == null) {
      const roomIdFromURL = window.location.pathname.split("/")[2]; // This will give "66e151e0cb17166db632fc3f"
      if (roomIdFromURL && roomRef.current) {
        roomRef.current.value = roomIdFromURL; // Set the room ID in the input field
      }
    }
  }, []);

  function clickJoin() {
    const roomName = roomRef.current.value;
    const userName = userRef.current.value;
    const roomIdFromURL = window.location.pathname.split("/")[2]; // This will give "66e151e0cb17166db632fc3f"
    console.log(roomIdFromURL);
    if (!roomName || !userName) {
      setErr(true);
      setErrMsg("Enter Room Name and User Name");
    } else {
      sessionStorage.setItem("user", userName);
      {
        !localStorage.getItem("mainRoomId") &&
          localStorage.setItem("mainRoomId", roomIdFromURL);
      }
      setRoomId(roomIdFromURL);
      setShowRoom(true);
      socket.emit("BE-check-user", { roomId: roomIdFromURL, userName });
    }
  }

  useEffect(() => {
    if (roomRef.current) {
      const params = new URLSearchParams(window.location.search);
      const fullName = params.get("fullName");
      const breakoutRoomID = localStorage.getItem("BreakoutRoomID");
      if (breakoutRoomID) {
        roomRef.current.value = breakoutRoomID;
        userRef.current.value = decodeURIComponent(fullName); // Decode in case there are encoded spaces or characters

        setRoomId(breakoutRoomID);
        setShowBreakoutUI(true);
      }
    }
    if (roomRef.current && localStorage.getItem("BreakoutRoomID") == null) {
      let mainRoomId = localStorage.getItem("mainRoomId");
      if (mainRoomId) {
        roomRef.current.value = mainRoomId;
        setRoomId(mainRoomId);
        setShowBreakouttoMain(true);
      }
    }
  });

  return (
    <MainContainer>
      {!showBreakoutUI ? (
        <>
          {!showRoom ? (
            <>
              <HiddenInputRow>
                <Input ref={roomRef} type="text" />
              </HiddenInputRow>
              <HiddenInputRow>
                <Input ref={userRef} type="text" />
              </HiddenInputRow>
              <JoinButton onClick={clickJoin}>Join</JoinButton>
              {err ? <Error>{errMsg}</Error> : null}
            </>
          ) : (
            <Room roomId={roomId} />
          )}
        </>
      ) : (
        <div>
          {!showRoom ? (
            <>
              <HiddenInputRow>
                <Input ref={roomRef} type="text" readOnly />
              </HiddenInputRow>
              <HiddenInputRow>
                <Input ref={userRef} type="text" />
              </HiddenInputRow>
              <JoinButton onClick={clickJoin}>
                {showBreakouttoMain && localStorage.getItem("BreakoutRoomID") == null
                  ? "Go to Main Room"
                  : "Join BreakOut"}
              </JoinButton>
              {err ? <Error>{errMsg}</Error> : null}
            </>
          ) : (
            <Room roomId={roomId} />
          )}
        </div>
      )}
    </MainContainer>
  );
};

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const HiddenInputRow = styled.div`
  display: none; /* Hide the row containing inputs */
`;

const Input = styled.input`
  width: 150px;
  height: 35px;
  margin-left: 15px;
  padding-left: 10px;
  outline: none;
  border: none;
  border-radius: 5px;
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
  background-color: #ff6600;
  font-size: 25px;
  font-weight: 500;

  &:hover {
    background-color: #ff6600;
    cursor: pointer;
  }
`;

export default Main;
