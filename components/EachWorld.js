import MultiPlace from "../components/MultiPlace";
import styles from "../styles/main.module.css";
import {
  MdEdit as MdEditIcon,
  MdSave as MdSaveIcon,
  MdArrowBack as MdArrowBackIcon,
} from "react-icons/md";
import { useState } from "react";
import { mutate } from "swr";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";

export default function EachWorld({ email, world }) {
  const [session, loading] = useSession();
  const router = useRouter();
  const contentType = "application/json";
  const [editNameState, setEditNameState] = useState(false);
  const [worldName, setWorldName] = useState({ name: world.name });
  const [oldWorldName, setOldWorldName] = useState({ name: world.name });
  const { selectDC, selectNDC } = router.query;
  const editName = () => {
    setEditNameState(!editNameState);
  };
  const changeWorldName = (event) => {
    setWorldName({
      [event.target.name]: event.target.value.replace(/\s+/g, ""),
    });
  };
  const restoreWorldName = () => {
    setWorldName(oldWorldName);
    setEditNameState(false);
  };
  const updateWorldName = async (id) => {
    if (worldName.name === "") {
      setWorldName(oldWorldName);
      setEditNameState(false);
      return;
    }
    const res = await fetch(`/api/worlds/${id}`, {
      method: "PUT",
      headers: {
        Accept: contentType,
        "Content-Type": contentType,
      },
      body: JSON.stringify(worldName),
    });

    // Throw error with status code in case Fetch API req failed
    if (!res.ok) {
      //throw new Error(res.status);
      alert("error");
      console.log(res.status);
      setWorldName(oldWorldName);
    }
    if (res.ok) {
      setOldWorldName(worldName);
      if (selectDC === "true") {
        mutate(`/api/worlds?email=${session.user.email}&directControl=true`);
      }
      if (selectNDC === "true") {
        mutate(`/api/worlds?email=${session.user.email}&directControl=false`);
      }
    }

    setEditNameState(false);
  };

  return (
    <section className={styles.world}>
      <header className={styles.subHeader}>
        <form>
          {editNameState ? (
            <input
              type="text"
              name="name"
              value={worldName.name}
              onChange={changeWorldName}
              minLength="2"
              maxLength="5"
            />
          ) : (
            <span>{worldName.name}</span>
          )}
          <span>&nbsp;世界</span>
          {editNameState ? (
            <>
              <button type="button" onClick={() => updateWorldName(world._id)}>
                <MdSaveIcon />
              </button>
              <button type="button" onClick={restoreWorldName}>
                <MdArrowBackIcon />
              </button>
            </>
          ) : (
            <button type="button" onClick={editName}>
              <MdEditIcon />
            </button>
          )}
        </form>

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
