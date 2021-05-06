import Head from "next/head";
import dbConnect from "../utils/dbConnect";
import Pet from "../models/Pet";
import Layout, { siteTitle } from "../components/Layout";

export default function Home3() {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      Home3
      <aside>
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
      <section>
        <h1>test</h1>
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
