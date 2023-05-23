import { connectToDatabase } from "../../lib/mongodb";

export default async function handler(request: any, response: any) {
  const { database } = (await connectToDatabase()) as any;
  const collection = database.collection(
    process.env.NEXT_ATLAS_COLLECTION_USERS
  );

  const results = await collection
    .find({})
    .project({
      _id: 1,
      name: 1,
      email: 1,
      password: 1,
    })
    //.limit(10)
    .toArray();

  response.status(200).json(results);
}
