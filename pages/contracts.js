import clientPromise from "../lib/mongodb";
import { useState } from 'react';
import { Combobox } from "@headlessui/react";
import { TEAMS, TEAM_LOOKUP } from "../data/teams";

// todo select player from dropdown
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
      .limit(700)
      .toArray();

    const pitchers = await db
      .collection('pitcher_projections')
      .find({})
      .limit(700)
      .toArray();

    return {
      props: {
        contracts: JSON.parse(JSON.stringify(contracts)),
        hitters: JSON.parse(JSON.stringify(hitters)),
        pitchers: JSON.parse(JSON.stringify(pitchers))
      },
    };
  } catch (e) {
    console.error(e);
    return {
      props: {
        contracts: [],
        hitters: [],
        pitchers: [],
      }
    };
  }
}

export default function Page({ contracts, hitters, pitchers }) {
  const [team, setTeam] = useState(TEAMS[0].abbr);
  const [years, setYears] = useState(1);
  const [player, setPlayer] = useState(null);
  const [dollars, setDollars] = useState(1.00);
  const [type, setType] = useState('contract')

  const handleSubmit = () => {

    const data = {
      team,
      years,
      Name: player.Name,
      FangraphsId: player.FangraphsId,
      dollars,
      type
    }

    fetch(`../api/contract`, {
      method: 'POST',
      body: JSON.stringify(data)
    }).then(resp => console.log(resp.json()))
  }

  return (
    <main>
      <div>
        <h1>Add Contract</h1>
        <label htmlFor="team">Team</label>
        <select
          name="team"
          id="team"
          value={team}
          onChange={(e) => setTeam(e.target.value)}
        >
          {TEAMS
            .map(team => (
              <option key={team.abbr} value={team.abbr}>{team.name}</option>
            ))}
        </select>
        <PlayerSelect
          hitters={hitters}
          pitchers={pitchers}
          handlePlayer={setPlayer}
          player={player}
        />
        <label htmlFor="years">Years</label>
        <input
          type="number"
          id="years"
          min="1"
          step="1"
          value={years}
          onChange={e => setYears(e.target.value)}
        />
        <label htmlFor="dollars">Dollars</label>
        <input
          type="number"
          id="dollars"
          min="1"
          step=".01"
          value={dollars}
          onChange={e => setDollars(e.target.value)}
        />
        <label htmlFor="type">Type</label>
        <select
          name="type"
          id="type"
          value={type}
          onChange={e => setType(e.target.value)}
        >
          <option key={'mlb'} value={'mlb'}>MLB</option>
          <option key={'aa'} value={'aa'}>AA</option>
          <option key={'aaa'} value={'aaa'}>AAA</option>
          <option key={'rookie'} value={'rookie'}>@</option>
          <option key={'arb1'} value={'arb1'}>Arb1</option>
          <option key={'arb2'} value={'arb2'}>Arb2</option>
          <option key={'arb3'} value={'arb3'}>Arb3</option>
        </select>
        <button
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
      <div>
        {contracts.map(contract => {
          console.log(contract);
          return (
            <p>
              {TEAM_LOOKUP[contract.team]} {contract.Name} {contract.type} {contract.years} {contract.dollars}
            </p>
          )
        })}
      </div>
      <div
        style={{
          display: 'flex'
        }}
      >

        <div>
          {pitchers.map(x => {
            return (<div key={x.FangraphsId}> {x.Name} {x.POS} {x.Points}</div>)
          })}
        </div>
        <div>
          {hitters.map(x => {
            return (<div key={x.FangraphsId}> {x.Name} {x.POS} {x.Points}</div>)
          })}
        </div>
      </div>
    </main>
  );
}

const removeDiacritics = (str) => {
  return str.normalize("NFD").toLowerCase().replace(/[\u0300-\u036f]/g, "")
}

const PlayerSelect = ({ hitters, pitchers, handlePlayer, player }) => {
  console.log(player);
  // const [selectedPlayer, setSelectedPlayer] = useState('');
  const [query, setQuery] = useState('');
  // console.log(selectedPlayer);
  const players = [...hitters, ...pitchers];
  const filteredPlayers =
    query.length < 3
      ? []
      : players.filter((player) => {
        return removeDiacritics(player.Name).includes(query.toLowerCase())
      });

  const handleSelectedPlayer = (player) => {
    console.log(player);
    handlePlayer(player);
  }

  return (
    <Combobox value={player} onChange={handleSelectedPlayer}>
      <Combobox.Label>Player</Combobox.Label>
      <Combobox.Input
        displayValue={(player) => player && player.Name}
        onChange={(event) => setQuery(event.target.value)}
      />
      <Combobox.Options>
        {filteredPlayers.map((player) => (
          <Combobox.Option key={player.FangraphsId} value={player}>
            {player.Name}
          </Combobox.Option>
        ))}
      </Combobox.Options>
    </Combobox>
  )

}