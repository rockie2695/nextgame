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
} from "react-icons/md";
export default function room() {
  const [session, loading] = useSession();
  const [roomList, setRoomList] = useState([]);
  const router = useRouter();
  //const [ws, setWs] = useState(null);
  if (typeof window !== "undefined" && loading) return null;
  //const wsRef = useRef(ws);
  //wsRef.current = ws;
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
    socket.on("roomList", (roomList) => {
      console.log(roomList);
      if (Array.isArray(roomList) && roomList.length === 0) {
        return;
      }
      if (Array.isArray(roomList)) {
        setRoomList(roomList);
        console.log("here");
      }
      if (!Array.isArray(roomList)) {
        setRoomList((prev) => [...prev, roomList]);
      }
    });
    return () => {
      socket.off("roomList");
    };
  });
  useEffect(() => {
    socket.connect();
    socket.emit("joinRoom", "roomList");
    return () => {
      socket.close();
    };
  }, []); //empty array means render once when init page

  const testAddRoom = () => {
    socket.emit("addRoom", {
      roomName: "testAddRoom",
      creator: session.user.email,
      order: [session.user.email],
    });
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
        }
        div.roomList {
          height: 4rem;
          display: flex;
          background: white;
          border-radius: 40px;
          border: 1px solid var(--color-gray-300);
          margin: 10px;
          padding: 20px;
          align-items: center;
          transition: transform 0.2s ease-in-out;
        }
        div.roomList:hover {
          border: 5px solid var(--color-gray-500);
          transform: scale(1.025);
        }
        div.roomNameCreator {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
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
      `}</style>
      <div>
        <button onClick={testAddRoom}>test add Room</button>
      </div>
      <div className={"roomListContainer"}>
        {roomList.map(({ roomName, creator }, index) => (
          <div className={"roomList"} key={index}>
            <div>
              <RoomIcon
                style={{
                  fontSize: "2rem",
                  color: "rgba(0,0,0,0.75)",
                }}
              />
            </div>
            <div className={"roomNameCreator"}>
              <div className={"roomName"}>{roomName}</div>
              <div className={"creator"}>{creator}</div>
            </div>
            <div>
              <button className={"joinRoomButton"}>
                {" "}
                <RightIcon
                  style={{
                    fontSize: "1rem",
                    color: "rgba(0,0,0,0.75)",
                  }}
                />
                Join Room
              </button>
            </div>
          </div>
        ))}
      </div>
    </Layout>
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
