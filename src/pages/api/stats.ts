import { connectToDatabase } from "../../lib/mongodb";

export default async function handler(request: any, response: any) {
  const { database } = (await connectToDatabase()) as any;
  const collection = database.collection(
    process.env.NEXT_ATLAS_COLLECTION_PASSENGER 
  );
  const { age, survived, pclass, sex } = request.body;

  const results = await collection
    .find({
        Age: {$gt: age.min, $lt: age.max},
        Survived: survived,
        Pclass: pclass,
        Sex: sex
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
    .limit(10)
    .toArray();

  response.status(200).json(results);
}