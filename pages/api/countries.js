import dbConnect from "../../utils/dbConnect";
import Country from "../../models/Country";

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "POST":
      try {
        if (
          req.body.hasOwnProperty("countryArray") &&
          Array.isArray(req.body.countryArray)
        ) {
          const country = await Country.insertMany(
            req.body.countryArray
          ); /* create a new model in the database */
          res.status(201).json({ success: true, data: country });
        } else {
          const country = await Country.create(
            req.body
          ); /* create a new model in the database */
          res.status(201).json({ success: true, data: country });
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
