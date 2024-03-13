// import clientPromise from "../lib/mongodb";
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function Page() {
  const router = useRouter()
  const [players, setPlayers] = useState([]);
  const { pos } = router.query
  useEffect(() => {
    if (pos) {
      fetch(`../api/projections/${pos}`)
        .then(resp => resp.json())
        .then(res => setPlayers(res));
    }
  }, [pos])

  const REPLACEMENT_LEVEL = players.length > 0 && players
    .map(x => x.Points)
    .filter((x, i) => {
      if (i >= 13 && i <= 18) return x
    }).reduce((x, y) => (x + y)) / 6

  console.log(REPLACEMENT_LEVEL)

  return (
    <>
      <h1>Position {pos}</h1>
      <h3>Replacement Level = {fn(REPLACEMENT_LEVEL)}</h3>
      {players.map((player, i) => {
        return (
          <div
            key={player.PlayerId}
            style={{
              display: 'flex',
              justifyContent: 'flex-start'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', width: '40px' }}>

              <div
                style={{ textAlign: 'right' }}
              >{i + 1}</div>
            </div>
            <div
              style={{ width: '170px' }}
            >
              <a
                href={`http://www.fangraphs.com/statss.aspx?playerid=${player.PlayerId}`}
                target='_blank'
              >
                {player.Name}
              </a>
            </div>
            <div
              style={{ width: '150px' }}
            >{player.POS}</div>
            <div
              style={{ width: '50px' }}
            >{player.Team}</div>
            <div
              style={{ width: '50px', textAlign: 'right' }}
            >{fn(player.Points)}</div>
            <div
              style={{ width: '50px', textAlign: 'right' }}
            >{fn(player.PointAverage)}</div>
            <div
              style={{ width: '60px', textAlign: 'right' }}

            >
              {fn(player.Points - REPLACEMENT_LEVEL)}
            </div>
          </div>
        )
      })}
    </>
  )
}

const fn = (str) => {
  return Number(str).toFixed(2)
}