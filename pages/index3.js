import Head from "next/head";
import dbConnect from "../utils/dbConnect";
import Pet from "../models/Pet";
import Layout, { siteTitle } from "../components/Layout";

export default function Home3() {
  return (
    <Layout home>
      <Head>
        <title>Home3</title>
      </Head>
      <aside style={{ width: "20%", minWidth: "10rem" }}>
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
export async function getServerSideProps() {
  await dbConnect();

  /* find all the data in our database */
  const result = await Pet.find({});
  console.log(result);
  const pets = result.map((doc) => {
    const pet = doc.toObject();
    pet._id = pet._id.toString();
    return pet;
  });
  console.log(pets);
  return { props: { pets: pets } };
}
