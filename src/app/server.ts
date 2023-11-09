'use server';
// i'm using the cursed thing!

export async function fetchAppDataSer(appid: Number) {
    console.log('hi from server!')
    const res = await fetch(`https://store.steampowered.com/api/appdetails?appids=${appid}`)
    const data = await res.json()
    return data
}

export async function fetchAppListSer() {
    console.log('hi from server! (app list)')
    return 'hello from server!'
}