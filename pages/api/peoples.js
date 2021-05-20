import dbConnect from "../../utils/dbConnect";
import People from "../../models/People";

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const peoples = await People.find(
          req.query
        ); /* find all the data in our database */
        res.status(200).json({ success: true, data: peoples });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        if (
          req.body.hasOwnProperty("peopleArray") &&
          Array.isArray(req.body.peopleArray)
        ) {
          const people = await People.insertMany(
            req.body.peopleArray
          ); /* create a new model in the database */
          res.status(201).json({ success: true, data: people });
        } else {
          const people = await People.create(
            req.body
          ); /* create a new model in the database */
          res.status(201).json({ success: true, data: people });
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
