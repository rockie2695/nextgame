import Head from "next/head";
import dbConnect from "../utils/dbConnect";
import Layout, { siteTitle } from "../components/Layout";
import { useSession, getSession } from "next-auth/client";
import useWorld from "../data/useWorld";

export default function Place() {
  const [session, loading] = useSession();

  if (typeof window !== "undefined" && loading) return null;

  if (!session) {
    return (
      <Layout>
        <Head>
          <title>Place</title>
        </Head>
        Please Login
      </Layout>
    );
  }
  const { useloading, error, data } = useWorld(session.user.email);
  console.log(useloading, error, data);
  return (
    <Layout>
      <Head>
        <title>Place</title>
      </Head>
      <header>
        <span>Place</span>
      </header>
      <div>
        <div
          style={{
            flexBasis: "20%",
            height: "100%",
            position: "sticky",
            top: "4rem",
          }}
        >
          <nav>
            <ul style={{ margin: 0, padding: 0, listStyleType: "none" }}>
              <li>{useloading ? "loading" : null}</li>
              <li>{error}</li>

              <li></li>

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
        <section style={{ flexBasis: "60%" }}>
          <header>
            <h1>All World</h1>
            <p>test</p>
          </header>
          {data &&
            data.success &&
            data.data.map((row) => (
              <section
                key={row.name}
                style={{ padding: "0.5rem", border: "1px solid #e0e0e0" }}
              >
                <h1>{row.name}</h1>
                <p>xx world</p>
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                  {row.places.map((place) => (
                    <div
                      key={place.num}
                      style={{
                        width: "5rem",
                        height: "5rem",
                        border: "1px solid black",
                        marginRight: "0.25rem",
                        marginBottom: "0.25rem",
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
                        {place.num}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
        </section>
        <aside
          style={{
            flexBasis: "20%",
            minWidth: "10rem",
            height: "100%",
            position: "sticky",
            top: "4rem",
          }}
        >
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
