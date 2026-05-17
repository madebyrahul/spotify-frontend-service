import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { useSongData } from "../context/SongContext";
import { useEffect } from "react";
import Loading from "../components/Loading";
import { FaBookmark, FaPlay } from "react-icons/fa";
import { useUserData } from "../context/UserContext";

const Album = () => {
  const {
    albumData,
    albumSong,
    fetchAlbumSongs,
    setIsPlaying,
    setSelectedSong,
    loading,
  } = useSongData();

  const params = useParams<{ id: string }>();

  const {isAuth, addToPlaylist} = useUserData()

  useEffect(() => {
    if (params.id) {
      fetchAlbumSongs(params.id);
    }
  }, [params.id]);

  return (
    <div>
      <Layout>
        {albumData && (
          <>
            {loading ? (
              <Loading />
            ) : (
              <>
                <div className="mt-10 flex gap-8 flex-col md:flex-row md: items-center">
                  {albumData.thumbnail && (
                    <img
                      src={albumData.thumbnail}
                      alt="thumbnail album"
                      className="w-48 rounded"
                    />
                  )}
                  <div className="flex flex-col">
                    <p>PlayList</p>
                    <h2 className="text-3xl font-bold mb-4 md:text-5xl">
                      {albumData.title} PlayList
                    </h2>
                    <h4 className="text-sm text-gray-400">
                      {albumData.description}
                    </h4>
                    <p className="mt-1">
                      <img
                        src="/logo.png"
                        alt="logog"
                        className="w-6 inline-block"
                      />
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 mt-10 mb-4 pl-2 text-[#a7a7a7]">
                  <p>
                    <b className="mr-4">#</b>
                  </p>
                  <p className="hidden sm:block">Description</p>
                  <p className="text-center">Actions</p>
                </div>

                <hr />

                {albumSong &&
                  albumSong.map((song, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-3 sm:grid-cols-4 mt-10 mb-4 pl-2 text-[#a7a7a7] hover:bg-[#ffffff2b] cursor-pointer"
                    >
                      <p className="text-white">
                        <b className="mr-4 text-[#a7a7a7]">{index+1}</b>
                        <img className="inline mr-5 w-10" src={song.thumbnail ? song.thumbnail : "/dummy.jpg"} alt="thumbnail" />{" "} {song.title}
                      </p>
                      <p className="text-[15px] hidden sm:block">{song.description.slice(0,30)}...</p>
                      <p className="flex items-center justify-center gap-5">
                          {
                            isAuth && <button
                             className="text-center text-[15px]"
                             onClick={()=> addToPlaylist(song.id)}
                            >
                             <FaBookmark />
                            </button>
                          }
                          <button
                           className="text-center text-[15px]"
                           onClick={()=> {
                             setSelectedSong(song.id)
                             setIsPlaying(true)
                           }}
                          >
                            <FaPlay />
                          </button>
                      </p>
                    </div>
                  ))}
              </>
            )}
          </>
        )}
      </Layout>
    </div>
  );
};

export default Album;
