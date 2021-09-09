import socket from "../../components/socket";
import ReactDOMServer from "react-dom/server";
import Chip from "@material-ui/core/Chip";
export function FrontCard({
  className = "",
  style = {},
  name = "",
  lv = 1,
  effectDescription = "",
  fusion = [],
  room = 0,
  cardId = 0,
}) {
  const putCardToStay = () => {
    socket.emit("askPutCardToStay", room, cardId);
  };
  return (
    <div
      className={[
        "margin025rem",
        "borderRadius05rem",
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
          "borderRadius05rem",
        ]
          .join(" ")
          .concat(" ", className || "")}
        style={{ ...style }}
        data-tip={ReactDOMServer.renderToString(
          <>
            <div>{effectDescription}</div>
            {fusion.length > 0 && (
              <div>
                {fusion.map(({ name = "", lv = 0 }, index) => {
                  return (
                    <div
                      key={index}
                      className={["displayInlineBlock"].join(" ")}
                    >
                      <span>&nbsp;{index > 0 ? "+" : ""}&nbsp;</span>
                      <Chip
                        label={name + " lv" + lv}
                        size="small"
                        color="default"
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
        html={"true"}
      >
        <div className={["textAlignCenter"].join(" ")}>{name}</div>
        <div className={["textAlignCenter"].join(" ")}>lv{lv}</div>
      </div>
    </div>
  );
}
