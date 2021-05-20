import dbConnect from "../../utils/dbConnect";
import World from "../../models/World";

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const worlds = await World.find(
          req.query
        ); /* find all the data in our database */
        res.status(200).json({ success: true, data: worlds });
      } catch (error) {
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
