import dbConnect from "../../utils/dbConnect";
import World from "../../models/World";
import Place from "../../models/Place";

export default async function handler(req, res) {
  const { method } = req;
  const contentType = "application/json";
  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const worlds = await World.find(
          req.query
        ); /* find all the data in our database */
        const places = await Place.find(req.query);
        let countryResult = JSON.parse(JSON.stringify(worlds));
        countryResult = await Promise.all(
          countryResult.map(async (row) => {
            let placeResult = await fetch(
              `${
                process.env.NEXTAUTH_URL
              }/api/places?world=${row._id.toString()}`,
              {
                method: "GET",
                headers: {
                  Accept: contentType,
                  "Content-Type": contentType,
                },
              }
            );
            placeResult = await placeResult.json();
            placeResult.data = await placeResult.data.map((row) => {
              delete row.world;
              return row;
            });
            row.places = placeResult.data;
            return row;
          })
        );

        res.status(200).json({
          success: true,
          data: countryResult,
        });
      } catch (error) {
        console.log(error);
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        if (
          req.body.hasOwnProperty("worldArray") &&
          Array.isArray(req.body.worldArray)
        ) {
          const world = await World.insertMany(
            req.body.worldArray
          ); /* create a new model in the database */
          res.status(201).json({ success: true, data: world });
        } else {
          const world = await World.create(
            req.body
          ); /* create a new model in the database */
          res.status(201).json({ success: true, data: world });
        }
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
