import clientPromise from "../../../lib/mongodb";

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
      .limit(100)
      .toArray();

    res.json(projections);
  } catch (e) {
    console.error(e);
  }
};