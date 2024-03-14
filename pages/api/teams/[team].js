import clientPromise from "../../../lib/mongodb";

// const limit = {
//   'SP': 300,
//   'OF': 100,
// }

export default async (req, res) => {
  console.log(req.query);
  try {
    const client = await clientPromise;
    const db = client.db("baseball");
    const team = req.query.team.toLowerCase();
    const collection = 'contracts'
    const projections = await db
      .collection(collection)
      .find(
        { "team": team }
      )
      .limit(50)
      .toArray();

    res.json(projections);
  } catch (e) {
    console.error(e);
  }
};