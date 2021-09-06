export function BackCard({ className = "", style = {} }) {
  return (
    <>
      <div
        className={[
          "height7rem",
          "width6rem",
          "border1px",
          "margin025rem",
          "padding025rem",
          "flexShrink0",
          "backCard",
          "borderRadius05rem",
        ]
          .join(" ")
          .concat(" ", className || "")}
        style={{ ...style }}
      ></div>
      <style jsx>{`
        .backCard {
          background-image: repeating-radial-gradient(
            var(--color-brown-500),
            black 20%
          );
          border-color: white;
        }
      `}</style>
    </>
  );
}
