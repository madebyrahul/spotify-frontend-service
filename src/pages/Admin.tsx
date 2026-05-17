import type { SyntheticEvent } from "react";
import { useEffect, useState, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserData } from "../context/UserContext";
import { useSongData } from "../context/SongContext";
import axios from "axios";
import toast from "react-hot-toast";
import { MdDelete } from "react-icons/md";

const Admin = () => {
  const navigate = useNavigate();

  const server = "http://56.228.32.50:7000";

  const { user } = useUserData();
  const { albums, songs, fetchAlbums, fetchSongs } = useSongData();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [album, setAlbum] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [btnLoading, setBtnLoading] = useState(false);

  const fileChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const addAlbumHandler = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("file", file);

    setBtnLoading(true);

    try {
      const { data } = await axios.post(
        `${server}/api/v1/album/new`,
        formData,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        },
      );
      toast.success(data.message);
      fetchAlbums();
      setBtnLoading(false);
      setTitle("");
      setDescription("");
      setFile(null);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "failed to add album");
      } else {
        toast.error("failed to add album");
      }
      setBtnLoading(false);
    }
  };

  const addSongHandler = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("file", file);
    formData.append("album", album);

    setBtnLoading(true);

    try {
      const { data } = await axios.post(`${server}/api/v1/song/new`, formData, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      toast.success(data.message);
      fetchSongs();
      setBtnLoading(false);
      setTitle("");
      setDescription("");
      setFile(null);
      setAlbum("");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "failed to add album");
      } else {
        toast.error("failed to add album");
      }
      setBtnLoading(false);
    }
  };

  const addThumbnailHandler = async (id: string) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    setBtnLoading(true);

    try {
      const { data } = await axios.post(
        `${server}/api/v1/song/${id}`,
        formData,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        },
      );
      toast.success(data.message);
      fetchSongs();
      setBtnLoading(false);
      setFile(null);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "failed to add thumbnail");
      } else {
        toast.error("failed to add thumbnail");
      }
      setBtnLoading(false);
    }
  };

  const deleteAlbum = async (id: string) => {
    if (confirm("Are you sure you want to delete this album?")) {
      setBtnLoading(true);
      try {
         const {data} = await axios.delete(`${server}/api/v1/album/${id}`, {
            headers : {
                token: localStorage.getItem("token")
            }
         })
         toast.success(data.message)
         fetchSongs()
         fetchAlbums()
         setBtnLoading(false)
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          toast.error(
            error.response?.data?.message || "failed to delete album",
          );
        } else {
          toast.error("failed to delete album");
        }
        setBtnLoading(false);
      }
    }
  };

  const deleteSong = async (id: string) => {
    if (confirm("Are you sure you want to delete this song?")) {
      setBtnLoading(true);
      try {
         const {data} = await axios.delete(`${server}/api/v1/song/${id}`, {
            headers : {
                token: localStorage.getItem("token")
            }
         })
         toast.success(data.message)
         fetchSongs()
         setBtnLoading(false)
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          toast.error(
            error.response?.data?.message || "failed to delete album",
          );
        } else {
          toast.error("failed to delete album");
        }
        setBtnLoading(false);
      }
    }
  };

  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen p-8 bg-[#212121] text-white">
      <Link
        to={"/"}
        className="bg-green-500 text-white font-bold py-2 px-4 rounded-full"
      >
        Go to home page
      </Link>
      <h2 className="text-2xl font-bold mt-6 mb-6">Add Album</h2>
      <form
        onSubmit={addAlbumHandler}
        className="bg-[#181818] p-6 rounded-lg shadow-lg flex flex-col gap-4 items-center justify-center"
      >
        <input
          type="text"
          placeholder="Title"
          className="auth-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description"
          className="auth-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="file"
          className="auth-input"
          accept="image/*"
          placeholder="Choose Thumbnail"
          onChange={fileChangeHandler}
          required
        />
        <button
          className="auth-btn"
          style={{ width: "150px" }}
          disabled={btnLoading}
        >
          {btnLoading ? "Please Wait" : "Add Album"}
        </button>
      </form>

      <h2 className="text-2xl font-bold mt-6 mb-6">Add Song</h2>
      <form
        onSubmit={addSongHandler}
        className="bg-[#181818] p-6 rounded-lg shadow-lg flex flex-col gap-4 items-center justify-center"
      >
        <input
          type="text"
          placeholder="Title"
          className="auth-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description"
          className="auth-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="file"
          className="auth-input"
          accept="audio/*"
          placeholder="Choose audio"
          onChange={fileChangeHandler}
          required
        />
        <select
          className="auth-input"
          value={album}
          onChange={(e) => setAlbum(e.target.value)}
        >
          <option value="">Choose Album</option>
          {albums?.map((e, i) => (
            <option value={e.id} key={i}>
              {e.title}
            </option>
          ))}
        </select>
        <button
          className="auth-btn"
          style={{ width: "150px" }}
          disabled={btnLoading}
        >
          {btnLoading ? "Please Wait" : "Add Album"}
        </button>
      </form>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Added Albums</h3>
        <div className="flex justify-center items-center md:justify-start gap-2 flex-wrap">
          {albums?.map((e, i) => (
            <div className="p-4 bg-[#181818] rounded-lg shadow-md " key={i}>
              <img
                src={e.thumbnail}
                alt="thumbnail"
                className="mr-1 w-52 h-52"
              />
              <h4 className="text-lg font-bold">{e.title.slice(0, 25)}</h4>
              <h4 className="text-lg font-bold">
                {e.description.slice(0, 20)}...
              </h4>
              <button
                disabled={btnLoading}
                className="px-3 py-1 bg-red-500 text-white rounded"
                onClick={()=> deleteAlbum(e.id)}
              >
                <MdDelete />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Added Songs</h3>
        <div className="flex justify-center items-center md:justify-start gap-2 flex-wrap">
          {songs?.map((e, i) => (
            <div className="p-4 bg-[#181818] rounded-lg shadow-md " key={i}>
              {e.thumbnail ? (
                <img
                  src={e.thumbnail}
                  alt="thumbnail"
                  className="mr-1 w-52 h-52"
                />
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 w-[270px]">
                  <input type="file" onChange={fileChangeHandler} />
                  <button
                    className="auth-btn"
                    style={{ width: "200px" }}
                    disabled={btnLoading}
                    onClick={() => addThumbnailHandler(e.id)}
                  >
                    {btnLoading ? "Please Wait..." : "Add Thumbnail"}
                  </button>
                </div>
              )}
              <h4 className="text-lg font-bold">{e.title.slice(0, 25)}</h4>
              <h4 className="text-lg font-bold">
                {e.description.slice(0, 20)}...
              </h4>
              <button
                disabled={btnLoading}
                className="px-3 py-1 bg-red-500 text-white rounded"
                onClick={()=> deleteSong(e.id)}
              >
                <MdDelete />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;
