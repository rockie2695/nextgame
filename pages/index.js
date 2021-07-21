import Head from "next/head";
import dbConnect from "../utils/dbConnect";
import Country from "../models/Country";
import Layout, { siteTitle } from "../components/Layout";
import { useSession, getSession } from "next-auth/client";
import { randomWorldName, randomPeopleName } from "../utils/random";
/**
import Place from "../models/Place";
import People from "../models/People";
 */
export default function Home() {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section>
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
      </section>
    </Layout>
  );
}
export async function getServerSideProps(context) {
  await dbConnect();
  const contentType = "application/json";
  const session = await getSession(context);
  if (!session) {
    return { props: {} };
  }
  const result2 = await Country.countDocuments({
    email: session.user.email,
  });
  if (result2 == 0) {
    try {
      //create country
      const countryObj = {
        email: session.user.email,
        name: session.user.name,
        money: 1000,
        food: 1000,
        country_num: result2 + 1,
      };
      let countryResult = await fetch(
        `${process.env.NEXTAUTH_URL}/api/countries`,
        {
          method: "POST",
          headers: {
            Accept: contentType,
            "Content-Type": contentType,
          },
          body: JSON.stringify(countryObj),
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

      //create people
      const peopleArray = [];
      while (peopleArray.length < 5) {
        let nameObj=randomPeopleName()
        peopleArray.push({
          email: session.user.email,
          name: nameObj.name,
          firstName:nameObj.firstName,
          country_id: countryResult.data._id,
        });
      }
      let peopleResult = await fetch(
        `${process.env.NEXTAUTH_URL}/api/peoples`,
        {
          method: "POST",
          headers: {
            Accept: contentType,
            "Content-Type": contentType,
          },
          body: JSON.stringify({ peopleArray: peopleArray }),
        }
      );
      peopleResult = await peopleResult.json();

      //create World
      const worldObj = {
        email: session.user.email,
        name: randomWorldName(),
        placeNum: 12,
        controlPeople: [],
        directControl: true,
        type: "蒸汽",
        roadTo: [],
      };
      let worldResult = await fetch(`${process.env.NEXTAUTH_URL}/api/worlds`, {
        method: "POST",
        headers: {
          Accept: contentType,
          "Content-Type": contentType,
        },
        body: JSON.stringify(worldObj),
      });
      worldResult = await worldResult.json();

      if (!worldResult.success) {
        return {
          redirect: {
            destination: "/?error=",
            permanent: false,
          },
        };
      }

      //create Place
      const placeArray = [];
      while (placeArray.length < worldObj.placeNum) {
        let placeObj = {
          email: session.user.email,
          num: placeArray.length + 1,
          world: worldResult.data._id,
          discover: false,
          type: "",
          city: 0,
          village: 0,
        };
        if (placeArray.length + 1 === 1) {
          placeObj.type = "平原";
          placeObj.discover = true;
          placeObj.city = 1;
        } else if (placeArray.length + 1 === 2) {
          placeObj.type = "高原";
          placeObj.discover = true;
          placeObj.village = 1;
        } else if (placeArray.length + 1 === 3) {
          placeObj.type = "丘陵";
          placeObj.discover = true;
          placeObj.village = 1;
        } else if (placeArray.length + 1 === 4) {
          placeObj.type = "島嶼";
          placeObj.discover = true;
          placeObj.village = 1;
        }
        placeArray.push(placeObj);
      } //平原高原丘陵島嶼
      let placeResult = await fetch(`${process.env.NEXTAUTH_URL}/api/places`, {
        method: "POST",
        headers: {
          Accept: contentType,
          "Content-Type": contentType,
        },
        body: JSON.stringify({ placeArray: placeArray }),
      });
      placeResult = await placeResult.json();
      if (!placeResult.success) {
        return {
          redirect: {
            destination: "/?error=",
            permanent: false,
          },
        };
      }
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

  return { props: {} };
}
