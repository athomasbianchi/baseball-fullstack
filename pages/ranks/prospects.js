import clientPromise from "../../lib/mongodb";

export async function getServerSideProps() {
  try {
    const client = await clientPromise;
    const db = client.db("baseball");
    const prospects = await db
      .collection('prospects')
      .find({})
      // .sort({ Name: 1 })
      .limit(300)
      .toArray();

      return {
        props: {
          prospects: JSON.parse(JSON.stringify(prospects)),
        }
      }
  } catch (e) {
    console.error(e)
    return {
      props: {
        prospects: []
      }
    };
  }
}

export default function Page({ prospects }) {

  console.log(prospects)
  return (
    <div>
      {prospects.map((prospect, i) => {
        return (
          <div>{i + 1} {prospect.Name} {prospect.FV} {fn(prospect.Age)} {prospect.ETA}</div>
          )
      })}
    </div>
  );
}

// todo extract to utils
const fn = (str, num=2) => {
  return Number(str).toFixed(num)
}