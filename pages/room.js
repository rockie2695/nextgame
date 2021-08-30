import Head from "next/head";
import Layout, { siteTitle } from "../components/Layout";
import { useSession, getSession } from "next-auth/client";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import socket from "../components/socket";
import mainStyles from "../styles/main.module.css";
import {
  MdRoom as RoomIcon,
  MdKeyboardArrowRight as RightIcon,
  MdKeyboardArrowLeft as LeftIcon,
} from "react-icons/md";
import ReactTooltip from "react-tooltip";
import { useSelector, useDispatch } from "react-redux";
import {
  successConnect,
  failConnect,
} from "../features/socketConnection/socketConnectionSlice";
import { changeAddRoomValue } from "../features/addRoomValue/addRoomValueSlice";
import SocketConnectionSnack from "../components/SocketConnectionSnack";
const mobile = require("is-mobile");

export default function room() {
  const [session, loading] = useSession();
  const [roomList, setRoomList] = useState([]);
  const [roomAddInputValue, setRoomAddInputValue] = useState("");
  const [isSelfRoomTab, setIsSelfRoomTab] = useState(false);
  const [isGoToRoom, setIsGoToRoom] = useState(false);
  const addRoomValue = useSelector((state) => state.addRoomValue.value);
  const addRoomValueRef = useRef(addRoomValue);
  addRoomValueRef.current = addRoomValue;
  const isGoToRoomRef = useRef(isGoToRoom);
  isGoToRoomRef.current = isGoToRoom;
  const router = useRouter();
  const dispatch = useDispatch();

  if (typeof window !== "undefined" && loading) return null;
  useEffect(() => {
    if (router) {
      if (!session) {
        router.push({
          pathname: "/",
          query: { error: "pleaseLogin" },
        });
      }
    }
  }, [router]);

  useEffect(() => {
    window.addEventListener("beforeunload", leaveThisPage);
    return () => {
      window.removeEventListener("beforeunload", leaveThisPage);
    };
  }, []);
  useEffect(() => {
    socket.on("removeRoom", (room) => {
      if (addRoomValue === room) {
        dispatch(changeAddRoomValue(""));
      }
      setRoomList((prev) => prev.filter((row) => row.roomName !== room));
    });
    return () => {
      socket.off("removeRoom");
    };
  }, [addRoomValue]);
  useEffect(() => {
    //error handling
    socket.on("connect", () => {
      dispatch(successConnect());
    });
    socket.on("disconnect", () => {
      dispatch(failConnect());
    });
    socket.on("connect_error", (err) => {
      if (err.message === "invalid email") {
        alert(err.message);
      }
      if (err.message === "xhr poll error") {
        dispatch(failConnect());
      }
    });

    socket.on("addRoom", (message) => {
      if (message.success) {
        dispatch(changeAddRoomValue(message.roomName));
      }
      if (!message.success) {
        alert(message.reason);
      }
    });

    socket.on("roomList", (roomList) => {
      if (Array.isArray(roomList) && roomList.length === 0) {
        return;
      }
      if (Array.isArray(roomList)) {
        roomList = roomList.map((row) => row[1]);
        setRoomList(roomList);
      }
      if (!Array.isArray(roomList)) {
        setRoomList((prev) => [...prev, roomList]);
      }
    });

    socket.on("goToRoom", (room) => {
      socket.emit("leaveRoom", "roomList");
      setIsGoToRoom(true);
      router.push({ pathname: "/room/[room]", query: { room: room } });
    });
    socket.auth = { email: session.user.email };
    socket.connect();
    socket.emit("joinRoom", "roomList");
    return () => {
      leaveThisPage();
    };
  }, []); //empty array means render once when init page

  const leaveThisPage = () => {
    if (addRoomValueRef.current !== "" && isGoToRoomRef.current === false) {
      socket.emit("leaveRoom", addRoomValueRef.current);
    }
    dispatch(changeAddRoomValue(""));
    socket.emit("leaveRoom", "roomList");
    socket.off("connect");
    socket.off("disconnect");
    socket.off("connect_error");
    socket.off("roomList");
    socket.off("addRoom");
    socket.off("goToRoom");
    if (isGoToRoomRef.current === false) {
      dispatch(failConnect());
      socket.close();
    }
  };

  const roomAddButtonClick = () => {
    if (roomAddInputValue.length < 3 || roomAddInputValue.length > 15) {
      alert("roomName should be 3 to 15 characters");
      return;
    }
    let card = [];
    for (let i = 1; i <= 10; i++) {
      card = [...card, i, i, i];
    }
    socket.emit("addRoom", {
      roomName: roomAddInputValue,
      creator: session.user.email,
      order: [session.user.email],
      card: { [session.user.email]: card },
      state: "waiting",
      globalCardId: 1,
    });
    setRoomAddInputValue("");
  };

  return (
    <Layout>
      <Head>
        <title>Room</title>
      </Head>
      <header>
        <span className={mainStyles.mainHeader}>Room</span>
      </header>
      <style jsx>{`
        div.roomListContainer {
          padding: 0.5rem;
          margin: 0.5rem;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          display: flex;
        }
        div.roomAddContainer {
          padding: 0.5rem 0px 0.5rem 0px;
          width: 100%;
        }
        div.roomAddContainerSub {
          display: flex;
         
        }
        input.roomAddInput {
          padding: 0.5rem 1rem;
          flex-grow: 1;
          border-radius: 2em 0px 0px 2em;
          font-size: 18px;
          font-weight: bold;
          border: 1px solid var(--color-gray-300);
        }
        button.roomAddButton {
          background: var(--color-gray-300);
          border-radius: 0px 2em 2em 0px;
          padding: 0.5rem;
          transition: background 0.2s ease-in-out, color 0.2s ease-in-out;
        }
        button.roomAddButton:hover {
          background: black;
          color: white;
        }
        div.tabContainer {
          display: flex;
          width: 100%;
          margin-bottom: 0.5rem;
        }
        div.tab {
          user-select: none;
          flex: 1;
          text-align: center;
          background: white;
          border: 1px solid var(--color-gray-300);
          padding: 0.5rem;
          cursor: pointer;
          transition: background 0.2s ease-in-out, border 0.2s ease-in-out;
        }
        div.tab:hover {
          background: var(--color-gray-300);
        }
        div.tabActive {
          border-bottom: 2px solid var(--color-blue-500);
        }
      `}</style>
      <SocketConnectionSnack />
      <div className={"roomListContainer"}>
        {/*playingList start*/}
        <>
          <RoomList
            roomList={roomList.filter(
              (row) =>
                row.state === "playing" &&
                row.order.includes(session.user.email)
            )}
            state={"playing"}
          />
        </>
        {/*playingList end*/}
        {/*tab start*/}
        <div className={"tabContainer"}>
          <div
            className={[
              "tab",
              "borderRightNone",
              addRoomValue !== "" ? "cursorNotAllow" : "",
              !isSelfRoomTab ? "tabActive" : "",
            ].join(" ")}
            onClick={() => {
              if (addRoomValue === "") {
                setIsSelfRoomTab(false);
              }
            }}
          >
            Public Room
          </div>
          <div
            className={[
              "tab",
              "borderLeftNone",
              isSelfRoomTab ? "tabActive" : "",
            ].join(" ")}
            onClick={() => setIsSelfRoomTab(true)}
          >
            Self Room
          </div>
        </div>
        {/*tab end*/}
        {/*room Add input start*/}
        {isSelfRoomTab && addRoomValue === "" && (
          <div className={"roomAddContainer"}>
            <div
              className={"roomAddContainerSub"}
              data-tip="Room Name should be 3 to 15 characters"
            >
              <ReactTooltip
                place="bottom"
                type="dark"
                effect="solid"
                disable={mobile()}
              />
              <input
                className={"roomAddInput"}
                placeholder="Room Name"
                minLength="3"
                maxLength="15"
                value={roomAddInputValue}
                onChange={(e) => {
                  setRoomAddInputValue(e.target.value);
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    roomAddButtonClick();
                  }
                }}
                aria-label="Room Name Input"
              ></input>
              <button
                className={[
                  "roomAddButton",
                  roomAddInputValue.length >= 3 ? "" : "cursorNotAllow",
                ].join(" ")}
                onClick={roomAddButtonClick}
                aria-label="Add Room"
              >
                Add Room
              </button>
            </div>
          </div>
        )}
        {/*room Add input end*/}
        {/*self room roomList start*/}
        {isSelfRoomTab ? (
          <RoomList
            roomList={roomList.filter(
              (row) =>
                row.creator === session.user.email && row.state === "waiting"
            )}
            state={"waiting"}
          />
        ) : null}
        {/*self room roomList end*/}
        {/*public room roomList start*/}
        {!isSelfRoomTab ? (
          <>
            <RoomList
              roomList={roomList.filter((row) => row.state === "waiting")}
              state={"waiting"}
            />
          </>
        ) : null}
        {/*public room roomList end*/}
      </div>
    </Layout>
  );
}

