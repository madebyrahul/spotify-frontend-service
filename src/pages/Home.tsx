import AlbumCard from "../components/AlbumCard";
import Layout from "../components/Layout";
import Loading from "../components/Loading";
import SongCard from "../components/SongCard";
import { useSongData } from "../context/SongContext";

const Home = () => {
  const { albums, songs, loading } = useSongData();

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <Layout>
          <div className="mb-4">
            <h1 className="my-5 font-bold text-2xl">Featured Charts</h1>
            <div className="flex overflow-auto">
              {albums?.map((album, index) => (
                <AlbumCard
                  key={index}
                  image={album.thumbnail}
                  name={album.title}
                  desc={album.description}
                  id={album.id}
                />
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h1 className="my-5 font-bold text-2xl">Today's biggest hits</h1>
            <div className="flex overflow-auto">
              {songs?.map((song, index) => (
                <SongCard
                  key={index}
                  image={song.thumbnail}
                  name={song.title}
                  desc={song.description}
                  id={song.id}
                />
              ))}
            </div>
          </div>
        </Layout>
      )}
    </div>
  );
};

export default Home;
