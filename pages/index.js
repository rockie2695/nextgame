import Head from "next/head";
import dbConnect from "../utils/dbConnect";
import Pet from "../models/Pet";
import IsLand from "../models/IsLand";
import Place from "../models/Place";
import Layout, { siteTitle } from "../components/Layout";
import { useSession, getSession } from "next-auth/client";

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
export async function getServerSideProps(context) {
  await dbConnect();

  /* find all the data in our database */
  const result = await Pet.find({});
  console.log(result);
  const pets = result.map((doc) => {
    const pet = doc.toObject();
    pet._id = pet._id.toString();
    return pet;
  });
  const session = await getSession(context);
  if (!session) {
    return { props: { pets: pets } };
  }
  const result2 = await IsLand.countDocuments({
    email: session.user.email,
  });
  if (result2 == 0) {
    try {
      //create IsLand
      const isLandArray = {
        email: session.user.email,
        name: "xx",
        placeNum: 12,
      };
      const result3 = await IsLand.create(isLandArray);

      //create Place
      const placeArray = [];
      while (placeArray.length < isLandArray.placeNum) {
        placeArray.push({
          email: session.user.email,
          num: placeArray.length + 1,
          island: result3._id,
        });
      }
      const result4 = await Place.insertMany(placeArray);
    } catch (err) {
      console.log(err.message);
    }
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
