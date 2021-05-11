import mongoose from "mongoose";

/* IsLandSchema will correspond to a collection in your MongoDB database. */
const Place = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    maxlength: 50,
  },
  island: {
    type: mongoose.ObjectId,
    required: true,
  },
  num: {
    type: Number,
    required: true,
  },
});
export default mongoose.models.Place || mongoose.model("Place", Place);
