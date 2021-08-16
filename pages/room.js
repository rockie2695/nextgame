import Head from "next/head";
import Layout, { siteTitle } from "../components/Layout";
import { useSession, getSession } from "next-auth/client";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import socket from "../components/socket";
import { isNull } from "lodash";
import mainStyles from "../styles/main.module.css";
import {
  MdRoom as RoomIcon,
  MdKeyboardArrowRight as RightIcon,
  MdKeyboardArrowLeft as LeftIcon,
} from "react-icons/md";
export default function room() {
  const [session, loading] = useSession();
  const [roomList, setRoomList] = useState([]);
  const [roomAddInputValue, setRoomAddInputValue] = useState("");
  const [isAddRoom, setIsAddRoom] = useState(false);
  const [isSelfRoomTab, setIsSelfRoomTab] = useState(false);
  const [addRoomValue, setAddRoomValue] = useState("");
  const router = useRouter();
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
    socket.on("addRoom", (message) => {
      console.log(message);
      if (message.success) {
        setIsAddRoom(true);
        setAddRoomValue(message.roomName);
      }
      if (!message.success) {
        alert(message.reason);
      }
    });

    socket.on("roomList", (roomList) => {
      console.log(roomList);
      if (Array.isArray(roomList) && roomList.length === 0) {
        return;
      }
      if (Array.isArray(roomList)) {
        setRoomList(roomList);
      }
      if (!Array.isArray(roomList)) {
        setRoomList((prev) => [...prev, roomList]);
      }
    });

    socket.connect();
    socket.emit("joinRoom", "roomList");
    return () => {
      alert("123");
      console.log("123");
      if (addRoomValue !== "") {
        socket.emit("leaveRoom", addRoomValue);
      }
      socket.off("roomList");
      socket.off("addRoom");
      socket.close();
    };
  }, []); //empty array means render once when init page
  const roomAddButtonClick = () => {
    if (roomAddInputValue.length < 3 || roomAddInputValue.length > 15) {
      alert("roomName should be 3 to 15 characters");
      return;
    }

    socket.emit("addRoom", {
      roomName: roomAddInputValue,
      creator: session.user.email,
      order: [session.user.email],
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
          padding: 10px;
          margin: 10px;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          display: flex;
        }
        div.roomAddContainer {
          padding: 10px 0px;
          display: flex;
          width: 100%;
        }
        input.roomAddInput {
          padding: 10px 20px;
          flex-grow: 1;
          border-radius: 20px 0px 0px 20px;
          font-size: 18px;
          font-weight: bold;
          border: 1px solid var(--color-gray-300);
        }
        button.roomAddButton {
          background: var(--color-gray-300);
          border-radius: 0px 20px 20px 0px;
          padding: 10px;
        }
        div.tabContainer {
          display: flex;
          width: 100%;
          margin-bottom: 10px;
        }
        div.tab {
          flex-grow: 1;
          text-align: center;
          background: white;
          border: 1px solid var(--color-gray-300);
          padding: 10px;
          cursor: pointer;
        }
        div.tabActive {
          border-bottom: 2px solid var(--color-blue-500);
        }
      `}</style>
      <div className={"roomListContainer"}>
        <div className={"tabContainer"}>
          <div
            className={[
              "tab",
              isAddRoom ? "cursorNotAllow" : "",
              !isSelfRoomTab ? "tabActive" : "",
            ].join(" ")}
            onClick={() => {
              if (!isAddRoom) {
                setIsSelfRoomTab(false);
              }
            }}
          >
            Public Room
          </div>
          <div
            className={["tab", isSelfRoomTab ? "tabActive" : ""].join(" ")}
            onClick={() => setIsSelfRoomTab(true)}
          >
            Self Room
          </div>
        </div>
        {isSelfRoomTab && !isAddRoom && (
          <div className={"roomAddContainer"}>
            <input
              className={"roomAddInput"}
              placeholder="roomName"
              minLength="3"
              maxLength="15"
              value={roomAddInputValue}
              onChange={(e) => {
                setRoomAddInputValue(e.target.value);
              }}
            ></input>
            <button className={"roomAddButton"} onClick={roomAddButtonClick}>
              Add Room
            </button>
          </div>
        )}
        {isSelfRoomTab ? (
          <RoomList
            roomList={roomList.filter(
              (row) => row.creator === session.user.email
            )}
          />
        ) : null}
        {!isSelfRoomTab ? <RoomList roomList={roomList} /> : null}
      </div>
    </Layout>
  );
}

export function RoomList({ roomList }) {
  const [session, loading] = useSession();
  if (typeof window !== "undefined" && loading) return null;
  return roomList.map(({ roomName, creator }, index) => (
    <div className={"roomList"} key={index}>
      <style jsx>
        {`
          div.roomList {
            min-height: 4rem;
            display: flex;
            background: white;
            border-radius: 40px;
            border: 1px solid var(--color-gray-300);
            margin: 10px;
            padding: 6px 20px;
            align-items: center;
            transition: transform 0.2s ease-in-out;
            width: 100%;
            flex-wrap: wrap;
          }
          div.roomList:hover {
            border: 5px solid var(--color-gray-500);
            transform: scale(1.025);
          }
          div.roomName {
            font-size: 18px;
            font-weight: bold;
          }
          button.joinRoomButton {
            background: var(--color-gray-300);
            border-radius: 20px;
            color: black;
            padding: 10px;
            display: flex;
            flex-direction: row;
          }
          div.roomNameCreator {
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            overflow: auto;
          }
        `}
      </style>
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
        {creator === session.user.email ? (
          <button className={"joinRoomButton"}>
            <LeftIcon
              style={{
                fontSize: "1rem",
                color: "rgba(0,0,0,0.75)",
              }}
            />
            Remove Room
          </button>
        ) : null}
        {creator !== session.user.email ? (
          <button className={"joinRoomButton"}>
            <RightIcon
              style={{
                fontSize: "1rem",
                color: "rgba(0,0,0,0.75)",
              }}
            />
            Join Room
          </button>
        ) : null}
      </div>
    </div>
  ));
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
