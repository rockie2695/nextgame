import usePlace from "../data/usePlace";
export default function MultiPlace({ email, worldId }) {
  const { loading: usePlaceLoading, data } = usePlace(
    `email=${email}&world=${worldId}`
  );
  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {data &&
        data.success &&
        data.data.map((place) => (
          <div
            key={place.num}
            style={{
              width: "5rem",
              height: "5rem",
              border: "1px solid black",
              marginRight: "0.5rem",
              marginBottom: "0.5rem",
              overflow: "hidden",
              borderRadius: "0.5rem",
            }}
          >
            <div
              style={{
                transform: "translateY(3.5rem)",
                color: "white",
                background: "rgba(0,0,0,0.75)",
                width: "5rem",
                height: "5rem",
              }}
            >
              地區 {place.num}
            </div>
          </div>
        ))}
    </div>
  );
}
