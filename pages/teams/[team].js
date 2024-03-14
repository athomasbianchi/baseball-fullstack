import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const lookup = {
  'youngbucks': 'yb',
  'bucks': 'yb'
}

export default function Page() {
  const router = useRouter();
  const [players, setPlayers] = useState([]);
  const { team } = router.query;
  console.log(team);
  // todo fetch with api
  useEffect(() => {
    if (team) {
      fetch(`../api/teams/${team}`)
        .then(resp => resp.json())
        .then(res => setPlayers(res))
    }
  }, [team])

  return (
    <main>
      <h1>{lookup[team] || team}</h1>
      {players.map(x => {
        return (<div>{x.Name}</div>)
      })}
    </main>
  )
}