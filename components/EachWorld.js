import MultiPlace from "../components/MultiPlace";
import styles from "../styles/main.module.css";
import {
  MdEdit as MdEditIcon,
  MdSave as MdSaveIcon,
  MdArrowBack as MdArrowBackIcon,
} from "react-icons/md";
import { BiBorderRadius, BiWorld as BiWorldIcon } from "react-icons/bi";
import { FaRandom as FaRandomIcon } from "react-icons/fa";
import {
  MdPlace as MdPlaceIcon,
  MdPerson as MdPersonIcon,
} from "react-icons/md";
import { useEffect, useState } from "react";
import { mutate } from "swr";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import { randomWorldName } from "../utils/random";
import { SwitchTransition, CSSTransition } from "react-transition-group";
import Ripples from "react-ripples";

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
      setWorldName(oldWorldName);
    }
    if (res.ok) {
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
        <div>
          <header>
            <SwitchTransition mode="out-in">
              <CSSTransition
                key={editNameState}
                addEndListener={(node, done) => {
                  node.addEventListener("transitionend", done, false);
                }}
                classNames="fade"
              >
                <div>
                  {editNameState ? (
                    <div
                      className={[
                        "inputGroup",
                        styles.mainHeader,
                        styles.inputGroup,
                      ].join(" ")}
                    >
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
                    <div
                      className={
                        styles.mainHeader + " " + styles.svgWithTextContainer
                      }
                    >
                      <BiWorldIcon />
                      <span style={{ marginLeft: "0.25rem" }}>
                        {worldName.name}
                      </span>
                    </div>
                  )}
                  {editNameState ? (
                    <>
                      <div className={styles.buttonContainer}>
                        <Ripples>
                          <button
                            type="button"
                            onClick={() => updateWorldName(world._id)}
                          >
                            <MdSaveIcon />
                          </button>
                        </Ripples>
                      </div>
                      <div className={styles.buttonContainer}>
                        <Ripples>
                          <button type="button" onClick={restoreWorldName}>
                            <MdArrowBackIcon />
                          </button>
                        </Ripples>
                      </div>
                    </>
                  ) : (
                    <div className={styles.buttonContainer}>
                      <Ripples>
                        <button type="button" onClick={editName}>
                          <MdEditIcon />
                        </button>
                      </Ripples>
                    </div>
                  )}
                </div>
              </CSSTransition>
            </SwitchTransition>
          </header>
          <p>
            <span>[{world.type}世界]</span>
          </p>
          <p>
            <span className={styles.description}>
              {world.type === "蒸汽"
                ? " 第一次工業革命, 使用蒸汽機、煤、鐵和鋼, 進行機械化生產"
                : null}
            </span>
          </p>
        </div>
        <div>
          <strong className={styles.svgWithTextContainer}>
            <MdPersonIcon />
            manger
          </strong>
          <div>aaa</div>
        </div>
        <div>
          <strong className={styles.svgWithTextContainer}>
            <MdPlaceIcon />
            地塊 ({world.placeNum})
          </strong>
          <MultiPlace worldId={world._id} email={email} />
        </div>
      </form>
    </section>
  );
}
