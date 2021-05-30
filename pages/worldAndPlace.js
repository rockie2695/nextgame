import Head from "next/head";
import dbConnect from "../utils/dbConnect";
import Layout, { siteTitle } from "../components/Layout";
import { useSession, getSession } from "next-auth/client";
import useWorld from "../data/useWorld";
import Skeleton from "react-loading-skeleton";
import MultiPlace from "../components/MultiPlace";

export default function worldAndPlace() {
  const [session, loading] = useSession();

  if (typeof window !== "undefined" && loading) return null;

  if (!session) {
    return {
      redirect: {
        destination: "/?error=pleaseLogin",
        permanent: false,
      },
    };
  }
  const { loading: useWorldLoading, data } = useWorld(
    `email=${session.user.email}&directControl=true`
  );
  return (
    <Layout>
      <Head>
        <title>World And Place</title>
      </Head>
      <header>
        <span className={"mainHeader"}>World And Place</span>
      </header>
      <div>
        <div>
          <nav>
            <ul>
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
        </div>
        <section>
          <header>
            <span className={"mainHeader"}>All World</span>
            <p>test</p>
          </header>
          {useWorldLoading ? (
            <section
              style={{
                padding: "1rem",
                border: "1px solid #e0e0e0",
                borderRadius: "0.5rem",
              }}
            >
              <header>
                <span className={"subHeader"}>
                  <Skeleton style={{ width: "50%" }} />
                </span>
              </header>
              <p>
                <Skeleton />
              </p>
            </section>
          ) : null}
          {data &&
            data.success &&
            data.data.map((world) => (
              <section
                key={world.name}
                style={{
                  padding: "1rem",
                  border: "1px solid #e0e0e0",
                  borderRadius: "0.5rem",
                }}
              >
                <header>
                  <span className={"subHeader"}>{world.name} World</span>
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
  const contentType = "application/json";
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/?error=pleaseLogin",
        permanent: false,
      },
    };
  }
  return { props: { session } };
}
