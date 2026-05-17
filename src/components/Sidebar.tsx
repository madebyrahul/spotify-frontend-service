import { useNavigate } from "react-router-dom";
import PlayListCard from "./PlayListCard";
import { useUserData } from "../context/UserContext";

const Sidebar = () => {
  const navigate = useNavigate();

  const {user} = useUserData()

  return (
    <div className="w-[25%] h-full p-2 flex-col gap-2 text-white hidden lg:flex">
      <div className="bg-[#121212] flex flex-col rounded h-[15%] justify-around">
        <div
          className="flex items-center gap-3 pl-8 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src="/home.png" alt="home img" className="w-6" />
          <p className="font-bold">Home</p>
        </div>

        <div className="flex items-center gap-3 pl-8 cursor-pointer">
          <img src="/search.png" alt="search img" className="w-6" />
          <p className="font-bold">Search</p>
        </div>
      </div>

      <div className="rounded bg-[#121212] h-[85%]">

        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/stack.png" alt="stack img" className="w-8" />
            <p className="font-semibold">Your Library</p>
          </div>

          <div className="flex items-center gap-3">
            <img src="/arrow.png" alt="arrow img" className="w-6" />
            <img src="/plus.png" alt="plus img" className="w-6" />
          </div>
        </div>

        <div onClick={()=> navigate("/playlist")}>
           <PlayListCard />
        </div>

        <div className="p-4 m-2 bg-[#121212] font-semibold rounded flex flex-col items-start gap-1 mt-4 pl-4">
            <h1>Let's find some podcasts to listen to!</h1>
            <p className="font-light">We'll help you discover new shows based on your interests.</p>
            <button className="px-4 py-1.5 bg-white text-black text-[15px] rounded-full mt-4">
                Browse Podcasts
            </button>
        </div>

        {
          user && user.role === "admin" && <button onClick={()=> navigate("/admin/dashboard")} className="cursor-pointer md:ml-6 px-4 py-1.5 bg-white text-black text-[15px] rounded-full mt-4">
                Admin Dashboard
           </button>
        }

      </div>
    </div>
  );
};

export default Sidebar;
