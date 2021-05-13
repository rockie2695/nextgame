import Head from "next/head";
import dbConnect from "../utils/dbConnect";
import Pet from "../models/Pet";
import World from "../models/World";
import Place from "../models/Place";
import World from "../models/Country";
import Place from "../models/People";
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
  const result2 = await World.countDocuments({
    email: session.user.email,
  });
  if (result2 == 0) {
    try {
      //create World
      const worldArray = {
        email: session.user.email,
        name: "xx",
        placeNum: 12,
        controlPeople: [],
      };
      const result3 = await World.create(worldArray);

      //create Place
      const placeArray = [];
      while (placeArray.length < worldArray.placeNum) {
        placeArray.push({
          email: session.user.email,
          num: placeArray.length + 1,
          world: result3._id,
        });
      }
      const result4 = await Place.insertMany(placeArray);

      const countryArray = {
        email: session.user.email,
        name: session.user.name,
        money: 0,
        food: 0,
        country_num: result2 + 1,
      };
      const result5 = await Country.create(countryArray);

      const peopleArray = {
        email: session.user.email,
        name: "aa",
        country_id: result5._id,
      };
      const result6 = await Country.create(peopleArray);
    } catch (err) {
      if (err.erros) {
        for (const property in err.errors) {
          console.log(err.errors[property].message);
        }
      } else if (err.message) {
        console.log(err.message);
      } else {
        console.log("unknown error");
      }
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
