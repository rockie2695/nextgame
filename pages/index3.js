import Head from "next/head";
import dbConnect from "../utils/dbConnect";
import Layout, { siteTitle } from "../components/Layout";
import { useSession, getSession } from "next-auth/client";

export default function Home3() {
  const [session, loading] = useSession();

  if (typeof window !== "undefined" && loading) return null;

  if (!session) {
    return (
      <Layout>
        <Head>
          <title>Home3</title>
        </Head>
        Please Login
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Home3</title>
      </Head>
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
      <section style={{ width: "80%" }}>
        <header>
          <h1>Home3</h1>
        </header>
        <p>test</p>
        <div>test</div>
      </section>
    </Layout>
  );
}
/* Retrieves pet(s) data from mongodb database */
export async function getServerSideProps(req) {
  console.log(req);
  await dbConnect();
  const session = await getSession(req);
  console.log(session);
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
