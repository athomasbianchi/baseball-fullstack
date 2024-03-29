import clientPromise from "../../lib/mongodb";

export default async (req, res) => {
  // console.log(req.json());
  if (req.method === 'POST') {
    try {
      const client = await clientPromise;
      const db = client.db("baseball");
      const { team, Name, FangraphsId, dollars, type, years} = JSON.parse(req.body);
      await db
        .collection("contracts")
        .insertOne({
          team: team,
          Name: Name,
          FangraphsId: FangraphsId,
          years: years,
          dollars: dollars,
          type: type
        });

      res.status(201).json({ message: 'worked' })
    } catch (e) {
      res.status(500).json({ message: 'error' })
      console.error(e);
    }
  } else {
    res.status(300).json({ message: 'no other methods yet'})
  }
};