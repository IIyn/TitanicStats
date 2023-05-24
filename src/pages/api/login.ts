import { connectToDatabase } from "../../lib/mongodb";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

export default async function handler(request: any, response: any) {
  const { email, password } = request.body;
  try {
    const { database } = (await connectToDatabase()) as any;
    const collection = database.collection(
      process.env.NEXT_ATLAS_COLLECTION_USERS
    );

    const user = await collection.findOne({ email });
    if (!user) {
      return response
        .status(401)
        .json({ message: "Mot de passe ou email invalide" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return response
        .status(401)
        .json({ message: "Mot de passe ou email invalide" });
    }

    const token = jwt.sign({ name: user.name }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    response.status(200).json({ token });
  } catch (err) {
    console.error("Une erreur s'est produite :", err);
    response.status(500).json({ message: "Une erreur s'est produite" });
  }
}
