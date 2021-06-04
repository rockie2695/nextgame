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
  const tabArray = [
    {
      headerName: "Direct Control World",
      methodGet: { selectDC: "true" },
      href: `${router.pathname}?selectDC=true`,
    },
    {
      headerName: "Non Direct Control World",
      methodGet: { selectNDC: "true" },
      href: `${router.pathname}?selectNDC=true`,
    },
    {
      headerName: "All World",
      methodGet: { selectDC: "true", selectNDC: "true" },
      href: `${router.pathname}?selectDC=true&selectNDC=true`,
    },
  ];
  return (
    <Layout>
      <Head>
        <title>World And Place</title>
      </Head>
      <header>
        <span className={styles.mainHeader}>World And Place</span>
      </header>
      <div>
        <div className={styles.tab_container}>
          {tabArray.map((tab, index) => (
            <ActiveLink
              key={index}
              activeClassName={styles.tabActive}
              href={tab.href}
              methodGet={tab.methodGet}
            >
              <a>
                <header>
                  <span className={styles.subHeader}>{tab.headerName}</span>
                </header>
              </a>
            </ActiveLink>
          ))}
        </div>
        <section className={styles.section_container}>
          <header>
            <span className={styles.mainHeader}>Direct Control</span>
            <p>direct control would get all money</p>
          </header>
          {useDCWorldLoading ? (
            <section>
              <header>
                <span className={styles.subHeader}>
                  <Skeleton style={{ width: "50%" }} />
                </span>
              </header>
              <p>
                <Skeleton />
              </p>
              {[...Array(12)].map((place, index) => (
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
            </section>
          ) : null}
          {dCdata &&
            dCdata.success &&
            dCdata.data.map((world) => (
              <section key={world._id} className={styles.world}>
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
