import Head from "next/head";
import dbConnect from "../utils/dbConnect";
import Layout, { siteTitle } from "../components/Layout";
import { useSession, getSession } from "next-auth/client";
import useWorld from "../data/useWorld";
import Skeleton from "react-loading-skeleton";
import MultiPlace from "../components/MultiPlace";
import { useRouter } from "next/router";
import { useEffect } from "react";
import styles from "../styles/main.module.css";
import Link from "next/link";
import ActiveLink from "../components/ActiveLink";

export default function worldAndPlace() {
  const [session, loading] = useSession();
  const router = useRouter();
  if (typeof window !== "undefined" && loading) return null;
  useEffect(() => {
    if (router) {
      if (!session) {
        router.push({
          pathname: "/",
          query: { error: "pleaseLogin" },
        });
      }
    }
  }, [router]);
  const { selectDC, selectNDC } = router.query;
  const { loading: useDCWorldLoading, data: dCdata } = useWorld(
    `email=${session.user.email}&directControl=true`,
    selectDC === "true"
  );
  const { loading: useNDCWorldLoading, data: nDCdata } = useWorld(
    `email=${session.user.email}&directControl=false`,
    selectNDC === "true"
  );
  return (
    <Layout>
      <Head>
        <title>World And Place</title>
      </Head>
      <header>
        <span className={styles.mainHeader}>World And Place</span>
      </header>
      <div>
        <div>
          <ActiveLink
            activeClassName={styles.tabActive}
            href={`${router.pathname}?selectDC=true`}
            methodGet={{ selectDC: "true" }}
          >
            <a>
              <header>
                <span className={styles.subHeader}>Direct Control World</span>
              </header>
            </a>
          </ActiveLink>
          <ActiveLink
            activeClassName={styles.tabActive}
            href={`${router.pathname}?selectNDC=true`}
            methodGet={{ selectNDC: "true" }}
          >
            <a>
              <header>
                <span className={styles.subHeader}>
                  Non Direct Control World
                </span>
              </header>
            </a>
          </ActiveLink>
          <ActiveLink
            activeClassName={styles.tabActive}
            href={`${router.pathname}?selectDC=true&selectNDC=true`}
            methodGet={{ selectDC: "true", selectNDC: "true" }}
          >
            <a>
              <header>
                <span className={styles.subHeader}>All World</span>
              </header>
            </a>
          </ActiveLink>
        </div>
        <section
          style={{
            background: "#ffeb3b",
          }}
        >
          <header>
            <span className={styles.mainHeader}>Direct Control</span>
            <p>direct control would get all money</p>
          </header>
          {useDCWorldLoading ? (
            <section
              style={{
                padding: "1rem",
                border: "1px solid #e0e0e0",
                borderRadius: "0.5rem",
                background: "white",
              }}
            >
              <header>
                <span className={styles.subHeader}>
                  <Skeleton style={{ width: "50%" }} />
                </span>
              </header>
              <p>
                <Skeleton />
              </p>
            </section>
          ) : null}
          {dCdata &&
            dCdata.success &&
            dCdata.data.map((world) => (
              <section
                key={world._id}
                style={{
                  padding: "1rem",
                  border: "1px solid #e0e0e0",
                  borderRadius: "0.5rem",
                  background: "white",
                }}
              >
                <header>
                  <span className={styles.subHeader}>{world.name} World</span>
                </header>
                <p>description</p>

                <MultiPlace worldId={world._id} email={session.user.email} />
              </section>
            ))}
        </section>
        <aside>
          <nav>
            <ul style={{ margin: 0, padding: 0, listStyleType: "none" }}>
              <li>
                <div>test</div>
              </li>
              <li>
                <div>test</div>
              </li>
              <li>
                <div>test</div>
              </li>
              <li>
                <div>test</div>
              </li>
              <li>
                <div>test</div>
              </li>
              <li>
                <div>test</div>
              </li>
              <li>
                <div>test</div>
              </li>
            </ul>
          </nav>
        </aside>
      </div>
    </Layout>
  );
}
export async function getServerSideProps(context) {
  await dbConnect();
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/?error=pleaseLogin",
        permanent: false,
      },
    };
  }

  const { selectDC, selectNDC } = context.query;
  if (
    (!selectDC && !selectNDC) ||
    (!selectNDC && selectDC !== "true") ||
    (!selectDC && selectNDC !== "true")
  ) {
    return {
      redirect: {
        destination: `${context.resolvedUrl.split("?")[0]}?selectDC=true`,
        permanent: false,
      },
    };
  }

  return { props: { session } };
}
