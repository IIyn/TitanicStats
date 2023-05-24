import { connectToDatabase } from "../../lib/mongodb";
const bcrypt = require("bcrypt");

export default async function handler(request: any, response: any) {
  const { name, email, password } = request.body;
  try {
    const { database } = (await connectToDatabase()) as any;
  const collection = database.collection(
    process.env.NEXT_ATLAS_COLLECTION_USERS
  );

  const existingUser = await collection.findOne({ email });
  if (existingUser) {
    return response
      .status(409)
      .json({ message: "Cet utilisateur existe déjà" });
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const newUser = { name, email, password: hashedPassword };
  const results = await collection.insertOne(newUser);

  response.status(200).json(results);
  } catch (err) {
    console.error("Une erreur s'est produite :", err);
    response.status(500).json({ message: "Une erreur s'est produite" });
  }
  
}
