import clientPromise from "../../lib/mongodb";

export default async (req, res) => {
  console.log(req.query);
  try {
    const client = await clientPromise;
    const db = client.db("baseball");

    const projections = await db
      .collection("hitter_projections")
      .find({})
      .limit(100)
      .toArray();

    res.json(projections);
  } catch (e) {
    console.error(e);
  }
};