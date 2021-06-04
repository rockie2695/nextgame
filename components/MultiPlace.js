import usePlace from "../data/usePlace";
import Skeleton from "react-loading-skeleton";
import styles from "../styles/main.module.css";

export default function MultiPlace({ email, worldId }) {
  const { loading: usePlaceLoading, data } = usePlace(
    `email=${email}&world=${worldId}`
  );
  return (
    <div
      style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
    >
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
            <div className={styles.shadow}>地區 {place.num}</div>
          </div>
        ))}
    </div>
  );
}
