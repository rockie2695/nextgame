import Head from "next/head";
import Layout, { siteTitle } from "../components/Layout";
import { useSession, getSession } from "next-auth/client";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import webSocket from "socket.io-client";
import { isNull } from "lodash";
import mainStyles from "../styles/main.module.css";
export default function room() {
  const [session, loading] = useSession();
  const router = useRouter();
  const [ws, setWs] = useState(null);
  if (typeof window !== "undefined" && loading) return null;
  const wsRef = useRef(ws);
  wsRef.current = ws;
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
    console.log("startConnectWS");
    connectWebSocket();
    return () => {
      if (!isNull(wsRef.current)) {
        wsRef.current.close();
      }
      setWs(() => null);
    };
  }, []);
  const initWebSocket = () => {
    // Server 通知完後再傳送 disConnection 通知關閉連線
    ws.on("disConnection", () => {
      ws.close();
    });
  };
  const connectWebSocket = () => {
    //開啟
    setWs(webSocket("http://localhost:3001/"));
  };
  useEffect(() => {
    if (ws) {
      initWebSocket();
    }
  }, [ws]);
  return (
    <Layout>
      <Head>
        <title>Room</title>
      </Head>
      <header>
        <span className={mainStyles.mainHeader}>Room</span>
      </header>
      <div></div>
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
