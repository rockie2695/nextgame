import dbConnect from "../../../utils/dbConnect";
import World from "../../../models/World";

export default async function handler(req, res) {
  const {
    method,
    query: { id },
  } = req;

  await dbConnect();
  switch (method) {
    case "PUT":
      try {
        const world = await World.findByIdAndUpdate(id, req.body, {
          new: false,
          runValidators: true,
        });
        if (!world) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: world });
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
