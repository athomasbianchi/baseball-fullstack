import clientPromise from "../lib/mongodb";

export async function getServerSideProps() {

  try {
    const client = await clientPromise;
    const db = client.db("baseball");
    const projections = await db
      .collection("projections")
      .find({})
      .sort({ Name: 1 })
      .limit(20)
      .toArray();
    return {
      props: { projections: JSON.parse(JSON.stringify(projections)) },
    };
  } catch (e) {
    console.error(e);
    return { props: { projection: [] } };
  }
}

export default function Page({ projections }) {
  console.log(projections);
  return (
    <main>
      {projections.map(player => {
        return (
          <p>{player.Name}</p>
        );
      })}
    </main>
  )
}