import usePlace from "../data/usePlace";
import Skeleton from "react-loading-skeleton";
import styles from "../styles/main.module.css";
import Image from "next/image";
import { useEffect, useRef } from "react";

export default function MultiPlace({ email, worldId }) {
  const { loading: usePlaceLoading, data } = usePlace(
    `email=${email}&world=${worldId}`
  );
  //something scroll problem since positionX is global,mouseMoveHandler get wrong position which is updated
  //https://stackoverflow.com/questions/256754/how-to-pass-arguments-to-addeventlistener-listener-function
  let positionX = 0;
  let storeFunc = null;
  const inputEl = useRef(null);
  const listenToMouseDown = (e) => {
    inputEl.current.style.cursor = "grabbing";
    inputEl.current.style.userSelect = "none";
    const positionX = e.clientX + inputEl.current.scrollLeft;
    storeFunc = addListenerWithArgs(
      inputEl.current,
      "mousemove",
      mouseMoveHandler,
      positionX
    );
    //inputEl.current.addEventListener("mousemove", mouseMoveHandler, false);
    inputEl.current.addEventListener("mouseup", mouseUpHandler, false);
  };
  const mouseMoveHandler = (e, positionX) => {
    console.log("mouseMoveHandler", e, positionX);
    const dx = e.clientX - positionX;
    inputEl.current.scrollLeft = inputEl.current.scrollLeft - dx;
  };
  const mouseUpHandler = () => {
    inputEl.current.removeEventListener("mousemove", storeFunc);
    //inputEl.current.removeEventListener("mousemove", mouseMoveHandler);
    inputEl.current.removeEventListener("mouseup", mouseUpHandler);
    inputEl.current.style.cursor = "grab";
    inputEl.current.style.removeProperty("user-select");
    positionX = 0;
  };
  function addListenerWithArgs(elem, evt, func, vars) {
    var f = (function (ff, vv) {
      return function () {
        ff(vv);
      };
    })(func, vars);

    elem.addEventListener(evt, f);

    return f;
  }
  if (typeof window !== "undefined") {
    useEffect(() => {
      inputEl.current.addEventListener("mousedown", listenToMouseDown);
      return () => {
        inputEl.current.removeEventListener("mousedown", listenToMouseDown);
      };
    }, []);
  }
  return (
    <div className={"multiPlace"} ref={inputEl}>
      {usePlaceLoading &&
        [...Array(12)].map((place, index) => (
          <Skeleton
            key={index}
            style={{
              width: "6rem",
              height: "6rem",
              border: "1px solid black",
              marginRight: "0.5rem",
              marginBottom: "0.5rem",
              borderRadius: "0.5rem",
            }}
          />
        ))}
      {data &&
        data.success &&
        data.data.map((place) => (
          <div key={place.num} className={styles.place}>
            {place.type &&
            place.type !== "" &&
            window.location.hostname !== "localhost" ? (
              <Image
                src={`/images/${place.type}.jpg`}
                alt={place.type}
                height={100}
                width={100}
                style={{ width: "100%", height: "100%" }}
              />
            ) : null}
            <div className={styles.shadow}>地區 {place.num}</div>
          </div>
        ))}
    </div>
  );
}
