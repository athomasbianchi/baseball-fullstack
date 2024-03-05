import clientPromise from "../../lib/mongodb";

export default async (req, res) => {
  // console.log(req.json());
  if (req.method === 'POST') {
    try {
      const client = await clientPromise;
      const db = client.db("baseball");
      console.log(req.body)
      // await db
      //   .collection("contracts")
      //   .insertOne({
      //     team: 'YB',
      //     player: 'Tom',
      //     faid: '123',
      //     years: 2,
      //     dollars: 1.24,
      //     type: 'major'
      //   })

      res.status(201).json({ message: 'worked' })
    } catch (e) {
      res.status(500).json({ message: 'error' })
      console.error(e);
    }
  }


};