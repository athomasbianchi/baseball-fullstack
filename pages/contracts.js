import clientPromise from "../lib/mongodb";
import { useState } from 'react';

export async function getServerSideProps() {
  try {
    const client = await clientPromise;
    const db = client.db("baseball");
    const contracts = await db
      .collection("contracts")
      .find({})
      // .sort({ Name: 1 })
      .limit(20)
      .toArray();

    const hitters = await db
      .collection('projections')
      .find({})
      .limit(700)
      .toArray();

    return {
      props:{
        contracts: JSON.parse(JSON.stringify(contracts)),
        hitters: JSON.parse(JSON.stringify(hitters))
      },
    };
  } catch (e) {
    console.error(e);
    return {
      props: {
        contracts: [],
        hitters : []
      }
    };
  }
}

const TEAMS = [
  {
    name: 'Young Bucks',
    abbr: 'yb',
  },
  {
    name: 'Orlando Renegades',
    abbr: 'or',
  },
  {
    name: 'Dip City Thunder',
    abbr: 'dct',
  },
  {
    name: 'Country Strong',
    abbr: 'cs',
  },
  {
    name: 'Springfield Zephyrs',
    abbr: 'sz',
  },
  {
    name: 'West Coast Spartans',
    abbr: 'wcs',
  },
  {
    name: 'Cheating Raiders',
    abbr: 'cr',
  },
  {
    name: 'Bayou Shooters',
    abbr: 'bs',
  },
  {
    name: 'Ryno World',
    abbr: 'rw',
  },
  {
    name: 'Structure Fire',
    abbr: 'sf',
  },
  {
    name: 'Detroit Nittany Tide',
    abbr: 'dnt'
  },
  {
    name: 'Midtown Jaguars',
    abbr: 'mj'
  }
]

export default function Page({ contracts }) {
  const [team, setTeam] = useState(TEAMS.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  })[0])

  return (
    <main>
      <div>
        <h1>Add Contract</h1>
        <select
          name="team"
          id="team"
          value={team}
          onChange={e => setTeam(e.target.value)}
        >
          {TEAMS
            .sort((a, b) => {
              if (a.name < b.name) {
                return -1;
              }
              if (a.name > b.name) {
                return 1;
              }
              return 0;
            })
            .map(team => (
              <option key={team.abbr} value={team.abbr}>{team.name}</option>
            ))}
        </select>
        <button
          onClick={() => {
            console.log('submit');
          }}
        ></button>
      </div>
      <div>
        {contracts.map(contract => {
          console.log(contract);
          return (
            <p>{contract.team} {contract.player} {contract.years} {contract.dollars}</p>
          )
        })}
      </div>
    </main>
  );
}