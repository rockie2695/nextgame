import Head from "next/head";
import Layout, { siteTitle } from "../../components/Layout";
import { useSession, getSession } from "next-auth/client";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import socket from "../../components/socket";
import mainStyles from "../../styles/main.module.css";
import { MdRoom as RoomIcon } from "react-icons/md";
import ReactTooltip from "react-tooltip";

export default function room() {
  const [session, loading] = useSession();
  if (typeof window !== "undefined" && loading) return null;
  const router = useRouter();
  const { room } = router.query;
  useEffect(() => {
    if (router) {
      if (!session) {
        router.push({
          pathname: "/",
          query: { error: "pleaseLogin" },
        });
      }
      if (!socket.connected) {
        router.push({
          pathname: "/room",
        });
      }
    }
  }, [router]);
  useEffect(() => {
    const beforeunload = (e) => {
      if (socket.connected) {
        socket.emit("leaveRoom", room);
      }
    };
    window.addEventListener("beforeunload", beforeunload);
    return () => {
      window.removeEventListener("beforeunload", beforeunload);
    };
  }, []);
  useEffect(() => {
    if (socket.connected) {
      socket.emit("askRoomInfo", room);

      socket.on("requestRoomInfo", (message) => {
        if (!message.order.includes(session.user.email)) {
          router.push({
            pathname: "/room",
          });
        }
      });
    }
    return () => {
      if (socket.connected) {
        socket.off("askRoomInfo");
        socket.off("requestRoomInfo");
      }
    };
  }, []); //empty array means render once when init page
  return (
    <Layout>
      <Head>
        <title>Room {room}</title>
      </Head>
      <header>
        <span className={mainStyles.mainHeader}>Room / {room}</span>
      </header>
      <div className={"board"}>
        <div className={"flex1"}></div>
        <div className={"flex3"}>
          <div className={"height5rem"}></div>
          <div className={"height5rem"}></div>
          <div className={"height5rem"}></div>
          <div className={"height5rem"}></div>
          <div className={"height5rem"}></div>
          <div className={"height5rem"}></div>
        </div>
        <div className={"flex1"}></div>
      </div>
      <style jsx>{`
        .board {
          padding: 0.5rem;
          margin: 0.5rem;
        }
        .flex1 {
          flex: 1;
        }
        .flex3 {
          flex-grow: 3;
        }
        .height5rem {
          height: 5rem;
        }
      `}</style>
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
