import { FaBookmark, FaPlay } from "react-icons/fa"
import { useUserData } from "../context/UserContext"
import { useSongData } from "../context/SongContext"

interface SongCardProps{
    image: string,
    name: string,
    desc: string,
    id: string,
}

const SongCard = ({desc,id,image,name} : SongCardProps) => {

    const {addToPlaylist, isAuth} = useUserData()

    const {setSelectedSong, setIsPlaying} = useSongData()

    const saveToPlaylistHandler = ()=>{
        addToPlaylist(id)
    }

  return (
    <div className="p-2 px-3 min-w-[180px] rounded cursor-pointer hover:bg-[#ffffff26]">
       <div className="relative group">
            <img src={image ? image : "/dummy.jpg"} alt={name} className="mr-1 w-[160px] rounded" />
            <div className="flex gap-2">
                <button
                 className="absolute bottom-2 right-14 bg-green-500 text-black p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                 onClick={()=> {
                    setSelectedSong(id)
                    setIsPlaying(true)
                 }}
                >
                    <FaPlay />
                </button>
                { isAuth && <button
                 onClick={saveToPlaylistHandler}
                 className="absolute bottom-2 right-2 bg-green-500 text-black p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                    <FaBookmark />
                </button>}
            </div>
       </div>
       <p className="font-bold mt-2 mb-1">{name}</p>
       <p className="text-slate-200 text-sm">{desc.slice(0,20)}...</p>
    </div>
  )
}

export default SongCard
