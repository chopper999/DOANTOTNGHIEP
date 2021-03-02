import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, dropDups: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    isSeller: { type: Boolean, default: false, required: true },
  },
  {
    timestamps: true
  }
);

const userModel = mongoose.model("User", userSchema);

export default userModel;
