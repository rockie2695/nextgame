import mongoose from "mongoose";

/* IsLandSchema will correspond to a collection in your MongoDB database. */
const Country = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    maxlength: 50,
  },
  name: {
    type: String,
    required: true,
  },
  money: {
    type: Number,
    required: true,
    min: 0,
  },
  food: {
    type: Number,
    required: true,
    min: 0,
  },
});
export default mongoose.models.Country || mongoose.model("Place", Country);
