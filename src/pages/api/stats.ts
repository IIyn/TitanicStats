import { connectToDatabase } from "../../lib/mongodb";

export default async function handler(request: any, response: any) {
  const { database } = (await connectToDatabase()) as any;
  const collection = database.collection(
    process.env.NEXT_ATLAS_COLLECTION_PASSENGER
  );

  const results = await collection
    .find({})
    .project({
      _id: 1,
      PassengerId: 1,
      Survived: 1,
      Pclass: 1,
      Name: 1,
      Sex: 1,
      Age: 1,
      SibSp: 1,
      Parch: 1,
      Ticket: 1,
      Fare: 1,
      Embarked: 1
    })
    .limit(10)
    .toArray();

  response.status(200).json(results);
}