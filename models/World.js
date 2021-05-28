import mongoose from "mongoose";

/* IsLandSchema will correspond to a collection in your MongoDB database. */
const World = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "`{PATH}` is required. Receive `{VALUE}`"],
    maxlength: [50, "maxlength of `{PATH}` is 50. Receive `{VALUE}`"],
  },
  name: {
    type: String,
    required: [true, "`{PATH}` is required. Receive `{VALUE}`"],
    maxlength: [10, "maxlength of `{PATH}` is 10. Receive `{VALUE}`"],
  },
  placeNum: {
    type: Number,
    required: [true, "`{PATH}` is required. Receive `{VALUE}`"],
  },
  controlPeople: {
    type: Array,
    required: [true, "`{PATH}` is required. Receive `{VALUE}`"],
  },
  directControl: {
    type: Boolean,
    required: [true, "`{PATH}` is required. Receive `{VALUE}`"],
  },
});
export default mongoose.models.World || mongoose.model("World", World);
