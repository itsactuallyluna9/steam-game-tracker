"use client"
import React, { useEffect } from "react"

export default function GameList({
    appids
}: {
    appids: Number[]
}) {
    const [names, setNames] = React.useState([{ "appid": 0, "name": "" }])

    useEffect(() => {
        // localhost:5000/lookup/id/<id> -> name

        const fetchNames = async (appid: Number) => {
            const data = await fetch(`http://localhost:5000/lookup/id/${appid}`)
            const res = await data.json()
            return res[0]
        }
        Promise.all(appids.map(appid => fetchNames(appid)))
            .then((names) => setNames(names))
    }, [appids])

    console.log(appids)
    return (
        <ul>
            {names.map((name) => (
                <li key={name.appid}>
                    <a href={`/details/${name.appid}`}>{name.name} <img src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${name.appid}/capsule_231x87.jpg`} /></a>
                </li>
            ))}
        </ul>
    )
}