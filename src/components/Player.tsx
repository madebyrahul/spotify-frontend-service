import { useEffect, useRef, useState } from "react";
import { useSongData } from "../context/SongContext";
import { GrChapterNext, GrChapterPrevious } from "react-icons/gr";
import { FaPause, FaPlay } from "react-icons/fa";

const Player = () => {
  const {
    song,
    selectedSong,
    fetchSingleSong,
    isPlaying,
    setIsPlaying,
    nextSong,
    prevSong,
  } = useSongData();

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetaData = () => {
      setDuration(audio.duration || 0);
    };

    const handleTimeUpdate = () => {
      setProgress(audio.currentTime || 0);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetaData);
    audio.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetaData);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [song]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)/100;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = (parseFloat(e.target.value) / 100) * duration;
    setProgress(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };
  

  useEffect(() => {
    fetchSingleSong();
  }, [selectedSong]);

  return (
    <div>
      {song && (
        <div className="flex justify-between items-center bg-black h-[10%] text-white px-4">
          <div className="lg:flex items-center gap-4 md:w-1/4">
            <img
              src={song.thumbnail ? song.thumbnail : "/dummy.jpg"}
              alt={song.title}
              className="w-12 h-12 object-cover rounded"
            />
            <div className="hidden md:block">
              <p className="font-bold tracking-tighter">{song?.title}</p>
              <p className="text-sm text-gray-400">
                {song?.description.slice(0, 30)}...
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1 m-auto">
            {song?.audio && (
              <audio ref={audioRef} src={song.audio} autoPlay={isPlaying} />
            )}
            <div className="flex items-center w-full font-thin text-green-400">
              <input
                type="range"
                min={"0"}
                max={"100"}
                className="progress-bar w-[120px] md:w-[300px]"
                value={(progress / duration) * 100 || 0}
                onChange={handleDurationChange}
              />
            </div>
            <div className="flex justify-center items-center gap-4">
              <span className="cursor-pointer" onClick={prevSong}>
                <GrChapterPrevious />
              </span>

              <button
                className="bg-white text-black rounded-full p-2 "
                onClick={handlePlayPause}
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>

              <span className="cursor-pointer" onClick={nextSong}>
                <GrChapterNext />
              </span>
            </div>
          </div>

          <div className="flex">
            <input 
              type="range" 
              min={"0"} 
              max={"100"} 
              value={volume * 100}
              onChange={handleVolumeChange}
              className="w-16 md:w-32"
              step={"0.01"}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Player;
