"use client";
import humanizeDuration from 'humanize-duration';
import React from 'react';

export default function DetailsPage({
  params
}: {
  params: {
    appid: string
  }
}) {

  const appId = Number(params.appid);
  
  const [appName, setAppName] = React.useState('Cities: Skylines');
  const [debugData, setDebugData] = React.useState([]);
  const [appData, setAppData] = React.useState({
    developers: ['Paradox Interactive'],
    publishers: ['KOMODO'],
    release_date: {
      date: "Loading..."
    },
    short_description: "Loading..."
  });
  const [gameStatus, setGameStatus] = React.useState('Playing'); // Planned, Playing, Completed, Abandoned, Paused
  const [timePlayed, setTimePlayed] = React.useState(0); // in seconds

  const fetchData = async () => {
    // if appName consists of a number, set appId to appName
    if (!isNaN(Number(appName))) {
      setAppId(Number(appName))
      return
    }
    try {
      const res = await fetch("http://localhost:5000/games")
      const data = await res.json()
      const apps = data.filter((app) => app.name === appName).reverse()
      const includeApps = data.filter((app) => app.name.includes(appName)).reverse()
      console.log({apps, includeApps})
      if (apps[0] === undefined) {
        console.error('App not found')
        // includeApps is a list
        let obj = {
          name: 'App not found',
          appid: -1
        }
        includeApps.unshift(obj)
        setDebugData(includeApps)
        setAppId(-1)
        return
      }
      setDebugData(includeApps)
      setAppId(apps[0].appid)
    } catch (e) {
      console.error(e)
    }
  }
  
  const fetchAppData = async (appid: Number) => {
    const data = await fetch(`http://localhost:5000/games/${appid}`)
    const res = await data.json()
    setAppData(res[appid.toString()].data)
  }

  React.useEffect(() => {
    fetchAppData(appId)
  }, [appId])

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-between"
    >
      <div
        className='w-full bg-cover bg-center bg-no-repeat lg:h-[620px] h-[310px]'
        style={
          {
            backgroundImage: `url(https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/library_hero.jpg)`
          }
        }
      >
        {/* center img */}
        <div className='flex items-center justify-center h-full'>
          <img
            className='w-1/2 hover:opacity-0 transition'
            src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/logo.png`}
          />
        </div>
      </div>
      <h1 className="text-4xl m-2 font-bold text-center dark:text-white text-black">{appName}</h1>
      <div className='md:m-8 md:p-8 p-4 rounded-2xl text-white bg-gradient-to-tr from-slate-800 to-slate-600'>
        <div className='flex justify-between text-center'>
          <div className='px-8 border-r border-slate-600'>
            <h2 className='text-lg font-bold'>Status</h2>
            {/* dropdown */}
            <select
              className="bg-inherit text-blue-300 p-2"
              value={gameStatus}
              onChange={(event) => setGameStatus(event.target.value)}
            >
              <option value="Planned">Planned</option>
              <option value="Playing">Playing</option>
              <option value="Completed">Completed</option>
              <option value="Abandoned">Abandoned</option>
              <option value="Paused">Paused</option>
            </select>
          </div>
          <div className='px-8 border-r border-slate-600'>
            <h2 className='text-lg font-bold'>Time Played</h2>
            <p>{humanizeDuration(timePlayed * 1000, { round: true })}</p>
            {/* textbox to edit timeplayed */}
            <input
              type="text"
              className="border border-slate-300 p-2 text-black"
              value={timePlayed}
              onChange={(event) => setTimePlayed(Number(event.target.value))}
              placeholder="Enter time played in seconds"
            />
          </div>
          <div className='px-8'>
            <h2 className='text-lg font-bold'>Achievements</h2>
            <p>2/8</p>
          </div>
        </div>
        <div className='p-8'>
          <h2 className='text-lg font-bold'>Details</h2>
          <p>App ID: {appId}</p>
          <p>Release Date: {appData.release_date.date}</p>
          <p>Developer: {appData.developers[0]}</p>
          <p>Publisher: {appData.publishers[0]}</p>
        </div>
        <div className='p-8'>
          <h2 className='text-lg font-bold'>About</h2>
          <p>{appData.short_description}</p>
        </div>
        {/* open in steam button */}
        <button
          className="border border-slate-300 p-2"
          onClick={() => {
            window.open(`steam://run/${appId}`, '_blank')
          }}
        >
          Open in Steam
        </button>

      </div>
      <div className='p-4'>
        {/* input field for the app's name and a submit button */}
        <input
          type="text"
          className="border border-slate-300 p-2 text-black"
          value={appName}
          onChange={(event) => setAppName(event.target.value)}
          placeholder="Enter app name or ID"
          // on enter, fetch data
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              fetchData()
            }
          }}
        />
        <button
          className="border border-slate-300 p-2"
          onClick={fetchData}
        >
          Search
        </button>
      </div>
      {/*  */}
      
        {/* <img src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/capsule_231x87.jpg`} />
        <img src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/header.jpg`} />
        <img src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/library_hero.jpg`} /> */}

        {/* print debug (a list of ?) */}
        {/* <ul>
          {debugData.map((app, index) => {
            if (app.appid === appId) {
              return (
                <li key={index} className="font-bold text-red-700">{app.name} - {app.appid}</li>
              )

            }
            return (
              <li key={index}>{app.name} - {app.appid}</li>
            )
          })}
        </ul>
        <p>{JSON.stringify(appData)}</p> */}
    </main>
  )
}
