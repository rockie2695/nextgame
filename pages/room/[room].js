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
    }
  }, [router]);
  useEffect(() => {
    const beforeunload = (e) => {
      if (room !== "") {
        socket.emit("leaveRoom", room, session.user.email);
      }
    };
    window.addEventListener("beforeunload", beforeunload);
    return () => {
      window.removeEventListener("beforeunload", beforeunload);
    };
  }, []);
  useEffect(() => {
    return () => {
      socket.emit("leaveRoom", room, session.user.email);
      socket.close();
    };
  }, []); //empty array means render once when init page
  return (
    <Layout>
      <Head>
        <title>Room {room}</title>
      </Head>
      <header>
        <span className={mainStyles.mainHeader}>Room {room}</span>
      </header>
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
