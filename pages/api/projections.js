import clientPromise from "../../lib/mongodb";

export default async (req, res) => {
  console.log(req);
  try {
    const client = await clientPromise;
    const db = client.db("baseball");

    const projections = await db
      .collection("projections")
      .find({})
      // .sort({ metacritic: -1 })
      .limit(100)
      .toArray();

    res.json(projections);
  } catch (e) {
    console.error(e);
  }
};