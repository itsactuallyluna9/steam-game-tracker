"use client";
import humanizeDuration from 'humanize-duration';
import React from 'react';
import { ImageHeader } from '../../../components/imageHeader';
import useStateLocalStorage from '@/utils/useStateLocalStorage';
import UseClient from '@/utils/useClient';

export default function DetailsPage({
  params
}: {
  params: {
    appid: string
  }
}) {

  const appId = Number(params.appid);

  const [appName, setAppName] = React.useState('Loading..!');
  const [appData, setAppData] = React.useState({
    developers: ['Loading...'],
    publishers: ['Loading...'],
    release_date: {
      date: "Loading..."
    },
    short_description: "Loading..."
  });
  const [gameStatus, setGameStatus, _unused1] = useStateLocalStorage('Unknown', `${appId}-gamestatus`); // Planned, Playing, Completed, Abandoned, Paused
  const [timePlayed, setTimePlayed, _unused2] = useStateLocalStorage(0, `${appId}-timeplayed`); // in seconds

  const fetchAppData = async (appid: Number) => {
    const data = await fetch(`http://localhost:5000/games/${appid}`)
    const res = await data.json()
    setAppName(res[appid.toString()].data.name)
    setAppData(res[appid.toString()].data)
  }

  React.useEffect(() => {
    fetchAppData(appId)
  }, [appId])

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-between"
    >
      <ImageHeader appId={appId} />
      <h1 className="text-4xl m-2 font-bold text-center dark:text-white text-black">{appName}</h1>
      <UseClient>
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
                <option value="Unknown" disabled>Unknown</option>
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
          <div className='p-8 max-w-2xl'>
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
      </UseClient>
      <a href='/' className='text-blue-300 hover:underline'>Back to Home</a>
    </main>
  )
}

