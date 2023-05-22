import { Schema, SchemaTypes, Types, model } from "mongoose";

const userSchema = Schema(
  {
    _id: { type: SchemaTypes.ObjectId, default: () => new Types.ObjectId() },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, require: true },
  }
  // { versionKey: false } // Permet de supprimer le "__v" si besoin
);

const collectionName = "Users";
export default model("Titanic", userSchema, collectionName);
