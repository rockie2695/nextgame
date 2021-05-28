import Head from "next/head";
import dbConnect from "../utils/dbConnect";
import Layout, { siteTitle } from "../components/Layout";
import { useSession, getSession } from "next-auth/client";
import useWorld from "../data/useWorld";
import Skeleton from "../components/Skeleton";

export default function Place() {
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
    `email=${session.user.email}&directControl=true&countryNum=1`
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
          {true /*useWorldLoading*/ ? <Skeleton /> : null}
          {data &&
            data.success &&
            data.data.map((row) => (
              <section
                key={row.name}
                style={{
                  padding: "1rem",
                  border: "1px solid #e0e0e0",
                  borderRadius: "0.5rem",
                }}
              >
                <header>
                  <span className={"subHeader"}>{row.name} World</span>
                </header>
                <p>description</p>
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                  {row.hasOwnProperty("places") &&
                    row.places.map((place) => (
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
