import clientPromise from "../../../lib/mongodb";

const limit = {
  'SP' : 300,
  'OF' : 100,
}

export default async (req, res) => {
  console.log(req.query);
  try {
    const client = await clientPromise;
    const db = client.db("baseball");
    const pos = req.query.pos.toUpperCase();
    const collection = pos === 'SP' || pos === 'RP' ? 'pitcher_projections' : 'hitter_projections';
    console.log(collection);
    const projections = await db
      .collection(collection)
      .find(
        { "POS": { $regex: pos } }
      )
      .limit(limit[pos] || 50)
      .toArray();

    res.json(projections);
  } catch (e) {
    console.error(e);
  }
};