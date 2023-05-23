import { connectToDatabase } from "../../lib/mongodb";

export default async function handler(request: any, response: any) {
  const { name, email, password } = request.body;
  const { database } = (await connectToDatabase()) as any;
  const collection = database.collection(
    process.env.NEXT_ATLAS_COLLECTION_USERS
  );

  const existingUser = await collection.findOne({ email });
  if (existingUser) {
    return response.status(409).json({ message: 'Cet utilisateur existe déjà' });
  }

  const newUser = {name, email, password}; 
  const results = await collection
    .insertOne(newUser)
    
  response.status(200).json(results);
}
