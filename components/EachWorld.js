import MultiPlace from "../components/MultiPlace";
import styles from "../styles/main.module.css";
import {
  MdEdit as MdEditIcon,
  MdSave as MdSaveIcon,
  MdArrowBack as MdArrowBackIcon,
} from "react-icons/md";
import { BiBorderRadius, BiWorld as BiWorldIcon } from "react-icons/bi";
import { FaRandom as FaRandomIcon } from "react-icons/fa";
import { useEffect, useState } from "react";
import { mutate } from "swr";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import { randomWorldName } from "../utils/random";
import { SwitchTransition, CSSTransition } from "react-transition-group";

export default function EachWorld({ email, world }) {
  const [session, loading] = useSession();
  const router = useRouter();
  const contentType = "application/json";
  const [editNameState, setEditNameState] = useState(false);
  const [worldName, setWorldName] = useState({ name: world.name });
  const [oldWorldName, setOldWorldName] = useState({ name: world.name });
  const { selectDC, selectNDC } = router.query;
  useEffect(() => {
    setWorldName({ name: world.name });
    setOldWorldName({ name: world.name });
  }, [world]);
  const editName = () => {
    setEditNameState(!editNameState);
  };
  const changeWorldName = (event) => {
    setWorldName({
      [event.target.name]: event.target.value.replace(/\s+/g, ""),
    });
  };
  const changeRandomWorldName = () => {
    setWorldName({ name: randomWorldName() });
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
      <form>
        <header className={styles.subHeader}>
          <SwitchTransition mode="out-in">
            <CSSTransition
              key={editNameState}
              addEndListener={(node, done) => {
                node.addEventListener("transitionend", done, false);
              }}
              classNames="fade"
            >
              <div style={{ display: "flex" }}>
                {editNameState ? (
                  <div className="inputGroup">
                    <div className={"first svg"}>
                      <BiWorldIcon />
                    </div>

                    <input
                      type="text"
                      name="name"
                      value={worldName.name}
                      onChange={changeWorldName}
                      minLength="2"
                      maxLength="5"
                      placeholder="世界名稱"
                    />
                    <div
                      className={"last svg button"}
                      onClick={changeRandomWorldName}
                    >
                      <FaRandomIcon />
                    </div>
                  </div>
                ) : (
                  <div>
                    <BiWorldIcon />
                    <span style={{ marginLeft: "0.25rem" }}>
                      {worldName.name}
                    </span>
                  </div>
                )}
                {editNameState ? (
                  <>
                    <button
                      type="button"
                      onClick={() => updateWorldName(world._id)}
                    >
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
              </div>
            </CSSTransition>
          </SwitchTransition>
        </header>
        <p>
          [{world.type}世界]
          {world.type === "蒸汽"
            ? "第一次工業革命,使用蒸汽機、煤、鐵和鋼進行工業化"
            : null}
        </p>
        <div style={{ marginBottom: "1rem" }}>
          <strong>manger</strong>
          <div>aaa</div>
        </div>
        <div>
          <strong>地塊:{world.placeNum}</strong>
          <MultiPlace worldId={world._id} email={email} />
        </div>
      </form>
    </section>
  );
}
