"use client"
import React, { useEffect } from "react"

export default function GameList({
    appids,
    listener,
    buttonName = "Action"
}: {
    appids: Number[],
    listener: (appid: Number) => void,
    buttonName?: String
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
    return (
        <ul>
            {names.map((name) => (
                <li key={name.appid}>
                    <div className="flex space-x-4 items-center m-2">
                        <div className="flex space-x-4 items-center bg-slate-600 rounded-xl hover:bg-slate-500 transition border-blue-300 border-2">
                            <a href={`/details/${name.appid}`} className="pl-2 text-white">{name.name}</a>
                            <a href={`/details/${name.appid}`} className="hover:sepia transition"><img src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${name.appid}/capsule_231x87.jpg`} className="rounded-r-2xl"/></a>
                        </div>
                        <button onClick={() => listener(name.appid)} className="hover:bg-purple-400 transition bg-purple-500 rounded text-white p-2">{buttonName}</button>
                    </div>
                </li>
            ))}
        </ul>
    )
}