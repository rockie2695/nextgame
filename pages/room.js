import Head from "next/head";
import Layout, { siteTitle } from "../components/Layout";
import { useSession, getSession } from "next-auth/client";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import socket from "../components/socket";
import { isNull } from "lodash";
import mainStyles from "../styles/main.module.css";
export default function room() {
  const [session, loading] = useSession();
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
    socket.connect();
    socket.emit("joinRoom", "roomList");
    return () => {
      console.log("close");
      socket.close();
    };
  }, []);
  useEffect(() => {
    socket.on("roomList", (roomList) => {
      //if(Array.isArray(roomList)){}
      //if(!Array.isArray(roomList)){}
      console.log(roomList);
    });
    return () => {
      console.log("test2");
      socket.off("roomList");
    };
  });
  const testAddRoom = () => {
    socket.emit("addRoom", {
      roomName: "testAddRoom",
      creator: session.user.name || session.user.email,
      order: [session.user.name || session.user.email],
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
      <div>
        <button onClick={testAddRoom}>test add Room</button>
      </div>
    </Layout>
  );
}
export async function getServerSideProps(context) {
  //await dbConnect();
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
