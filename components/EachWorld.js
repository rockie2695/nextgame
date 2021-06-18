import MultiPlace from "../components/MultiPlace";
import styles from "../styles/main.module.css";
import { MdEdit as MdEditIcon, MdSave as MdSaveIcon } from "react-icons/md";
import { useState } from "react";

export default function EachWorld({ email, world }) {
  const [editNameState, setEditNameState] = useState(false);
  const [worldName, setWorldName] = useState(world.name);
  const [oldWorldName, setOldWorldName] = useState(world.name);
  const editName = () => {
    setEditNameState(!editNameState);
  };
  const changeWorldName = (event) => {
    setWorldName(event.target.value);
  };
  return (
    <section className={styles.world}>
      <header className={styles.subHeader}>
        {editNameState ? (
          <input type="text" value={worldName} onChange={changeWorldName} />
        ) : (
          <span>{world.name}</span>
        )}
        <span>&nbsp;世界</span>
        {editNameState ? (
          <button onClick={editName}>
            <MdSaveIcon />
          </button>
        ) : (
          <button onClick={editName}>
            <MdEditIcon />
          </button>
        )}
        <span>{world.placeNum}</span>
      </header>
      <p>
        [{world.type}世界]
        {world.type === "蒸汽"
          ? "第一次工業革命,使用蒸汽機、煤、鐵和鋼進行工業化"
          : null}
      </p>

      <MultiPlace worldId={world._id} email={email} />
    </section>
  );
}
