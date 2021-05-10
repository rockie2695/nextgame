import Head from "next/head";
import dbConnect from "../utils/dbConnect";
import Pet from "../models/Pet";
import IsLand from "../models/IsLand";
import Layout, { siteTitle } from "../components/Layout";

export default function Home() {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      Home
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
  const result2 = await IsLand.countDocuments({
    email: "rockie2695@gmail.com",
  });
  if(result2==0){
    //create island
    
  }
  /*

const res = await fetch('/api/pets', {
        method: 'POST',
        headers: {
          Accept: contentType,
          'Content-Type': contentType,
        },
        body: JSON.stringify(form),
      })
*/

  return { props: { pets: pets } };
}
