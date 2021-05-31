import usePlace from "../data/usePlace";
import Skeleton from "react-loading-skeleton";

export default function MultiPlace({ email, worldId }) {
  const { loading: usePlaceLoading, data } = usePlace(
    `email=${email}&world=${worldId}`
  );
  return (
    <div
      style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
    >
      {usePlaceLoading &&
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map((place, index) => (
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
          <div
            key={place.num}
            style={{
              width: "6rem",
              height: "6rem",
              border: "1px solid black",
              marginRight: "0.5rem",
              marginBottom: "0.5rem",
              overflow: "hidden",
              borderRadius: "0.5rem",
            }}
          >
            <div
              style={{
                transform: "translateY(4.5rem)",
                color: "white",
                background: "rgba(0,0,0,0.75)",
                width: "6rem",
                height: "6rem",
              }}
            >
              地區 {place.num}
            </div>
          </div>
        ))}
    </div>
  );
}
