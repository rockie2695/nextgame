import mongoose from "mongoose";

/* IsLandSchema will correspond to a collection in your MongoDB database. */
const IsLandSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    maxlength: 50,
  },
});
export default mongoose.models.IsLandSchema ||
  mongoose.model("IsLandSchema", IsLandSchema);
