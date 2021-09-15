import Head from "next/head";
import Layout, { siteTitle } from "../../components/Layout";
import { useSession, getSession } from "next-auth/client";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import socket from "../../components/socket";
import mainStyles from "../../styles/main.module.css";
import ReactTooltip from "react-tooltip";
import SocketConnectionSnack from "../../components/SocketConnectionSnack";
import { useSelector, useDispatch } from "react-redux";
import {
  successConnect,
  failConnect,
} from "../../features/socketConnection/socketConnectionSlice";
import {
  setHandCard,
  initHandCard,
  removeHandCard,
} from "../../features/handCard/handCardSlice";
import {
  setHandCardLength,
  changeHandCardLength,
  initHandCardLength,
} from "../../features/handCard/handCardLengthSlice";
import {
  changeCardLength,
  initCardLength,
} from "../../features/card/cardLengthSlice";
import { setOrder, initOrder } from "../../features/order/orderSlice";
import {
  findEnemyEmail,
  initEnemyEmail,
} from "../../features/enemyEmail/enemyEmailSlice";
import Badge from "@material-ui/core/Badge";
import {
  setBoardAction,
  initBoardAction,
  changeBoardAction,
} from "../../features/boardAction/boardActionSlice";
import {
  setDeadCard,
  initDeadCard,
} from "../../features/deadCard/deadCardSlice";
import { setBlood, initBlood } from "../../features/blood/bloodSlice";
import { setRound, initRound } from "../../features/round/roundSlice";
import { BackCard } from "../../components/card/BackCard";
import { FrontCard } from "../../components/card/FrontCard";
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
  const deadCard = useSelector((state) => state.deadCard.value);
  const blood = useSelector((state) => state.blood.value);
  const boardAction = useSelector((state) => state.boardAction.value);
  const round = useSelector((state) => state.round.value);
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
        socket.off("disconnect");
        socket.off("connect_error");
        socket.off("responseRoomInfo");
        initRedux();
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
          dispatch(setHandCardLength(message.handCardLength));
          dispatch(setOrder(message.order));
          dispatch(findEnemyEmail(message.order, session.user.email));
          dispatch(setBlood(message.blood));
          dispatch(setDeadCard(message.deadCard));
          dispatch(setBoardAction(message.boardAction));
          dispatch(setRound(message.round));
          ReactTooltip.rebuild();
        }
      });

      socket.on("responsePutCardToStay", ({ action }) => {
        for (const row of action) {
          if (row[0] === "handCardLength" && row[1] === "change") {
            //["handCardLength", "change", socket.email, -1],
            dispatch(changeHandCardLength({ key: row[2], value: row[3] }));
          }
          if (row[0] === "handCard" && row[1] === "remove") {
            //["handCard", "remove", addCard]
            dispatch(removeHandCard(row[2]));
          }
          if (row[0] === "groundCard" && row[1] === "add") {
            //["groundCard", "add", socket.email, addCard],
            //dispatch(addGroundCard({ key: row[2], value: row[3] }));
          }
          if (row[0] === "boardAction" && row[1] === "change") {
            //["boardAction", "change", "summon", -1],
            dispatch(changeBoardAction({ key: row[2], value: row[3] }));
          }
        }
      });
    }
    return () => {
      if (socket.connected) {
        socket.off("disconnect");
        socket.off("connect_error");
        socket.off("responseRoomInfo");
        initRedux();
      }
    };
  }, []); //empty array means render once when init page
  const initRedux = () => {
    dispatch(initHandCard([]));
    dispatch(initCardLength([]));
    dispatch(initHandCardLength([]));
    dispatch(initOrder([]));
    dispatch(initEnemyEmail(""));
    dispatch(initBlood([]));
    dispatch(initDeadCard([]));
    dispatch(initBoardAction({}));
    dispatch(initRound(0));
  };
  const pickNewCard = () => {
    socket.emit("askPickNewCard", room);
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
          <div className={["height9rem", "displayFlex2"].join(" ")}>
            <div
              className={[
                "padding05rem",
                "border1px",
                "borderColorBlack",
                "borderRadius05rem",
                "backgroundWhite",
              ].join(" ")}
            >
              {order.indexOf(enemyEmail) === 0 ? "先手" : "後手"}
            </div>
          </div>
          <div className={["height9rem"].join(" ")}></div>
          <div
            className={[
              "height18rem",
              "displayFlex2",
              "flexDirectionColumn",
            ].join(" ")}
          >
            <div
              className={[
                "borderCircle",
                "backgroundWhite",
                "width5rem",
                "height5rem",
                "displayFlex2",
                "border1px",
                "borderColorBlack",
                "fontSize3rem",
              ].join(" ")}
            >
              {round?.[session.user.email] > round?.[enemyEmail]
                ? round?.[session.user.email]
                : round?.[enemyEmail]}
            </div>
            <div
              className={[
                "padding05rem",
                "border1px",
                "borderRadius05rem",
                "backgroundWhite",
                "borderColorBlack",
                "displayFlex2",
              ].join(" ")}
            >
              <div
                className={["displayFlex2", "flexDirectionColumn"].join(" ")}
              >
                <div className={"padding025rem"}>getCard:</div>
                <div className={"padding025rem"}>summon:</div>
                <div className={"padding025rem"}>response:</div>
              </div>
              <div
                className={["displayFlex2", "flexDirectionColumn"].join(" ")}
              >
                <div className={"padding025rem"}>{boardAction?.getCard}/2</div>
                <div className={"padding025rem"}>{boardAction?.summon}/2</div>
                <div className={"padding025rem"}>{boardAction?.response}/1</div>
              </div>
            </div>
          </div>
          <div className={["height9rem"].join(" ")}></div>
          <div className={["height9rem", "displayFlex2"].join(" ")}>
            <div
              className={[
                "padding05rem",
                "border1px",
                "borderColorBlack",
                "borderRadius05rem",
                "backgroundWhite",
              ].join(" ")}
            >
              {order.indexOf(session.user.email) === 0 ? "先手" : "後手"}
            </div>
          </div>
        </div>

        <div className={["flex3", "overflowXAuto"].join(" ")}>
          <div
            className={["height9rem", "displayFlex", "overflowXAuto"].join(" ")}
          >
            <div
              className={[
                "height8rem",
                "border1px",
                "displayFlex2",
                "flexDirectionColumn",
                "borderRadiusBloodEnemy",
                "backgroundWhite",
                "border1px",
                "borderColorBlack",
                "padding05rem",
              ].join(" ")}
            >
              <div>{enemyEmail}</div>
              <div
                className={[
                  "padding05rem",
                  "height5rem",
                  "width5rem",
                  "displayFlex2",
                  "fontSize3rem",
                ].join(" ")}
              >
                {blood[enemyEmail]}
              </div>
            </div>
          </div>
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
                className={["margin025rem", "borderRadius05rem"].join(" ")}
                key={index}
              >
                <BackCard className={["cardBoxShadow"].join(" ")} />
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
            {handCard.map(
              (
                {
                  cardId = 0,
                  name = "",
                  lv = 1,
                  effectDescription = "",
                  fusion = [],
                },
                index
              ) => (
                <FrontCard
                  key={cardId}
                  className={["cardBoxShadow"].join(" ")}
                  name={name}
                  lv={lv}
                  effectDescription={effectDescription}
                  fusion={fusion}
                  room={room}
                  cardId={cardId}
                />
              )
            )}
          </div>
          <div
            className={["height9rem", "displayFlex", "overflowXAuto"].join(" ")}
          >
            <div
              className={[
                "height8rem",
                "border1px",
                "displayFlex2",
                "flexDirectionColumn",
                "borderRadiusBloodSelf",
                "backgroundWhite",
                "border1px",
                "borderColorBlack",
                "padding05rem",
              ].join(" ")}
            >
              <div
                className={[
                  "padding05rem",
                  "height5rem",
                  "width5rem",
                  "displayFlex2",
                  "fontSize3rem",
                ].join(" ")}
              >
                {blood[session.user.email]}
              </div>
              <div>{session.user.email}</div>
            </div>
          </div>
        </div>

        <div className={["flex1"].join(" ")}>
          <div className={["height9rem"].join(" ")}></div>
          <div className={["height9rem", "displayFlex2"].join(" ")}>
            {enemyEmail !== "" && cardLength?.[enemyEmail] !== 0 ? (
              <Badge color="default" badgeContent={cardLength[enemyEmail]}>
                <div
                  className={[
                    "margin025rem",
                    "positionRelative",
                    "borderRadius05rem",
                  ].join(" ")}
                >
                  {cardLength[enemyEmail] > 0 && <BackCard />}
                  {cardLength[enemyEmail] > 1 && (
                    <BackCard className={["multiCard1"].join(" ")} />
                  )}
                  {cardLength[enemyEmail] > 2 && (
                    <BackCard className={["multiCard2"].join(" ")} />
                  )}
                </div>
              </Badge>
            ) : null}
          </div>
          <div className={["height9rem", "displayFlex2"].join(" ")}></div>
          <div className={["height9rem", "displayFlex2"].join(" ")}></div>
          <div className={["height9rem", "displayFlex2"].join(" ")}>
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
                  {cardLength[session.user.email] > 0 && <BackCard />}
                  {cardLength[session.user.email] > 1 && (
                    <BackCard className={["multiCard1"].join(" ")} />
                  )}
                  {cardLength[session.user.email] > 2 && (
                    <BackCard className={["multiCard2"].join(" ")} />
                  )}
                </div>
              </Badge>
            ) : null}
          </div>
          <div className={["height9rem", "displayFlex2"].join(" ")}></div>
        </div>
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
