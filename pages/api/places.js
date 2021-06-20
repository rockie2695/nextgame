import dbConnect from "../../utils/dbConnect";
import Place from "../../models/Place";

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const places = await Place.find(req.query).sort(
          "num"
        ); /* find all the data in our database */
        res.status(200).json({ success: true, data: places });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        if (
          req.body.hasOwnProperty("placeArray") &&
          Array.isArray(req.body.placeArray)
        ) {
          const place = await Place.insertMany(
            req.body.placeArray
          ); /* create a new model in the database */
          res.status(201).json({ success: true, data: place });
        } else {
          const place = await Place.create(
            req.body
          ); /* create a new model in the database */
          res.status(201).json({ success: true, data: place });
        }
      } catch (error) {
        console.log(error);
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
