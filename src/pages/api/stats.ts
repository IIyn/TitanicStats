import { connectToDatabase } from "../../lib/mongodb";
const jwt = require("jsonwebtoken");

export default async function handler(request: any, response: any) {
  try {
    const { database } = (await connectToDatabase()) as any;

    const collection = database.collection(
      process.env.NEXT_ATLAS_COLLECTION_PASSENGER
    );

    const bearerToken = request.headers.authorization.split(" ")[1];

    if (!bearerToken) {
      response.status(401).json({ message: "Unauthorized" });
      return;
    }

    try {
      const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET_KEY);
      request.user = decoded;
    } catch (err) {
      response.status(401).json({ message: "Invalid token" });
    }

    const { age, pclass, sex } = request.body;

    // validate types and values
    if (
      typeof age.min !== "number" ||
      typeof age.max !== "number" ||
      typeof pclass !== "number" ||
      typeof sex !== "string"
    ) {
      response.status(400).json({ message: "Bad Request" });
      return;
    } else {
      const results = await collection
        .find({
          Age: { $gt: age.min, $lt: age.max },
          Pclass: pclass,
          Sex: sex,
        })
        .project({
          _id: 1,
          PassengerId: 1,
          Survived: 1,
          Pclass: 1,
          Name: 1,
          Sex: 1,
          Age: 1,
        })
        .toArray();

      response.status(200).json(results);
    }
  } catch (err) {
    console.error("Une erreur s'est produite :", err);
    response.status(500).json({ message: "Une erreur s'est produite" });
  }
}
