import mongoose from "mongoose";

/* IsLandSchema will correspond to a collection in your MongoDB database. */
const Place = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "`{PATH}` is required. Receive `{VALUE}`"],
    maxlength: [50, "maxlength of `{PATH}` is 50. Receive `{VALUE}`"],
  },
  world: {
    type: mongoose.ObjectId,
    required: [true, "`{PATH}` is required. Receive `{VALUE}`"],
  },
  num: {
    type: Number,
    required: [true, "`{PATH}` is required. Receive `{VALUE}`"],
  },
  roadTo: {
    type: Array,
    required: [true, "`{PATH}` is required. Receive `{VALUE}`"],
  },
});
export default mongoose.models.Place || mongoose.model("Place", Place);
