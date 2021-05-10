import mongoose from "mongoose";

/* IsLandSchema will correspond to a collection in your MongoDB database. */
const IsLand = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    maxlength: 50,
  },
  name: {
    type: String,
    required: true,
    maxlength: 10,
  },
  placeNum: {
    type: Number,
    required: true,
  },
});
export default mongoose.models.IsLand || mongoose.model("IsLand", IsLand);
