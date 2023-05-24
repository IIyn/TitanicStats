import { connectToDatabase } from "../../lib/mongodb";

export default async function handler(request: any, response: any) {
  try {
    const { database } = (await connectToDatabase()) as any;

  const collection = database.collection(
    process.env.NEXT_ATLAS_COLLECTION_PASSENGER
  );
  const { age, pclass, sex } = request.body;

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
  } catch (err) {
    console.error("Une erreur s'est produite :", err);
    response.status(500).json({ message: "Une erreur s'est produite" });
  }
  
}
