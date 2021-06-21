import usePlace from "../data/usePlace";
import Skeleton from "react-loading-skeleton";
import styles from "../styles/main.module.css";
import Image from "next/image";
import { useEffect, useRef } from "react";

export default function MultiPlace({ email, worldId }) {
  const { loading: usePlaceLoading, data } = usePlace(
    `email=${email}&world=${worldId}`
  );
  let positionX = 0;
  const inputEl = useRef(null);
  const listenToMouseDown = (e) => {
    inputEl.current.style.cursor = "grabbing";
    inputEl.current.style.userSelect = "none";
    positionX = e.clientX + inputEl.current.scrollLeft;
    inputEl.current.addEventListener("mousemove", mouseMoveHandler, false);
    inputEl.current.addEventListener("mouseup", mouseUpHandler, false);
    inputEl.current.addEventListener("mouseleave", mouseUpHandler, false);
  };
  const mouseMoveHandler = (e) => {
    const dx = inputEl.current.scrollLeft + e.clientX - positionX;
    inputEl.current.scrollLeft = inputEl.current.scrollLeft - dx;
  };
  const mouseUpHandler = () => {
    inputEl.current.removeEventListener("mousemove", mouseMoveHandler);
    inputEl.current.removeEventListener("mouseup", mouseUpHandler);
    inputEl.current.removeEventListener("mouseleave", mouseUpHandler);
    inputEl.current.style.cursor = "grab";
    inputEl.current.style.removeProperty("user-select");
    positionX = 0;
  };
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
