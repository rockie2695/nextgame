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
          }}
        >
          <nav>
            <ul style={{ margin: 0, padding: 0, listStyleType: "none" }}>
              <li>{useloading}</li>
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
            data.data.map((row) => (
              <section key={row.name}>
                <h1>{row.name}</h1>
              </section>
            ))}
        </section>
        <aside style={{ flexBasis: "20%", minWidth: "10rem" }}>
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

  let countryResult = await fetch(
    `${process.env.NEXTAUTH_URL}/api/worlds?email=${session.user.email}`,
    {
      method: "GET",
      headers: {
        Accept: contentType,
        "Content-Type": contentType,
      },
    }
  );
  countryResult = await countryResult.json();

  if (!countryResult.success) {
    return {
      redirect: {
        destination: "/?error=",
        permanent: false,
      },
    };
  }

  countryResult = await Promise.all(
    countryResult.data.map(async (row) => {
      console.log(row._id);
      let placeResult = await fetch(
        `${process.env.NEXTAUTH_URL}/api/places?world=${row._id}`,
        {
          method: "GET",
          headers: {
            Accept: contentType,
            "Content-Type": contentType,
          },
        }
      );
      placeResult = await placeResult.json();
      row.places = placeResult.data;
      return row;
    })
  );
  console.log(countryResult);
  return { props: { session } };
}