export function RoomList({ roomList = [], state = "waiting" }) {
  const [session, loading] = useSession();
  const addRoomValue = useSelector((state) => state.addRoomValue.value);
  if (typeof window !== "undefined" && loading) return null;
  const removeRoomButtonClick = () => {
    if (addRoomValue !== "") {
      socket.emit("leaveRoom", addRoomValue);
    }
  };
  const joinRoomButtonClick = (roomName) => {
    let card = [];

    for (let i = 1; i <= 10; i++) {
      card = [...card, i, i, i];
    }
    socket.emit("joinRoom", roomName, { [session.user.email]: card });
  };
  const continuesButtonClick = (roomName) => {
    socket.emit("joinRoom", roomName);
  };
  return (
    <>
      <style jsx>
        {`
          div.roomList {
            min-height: 4rem;
            display: flex;
            background: white;
            border-radius: 40px;
            border: 1px solid var(--color-gray-300);
            margin: 0.5rem;
            padding: 0.25rem 1rem;
            align-items: center;
            transition: transform 0.2s ease-in-out;
            width: 100%;
            flex-wrap: wrap;
          }
          div.roomList:hover {
            transform: scale(1.025);
            box-shadow: 0px 0px 5px var(--color-gray-600);
          }
          div.roomName {
            font-size: 18px;
            font-weight: bold;
          }
          div.creator {
            color: var(--color-gray-600);
          }
          button.joinRoomButton {
            background: var(--color-gray-300);
            border-radius: 20px;
            color: black;
            padding: 0.5rem;
            display: flex;
            flex-direction: row;
            transition: background 0.2s ease-in-out, color 0.2s ease-in-out;
          }
          button.joinRoomButton:hover {
            background: black;
            color: white;
          }
          div.roomNameCreator {
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            overflow: auto;
          }
        `}
      </style>
      {roomList.length !== 0 && state === "playing" ? (
        <span>Playing</span>
      ) : null}
      {roomList.map(({ roomName, creator, order }, index) => (
        <div className={"roomList"} key={index}>
          <div>
            <RoomIcon
              style={{
                fontSize: "2rem",
                color: "rgba(0,0,0,0.75)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            />
          </div>
          <div className={"roomNameCreator"}>
            <div className={"roomName"}>{roomName}</div>
            <div className={"creator"}>{creator}</div>
          </div>
          <div>
            {creator === session.user.email && state === "waiting" ? (
              <button
                className={"joinRoomButton"}
                onClick={removeRoomButtonClick}
                aria-label="Remove Room"
              >
                <LeftIcon
                  style={{
                    fontSize: "1rem",
                  }}
                />
                Remove Room
              </button>
            ) : null}
            {creator !== session.user.email && state === "waiting" ? (
              <button
                className={"joinRoomButton"}
                onClick={() => joinRoomButtonClick(roomName)}
                aria-label="Join Room"
              >
                <RightIcon
                  style={{
                    fontSize: "1rem",
                  }}
                />
                Join Room
              </button>
            ) : null}
            {order.includes(session.user.email) && state === "playing" ? (
              <button
                className={"joinRoomButton"}
                onClick={() => continuesButtonClick(roomName)}
                aria-label="continues"
              >
                <RightIcon
                  style={{
                    fontSize: "1rem",
                  }}
                />
                Continues
              </button>
            ) : null}
          </div>
        </div>
      ))}
      {roomList.length === 0 && state === "waiting" ? "No result" : null}
    </>
  );
}

export async function getServerSideProps(context) {
  //await dbConnect
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/?error=pleaseLogin",
        permanent: false,
      },
    };
  }
  return { props: { session } };
}
