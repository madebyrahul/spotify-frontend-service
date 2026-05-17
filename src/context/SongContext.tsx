import axios from "axios"
import {createContext, useCallback, useContext, useEffect, useState, type ReactNode} from "react"

const server = "http://56.228.32.50:8000"

export interface Song{
    id: string,
    title: string,
    description: string,
    audio: string,
    thumbnail: string,
    album: string,
}

export interface Album{
    id: string,
    title: string,
    description: string,
    thumbnail: string,
}

interface SongContextType{
    songs: Song[],
    isPlaying: boolean,
    setIsPlaying: (value : boolean) => void,
    selectedSong: string | null,
    setSelectedSong: (id : string) => void,
    loading: boolean,
    albums: Album[],
    fetchSingleSong: ()=> Promise<void>,
    song: Song | null,
    nextSong: ()=> void,
    prevSong: ()=> void,
    albumSong: Song[],
    albumData: Album | null,
    fetchAlbumSongs: (id:string)=> Promise<void>,
    fetchSongs: ()=> Promise<void>,
    fetchAlbums: ()=> Promise<void>,
}

const SongContext = createContext<SongContextType | undefined>(undefined)

interface SongProviderProps{
    children: ReactNode
}

export const SongProvider = ({children} : SongProviderProps) => {

    const [songs, setSongs] = useState<Song[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedSong, setSelectedSong] = useState<string | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [albums, setAlbums] = useState<Album[]>([])
    const [song, setSong] = useState<Song | null>(null)
    const [index, setIndex] = useState(0)

    const fetchSongs = useCallback(async() =>{
        setLoading(true)
        try {
            const {data} =  await axios.get<Song[]>(`${server}/api/v1/song/all`)
            setSongs(data)
            if(data.length > 0) setSelectedSong(data[0].id.toString())
            setIsPlaying(false)
        } catch (error) {
            console.log(error)
        }finally{
            setLoading(false)
        }
    },[])

    const fetchAlbums = useCallback(async() =>{
        setLoading(true)
        try {
            const {data} = await axios.get<Album[]>(`${server}/api/v1/album/all`)
            setAlbums(data)
        } catch (error) {
            console.log(error)
        }finally{
            setLoading(false)
        }
    },[])

    const fetchSingleSong = useCallback(async()=>{
        if(!selectedSong) return
        try {
            const {data} = await axios.get<Song>(`${server}/api/v1/song/${selectedSong}`)
            setSong(data)
        } catch (error) {
            console.log(error)
        }
    },[selectedSong])

    const nextSong = useCallback(()=>{
        if(index === songs.length - 1){
            setIndex(0)
            setSelectedSong(songs[0]?.id.toString())
        }else{
            setIndex((prevIdx) => prevIdx + 1)
            setSelectedSong(songs[index + 1]?.id.toString())
        }
    }, [index, songs])

    const prevSong = useCallback(()=>{
        if(index === 0){
            setIndex(songs.length -1)
            setSelectedSong(songs[songs.length - 1]?.id.toString())
        }else{
            setIndex((prevIdx) => prevIdx - 1)
            setSelectedSong(songs[index - 1]?.id.toString())
        }
    }, [index, songs])

    const [albumSong, setAlbumSong] = useState<Song[]>([])
    const [albumData, setAlbumData] = useState<Album | null>(null)

    const fetchAlbumSongs = useCallback(async(id : string)=>{
        setLoading(true)
        try {
            const {data} = await axios.get<{songs : Song[]; album: Album}>(`${server}/api/v1/album/${id}`)
            setAlbumData(data.album)
            setAlbumSong(data.songs)
        } catch (error) {
            console.log(error)
        }finally{
            setLoading(false)
        }
    })

    useEffect(()=>{
        fetchSongs()
        fetchAlbums()
    },[])

    return <SongContext.Provider 
    value={{
        songs, 
        isPlaying, 
        setIsPlaying, 
        selectedSong, 
        setSelectedSong, 
        loading, 
        albums,
        fetchSingleSong,
        song,
        nextSong,
        prevSong,
        albumData,
        albumSong,
        fetchAlbumSongs,
        fetchSongs,
        fetchAlbums,
    }} >
        {children}
    </SongContext.Provider>
}

export const useSongData = () : SongContextType => {
    const context = useContext(SongContext)
    if(!context){
        throw new Error("useSongData must be used within a SongProvider")
    }
    return context
}
