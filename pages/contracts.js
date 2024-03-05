import clientPromise from "../lib/mongodb";
import { useState } from 'react';

// todo select player from dropdown
// todo clean up player list csv (python, pandas?)
// todo clean up projection csv (python, pandas?)
// todo determine simple database schema

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
      .collection('hitter_projections')
      .find({})
      .limit(300)
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

TEAMS.sort((a, b) => {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
});

export default function Page({ contracts }) {
  const [team, setTeam] = useState(TEAMS[0].abbr);
  const [years, setYears] = useState(1);

  const handleSelect = (e) => {
    console.log(e.target.value);
    setTeam(e.target.value);
  }

  return (
    <main>
      <div>
        <h1>Add Contract</h1>
        <div>
        <label htmlFor="team">Team</label>
        <select
          name="team"
          id="team"
          value={team}
          onChange={e => handleSelect(e)}
        >
          {TEAMS
            .map(team => (
              <option key={team.abbr} value={team.abbr}>{team.name}</option>
            ))}
        </select>
        </div>
        <label htmlFor="player">Player</label>
        <input type="text" id="player"/>
        <label htmlFor="years">Years</label>
        <input  
          type="number"
          id="years"
          min="1"
          step="1"
          value={years}
          onChange={e => setYears(e.target.value)}
        />
        <button
          onClick={() => {
            console.log({
              team,
              years
            });
          }}
        >
          Submit
        </button>
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