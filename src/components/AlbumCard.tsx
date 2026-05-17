import { useNavigate } from "react-router-dom"

interface AlbumCardProps{
    image: string,
    name: string,
    desc: string,
    id: string,
}

const AlbumCard = ({desc,id,image,name} : AlbumCardProps) => {

    const navigate = useNavigate()

  return (
    <div>
      <div
       onClick={()=> navigate(`/album/${id}`)}
       className="p-2 px-3 min-w-[180px] rounded cursor-pointer hover:bg-[#ffffff26]">
             <img src={image} alt={name} className="w-[160px] rounded" />
             <p className="font-bold mt-2 mb-1">{name.slice(0,12)}...</p>
             <p className="text-sm text-slate-200">{desc.slice(0,18)}...</p>
      </div>
    </div>
  )
}

export default AlbumCard
