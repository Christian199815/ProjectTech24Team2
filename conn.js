import { MongoClient } from "mongodb";
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=CMD`;
const client = new MongoClient(uri);
let conn;
try {
  conn = await client.connect();
} catch(e) {
  console.error(e);
}
let db = conn.db(`${process.env.DB_NAME}`);
export default db;