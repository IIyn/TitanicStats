import { connectToDatabase } from "../../lib/mongodb";

export default async function handler(request: any, response: any) {
  const { email, password } = request.body;
  const { database } = (await connectToDatabase()) as any;
  const collection = database.collection(
    process.env.NEXT_ATLAS_COLLECTION_USERS
  );

  const results = await collection
    .find({ email, password })
    .project({
      _id: 1,
      name: 1,
      email: 1,
      password: 1,
    })
    .toArray();

  response.status(200).json(results);
}
