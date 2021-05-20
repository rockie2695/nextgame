import dbConnect from "../../utils/dbConnect";
import World from "../../models/World";

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
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
