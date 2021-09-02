import Head from "next/head";
import Layout, { siteTitle } from "../../components/Layout";
import { useSession, getSession } from "next-auth/client";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import socket from "../../components/socket";
import mainStyles from "../../styles/main.module.css";
import { MdRoom as RoomIcon } from "react-icons/md";
import ReactTooltip from "react-tooltip";
import SocketConnectionSnack from "../../components/SocketConnectionSnack";
import { useSelector, useDispatch } from "react-redux";
import {
  successConnect,
  failConnect,
} from "../../features/socketConnection/socketConnectionSlice";
import { setHandCard } from "../../features/handCard/handCardSlice";
import { changeHandCardLength } from "../../features/handCard/handCardLengthSlice";
import { changeCardLength } from "../../features/card/cardLengthSlice";
import { setOrder } from "../../features/order/orderSlice";
import { findEnemyEmail } from "../../features/enemyEmail/enemyEmailSlice";
import Badge from "@material-ui/core/Badge";
const mobile = require("is-mobile");

export default function room() {
  const [session, loading] = useSession();
  if (typeof window !== "undefined" && loading) return null;
  const router = useRouter();
  const { room } = router.query;
  const dispatch = useDispatch();
  const handCard = useSelector((state) => state.handCard.value);
  const handCardLength = useSelector((state) => state.handCardLength.value);
  const cardLength = useSelector((state) => state.cardLength.value);
  const enemyEmail = useSelector((state) => state.enemyEmail.value);
  const order = useSelector((state) => state.order.value);
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

      socket.on("connect", () => {
        dispatch(successConnect());
      });

      socket.on("disconnect", () => {
        dispatch(failConnect());
      });

      socket.on("connect_error", (err) => {
        if (err.message === "xhr poll error") {
          dispatch(failConnect());
        }
      });

      socket.on("responseRoomInfo", (message) => {
        if (!message.order.includes(session.user.email)) {
          router.push({
            pathname: "/room",
          });
        }
        if (message.order.includes(session.user.email)) {
          dispatch(setHandCard(message.handCard[session.user.email]));
          dispatch(changeCardLength(message.cardLength));
          dispatch(changeHandCardLength(message.handCardLength));
          dispatch(setOrder(message.order));
          dispatch(findEnemyEmail(message.order, session.user.email));
          ReactTooltip.rebuild();
        }
      });
    }
    return () => {
      if (socket.connected) {
        socket.off("disconnect");
        socket.off("connect_error");
        socket.off("responseRoomInfo");
      }
    };
  }, []); //empty array means render once when init page
  const pickNewCard = () => {
    socket.emit("askPickNewCard", room);
  };
  const putCardToStay = () => {
    socket.emit("askPutCardToStay", room);
  };
  return (
    <Layout>
      <Head>
        <title>Room {room}</title>
      </Head>
      <header>
        <span className={mainStyles.mainHeader}>Room / {room}</span>
      </header>
      <SocketConnectionSnack />
      <div className={"board"}>
        <ReactTooltip
          place="right"
          type="dark"
          effect="float"
          disable={mobile()}
          html={true}
        />
        <div className={["flex1"].join(" ")}>
          <div className={["height9rem", "displayFlex"].join(" ")}>
            <div
              className={["padding05rem", "border1px", "borderColorBlack"].join(
                " "
              )}
            >
              {order.indexOf(enemyEmail) === 0 ? "先手" : "後手"}
            </div>
          </div>
          <div className={["height9rem"].join(" ")}></div>
          <div className={["height9rem"].join(" ")}></div>
          <div className={["height9rem"].join(" ")}></div>
          <div className={["height9rem"].join(" ")}></div>
          <div className={["height9rem", "displayFlex"].join(" ")}>
            <div
              className={["padding05rem", "border1px", "borderColorBlack"].join(
                " "
              )}
            >
              {order.indexOf(session.user.email) === 0 ? "先手" : "後手"}
            </div>
          </div>
        </div>
        <div className={["flex3", "overflowXAuto"].join(" ")}>
          <div className={["height9rem"].join(" ")}></div>
          <div
            className={[
              "height9rem",
              "displayFlex",
              "overflowXAuto",
              "overflowYHidden",
            ].join(" ")}
          >
            {[
              ...Array(enemyEmail == "" ? 0 : handCardLength?.[enemyEmail]),
            ].map((row, index) => (
              <div
                className={["margin025rem", "borderRadius"].join(" ")}
                key={index}
              >
                <div
                  className={[
                    "height7rem",
                    "width6rem",
                    "border1px",
                    "margin025rem",
                    "padding025rem",
                    "flexShrink0",
                    "backgroundWhite",
                    "borderColorBlack",
                    "maskCard",
                  ].join(" ")}
                ></div>
              </div>
            ))}
          </div>
          <div className={["height9rem"].join(" ")}></div>
          <div className={["height9rem"].join(" ")}></div>
          <div
            className={[
              "height9rem",
              "displayFlex",
              "overflowXAuto",
              "overflowYHidden",
            ].join(" ")}
          >
            {handCard.map(({ cardId, name, lv, effectDescription }, index) => (
              <div
                key={cardId}
                className={[
                  "margin025rem",
                  "borderRadius",
                  "cursorPointer",
                  "hoverBoxShadowOrange",
                  "boxShadowTransition",
                ].join(" ")}
                onClick={putCardToStay}
              >
                <div
                  className={[
                    "height7rem",
                    "width6rem",
                    "border1px",
                    "margin025rem",
                    "padding025rem",
                    "flexShrink0",
                    "backgroundWhite",
                    "borderColorBlack",
                  ].join(" ")}
                  data-tip={effectDescription || ""}
                >
                  <div className={["textAlignCenter"].join(" ")}>{name}</div>
                  <div className={["textAlignCenter"].join(" ")}>lv{lv}</div>
                </div>
              </div>
            ))}
          </div>
          <div className={["height9rem"].join(" ")}></div>
        </div>
        <div className={["flex1"].join(" ")}>
          <div className={["height9rem"].join(" ")}></div>
          <div className={["height9rem", "displayFlex"].join(" ")}>
            {enemyEmail !== "" && cardLength?.[enemyEmail] !== 0 ? (
              <Badge color="default" badgeContent={cardLength[enemyEmail]}>
                <div
                  className={[
                    "margin025rem",
                    "positionRelative",
                    "borderRadius",
                  ].join(" ")}
                >
                  <div
                    className={[
                      "height7rem",
                      "width6rem",
                      "border1px",
                      "margin025rem",
                      "padding025rem",
                      "flexShrink0",
                      "backgroundWhite",
                      "maskCard",
                    ].join(" ")}
                  ></div>
                  <div
                    className={[
                      "height7rem",
                      "width6rem",
                      "border1px",
                      "margin025rem",
                      "padding025rem",
                      "flexShrink0",
                      "backgroundWhite",
                      "multiCard1",
                      "maskCard",
                    ].join(" ")}
                  ></div>
                  <div
                    className={[
                      "height7rem",
                      "width6rem",
                      "border1px",
                      "margin025rem",
                      "padding025rem",
                      "flexShrink0",
                      "backgroundWhite",
                      "multiCard2",
                      "maskCard",
                    ].join(" ")}
                  ></div>
                </div>
              </Badge>
            ) : null}
          </div>
          <div className={["height9rem", "displayFlex"].join(" ")}></div>
          <div className={["height9rem", "displayFlex"].join(" ")}></div>
          <div className={["height9rem", "displayFlex"].join(" ")}>
            {(typeof session?.user?.email === "undefined") !== "undefined" &&
            cardLength?.[session.user.email] !== 0 ? (
              <Badge
                color="default"
                badgeContent={cardLength[session.user.email]}
              >
                <div
                  className={[
                    "margin025rem",
                    "border025rem",
                    "positionRelative",
                    "cursorPointer",
                  ].join(" ")}
                  onClick={pickNewCard}
                >
                  <div
                    className={[
                      "height7rem",
                      "width6rem",
                      "border1px",
                      "margin025rem",
                      "padding025rem",
                      "flexShrink0",
                      "backgroundWhite",
                      "maskCard",
                    ].join(" ")}
                  ></div>
                  <div
                    className={[
                      "height7rem",
                      "width6rem",
                      "border1px",
                      "margin025rem",
                      "padding025rem",
                      "flexShrink0",
                      "backgroundWhite",
                      "multiCard1",
                      "maskCard",
                    ].join(" ")}
                  ></div>
                  <div
                    className={[
                      "height7rem",
                      "width6rem",
                      "border1px",
                      "margin025rem",
                      "padding025rem",
                      "flexShrink0",
                      "backgroundWhite",
                      "multiCard2",
                      "maskCard",
                    ].join(" ")}
                  ></div>
                </div>
              </Badge>
            ) : null}
          </div>
          <div className={["height9rem"].join(" ")}></div>
        </div>
      </div>
      <style jsx>{`
        .board {
          padding: 0.5rem;
          margin: 0.5rem;
          display: flex;
          flex-direction: row;
        }
        .flex1 {
          flex: 1;
        }
        .flex3 {
          flex-grow: 3;
          flex-shrink: 1;
          flex-basis: 0%;
        }
        .flexShrink0 {
          flex-shrink: 0;
        }
        .height9rem {
          height: 9rem;
        }
        .height8rem {
          height: 8rem;
        }
        .height7rem {
          height: 7rem;
        }
        .width6rem {
          width: 6rem;
        }
        .displayFlex {
          display: -webkit-box;
          justify-content: center;
          align-items: center;
        }
        .borderRadius {
          border-radius: 0.5rem;
        }
        .boxShadowTransition {
          transition: box-shadow 0.2s ease-in-out;
        }
        .border1px {
          border: 1px solid transparent;
          border-radius: 0.5rem;
        }
        .margin05rem {
          margin: 0.5rem;
        }
        .margin025rem {
          margin: 0.25rem;
        }
        .padding05rem {
          padding: 0.5rem;
        }
        .padding025rem {
          padding: 0.25rem;
        }
        .textAlignCenter {
          text-align: center;
        }
        .overflowXAuto {
          overflow-x: auto;
        }
        .overflowYHidden {
          overflow-y: hidden;
        }
        .backgroundWhite {
          background: white;
        }
        .borderColorBlack {
          border-color: black;
        }
        .hoverBorderColorOrange:hover {
          border-color: rgba(255, 152, 0, 0.8);
        }
        .hoverBoxShadowOrange:hover {
          box-shadow: 0 0 0.25rem 0.25rem var(--color-orange-500);
        }
        .positionRelative {
          position: relative;
        }
        .multiCard1 {
          position: absolute;
          top: 0.25rem;
          left: 0.25rem;
        }
        .multiCard2 {
          position: absolute;
          top: 0.5rem;
          left: 0.5rem;
        }
        .cursorPointer {
          cursor: pointer;
        }
        .maskCard {
          background-image: repeating-radial-gradient(
            var(--color-brown-500),
            black 20%
          );
          border-color: white;
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
