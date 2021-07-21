import usePlace from "../data/usePlace";
import Skeleton from "react-loading-skeleton";
import styles from "../styles/main.module.css";
import Image from "next/image";
import { useEffect, useRef } from "react";
import 丘陵 from "../public/images/丘陵.jpeg";
import 平原 from "../public/images/平原.jpeg";
import 島嶼 from "../public/images/島嶼.jpeg";
import 高原 from "../public/images/高原.jpeg";

import { MdAccountBalance as CityIcon } from "react-icons/md";

import { GiVillage as VillageIcon } from "react-icons/gi";

const imgObj = { 丘陵: 丘陵, 平原: 平原, 島嶼: 島嶼, 高原: 高原 };

export default function MultiPlace({ email, worldId }) {
  const { loading: usePlaceLoading, data } = usePlace(
    `email=${email}&world=${worldId}`
  );
  let positionX = 0;
  const multiPlace = useRef(null);
  const multiPlaceContainer = useRef(null);
  const listenToMouseDown = (e) => {
    if (e.cancelable) {
      e.preventDefault();
    }
    let clientX = e.clientX || e.touches[0].pageX;
    positionX = clientX + multiPlace.current.scrollLeft;
    multiPlace.current.style.cursor = "grabbing";
    multiPlace.current.style.userSelect = "none";
    if (
      (window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth) <= 810
    ) {
      multiPlace.current.style.overflowX = "overlay";
    }
    multiPlace.current.addEventListener("mousemove", mouseMoveHandler, false);
    multiPlace.current.addEventListener("mouseup", mouseUpHandler, false);
    multiPlace.current.addEventListener("mouseleave", mouseUpHandler, false);
    multiPlace.current.addEventListener("touchmove", mouseMoveHandler, false);
    multiPlace.current.addEventListener("touchend", mouseUpHandler, false);
    multiPlace.current.addEventListener("touchcancel", mouseUpHandler, false);
  };
  const mouseMoveHandler = (e) => {
    if (e.cancelable) {
      e.preventDefault();
    }
    let clientX = e.clientX || e.touches[0].pageX;
    let scrollLeft = Math.round(multiPlace.current.scrollLeft);
    let scrollLeft_10 = scrollLeft + 10;
    let scrollWidth_clientWidth = Math.round(
      multiPlace.current.scrollWidth - multiPlace.current.clientWidth
    );
    const dx = scrollLeft + clientX - positionX;
    if (scrollLeft == 0 && dx > 0) {
      multiPlace.current.querySelector("div").style.marginLeft = `${parseInt(
        dx / 2
      )}px`;
    } else if (scrollLeft_10 >= scrollWidth_clientWidth && dx < 0) {
      multiPlace.current.querySelector("div").style.marginRight = `${parseInt(
        Math.abs(dx) / 2
      )}px`;
      multiPlace.current.scrollLeft = scrollWidth_clientWidth;
    } else {
      multiPlace.current.scrollLeft = scrollLeft - dx;
    }
    frontBackTransparent();
  };
  const frontBackTransparent = () => {
    let scrollLeft = Math.round(multiPlace.current.scrollLeft);
    let scrollLeft_10 = scrollLeft + 10;
    let scrollWidth_clientWidth = Math.round(
      multiPlace.current.scrollWidth - multiPlace.current.clientWidth
    );
    if (scrollLeft !== 0) {
      multiPlaceContainer.current.querySelector(
        `.${styles.front}`
      ).style.visibility = "visible";
    } else {
      multiPlaceContainer.current
        .querySelector(`.${styles.front}`)
        .style.removeProperty("visibility");
    }
    let marginRight =
      parseFloat(
        multiPlace.current
          .querySelector("div")
          .style.marginRight.replace("px", "")
      ) || 0;
    if (scrollLeft_10 >= scrollWidth_clientWidth - marginRight) {
      multiPlaceContainer.current
        .querySelector(`.${styles.back}`)
        .style.removeProperty("visibility");
    } else {
      multiPlaceContainer.current.querySelector(
        `.${styles.back}`
      ).style.visibility = "visible";
    }
  };
  const mouseUpHandler = () => {
    multiPlace.current.removeEventListener("mousemove", mouseMoveHandler);
    multiPlace.current.removeEventListener("mouseup", mouseUpHandler);
    multiPlace.current.removeEventListener("mouseleave", mouseUpHandler);
    multiPlace.current.removeEventListener("touchmove", mouseMoveHandler);
    multiPlace.current.removeEventListener("touchend", mouseUpHandler);
    multiPlace.current.removeEventListener("touchcancel", mouseUpHandler);
    multiPlace.current.style.removeProperty("cursor");
    multiPlace.current.style.removeProperty("user-select");
    if (
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth <= 810
    ) {
      multiPlace.current.style.removeProperty("overflow-x");
    }
    multiPlace.current.querySelector("div").style.transition =
      "margin 0.4s ease-in-out";
    multiPlace.current
      .querySelector("div")
      .style.removeProperty("margin-right");
    multiPlace.current.querySelector("div").style.removeProperty("margin-left");
    positionX = 0;
    setTimeout(() => {
      multiPlace.current
        .querySelector("div")
        .style.removeProperty("transition");
    }, 400);
  };
  if (typeof window !== "undefined") {
    useEffect(() => {
      const currentDivRef = multiPlace.current;
      currentDivRef.addEventListener("mousedown", listenToMouseDown, false);
      currentDivRef.addEventListener("touchstart", listenToMouseDown, false);
      currentDivRef.addEventListener("scroll", frontBackTransparent, {
        passive: true,
      });
      return () => {
        currentDivRef.removeEventListener("mousedown", listenToMouseDown);
        currentDivRef.removeEventListener("touchstart", listenToMouseDown);
        currentDivRef.removeEventListener("scroll", frontBackTransparent);
      };
    }, [multiPlace]);
  }
  return (
    <div className={styles.multiPlaceContainer} ref={multiPlaceContainer}>
      <div className={styles.multiPlace} ref={multiPlace}>
        <div>
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
                {place.type && place.type !== "" ? (
                  <Image
                    src={imgObj[place.type]}
                    alt={place.type}
                    height={100}
                    width={100}
                    placeholder="blur"
                  />
                ) : null}
                {place.village && place.village !== 0 ? (
                  <VillageIcon
                    style={{
                      top: "1rem",
                      position: "absolute",
                      left: "1rem",
                      fontSize: "4rem",
                      color: "white",
                    }}
                  />
                ) : null}
                {place.city && place.city !== 0 ? (
                  <CityIcon
                    style={{
                      top: "1rem",
                      position: "absolute",
                      left: "1rem",
                      fontSize: "4rem",
                      color: "white",
                    }}
                  />
                ) : null}
                <div className={styles.shadow}>地塊 {place.num}</div>
              </div>
            ))}
        </div>
      </div>
      <div className={styles.front}></div>
      <div className={styles.back}></div>
    </div>
  );
}
