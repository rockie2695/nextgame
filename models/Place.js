import mongoose from "mongoose";

/* IsLandSchema will correspond to a collection in your MongoDB database. */
const Place = new mongoose.Schema({
  island: {
    type: mongoose.ObjectId,
  },
  num: {
    type: Number,
  },
});
export default mongoose.models.Place || mongoose.model("Place", IsLand);
