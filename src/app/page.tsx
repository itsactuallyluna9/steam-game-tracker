"use client";
import GameList from "@/components/gameList";
import useStateLocalStorage from "@/utils/useStateLocalStorage";
import React, { useEffect } from "react";

export default function HomePage() {
    const [search, setSearch] = React.useState('')
    const [currentSearch, setCurrentSearch] = React.useState('')
    const [searchResults, setSearchResults] = React.useState<{appid: number, name: string}[]>([])

    const [favorites, setFavorites, _unused] = useStateLocalStorage([367520, 420530, 1687950, 753640], 'favorites');

    useEffect(() => {
        const timeout = setTimeout(() => setCurrentSearch(search), 500)
        return () => clearTimeout(timeout)
    }, [search])

    useEffect(() => {
        // localhost:5000/lookup/name/<name> -> id
        if (currentSearch.length < 3) return
        const fetchIds = async (name: String) => {
            const data = await fetch(`http://localhost:5000/lookup/name/${name}`)
            const res = await data.json()
            return res.slice(0, 10)
        }
        fetchIds(currentSearch)
            .then((results) => setSearchResults(results))
    }, [currentSearch])

    function removeFavorite(appid: Number) {
        setFavorites(favorites.filter((id: Number) => id !== appid))
    }

    function addFavorite(appid: Number) {
        setFavorites([...favorites, appid])
    }

    return (
        <div className="page">
        {/* title */}
        <h1 className="text-4xl text-center">Steam Game Search</h1>
        
        <GameList appids={favorites} listener={removeFavorite} buttonName={"Remove from Favorites"}/>
        {/* search */}
        <input
            className="bg-inherit text-black dark:text-white dark:border-white p-2 border-black border-2 rounded-md m-2"
            type="text"
            value={search}
            placeholder="Search"
            onChange={(event) => setSearch(event.target.value)}
        />
        {/* results, if search is over 2 characters */}
        {search.length > 2 && <GameList appids={searchResults.map((result: any) => result.appid)} listener={addFavorite} buttonName={"Add to Favorites"}/>}
        </div>
    )
}