import mongoose from "mongoose";

/* IsLandSchema will correspond to a collection in your MongoDB database. */
const Country = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "`{PATH}` is required. Receive `{VALUE}`"],
    maxlength: [50, "maxlength of `{PATH}` is 50. Receive `{VALUE}`"],
  },
  name: {
    type: String,
    required: [true, "`{PATH}` is required. Receive `{VALUE}`"],
  },
  money: {
    type: Number,
    required: [true, "`{PATH}` is required. Receive `{VALUE}`"],
  },
  food: {
    type: Number,
    required: [true, "`{PATH}` is required. Receive `{VALUE}`"],
  },
  country_num: {
    //for same email,different country
    type: Number,
    required: [true, "`{PATH}` is required. Receive `{VALUE}`"],
  },
});
export default mongoose.models.Country || mongoose.model("Country", Country);
