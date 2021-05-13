import mongoose from "mongoose";

/* IsLandSchema will correspond to a collection in your MongoDB database. */
const People = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "`{PATH}` is required. Receive `{VALUE}`"],
    maxlength: [50, "maxlength of `{PATH}` is 50. Receive `{VALUE}`"],
  },
  name: {
    type: String,
    required: [true, "`{PATH}` is required. Receive `{VALUE}`"],
  },
  country_id: {
    type: mongoose.ObjectId,
    required: [true, "`{PATH}` is required. Receive `{VALUE}`"],
  },
});
export default mongoose.models.People || mongoose.model("People", People);
