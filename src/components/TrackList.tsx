import type { Album } from "@/lib/types";
import "../../styles/base.css";
import "../../styles/embla.css";

type TrackList = {
    album: Album;
};

const TrackList: React.FC<TrackList> = ({ album }) => {
    return (
        <div id={album.title} className="grid grid-cols-4 grid-rows-1 gap-4 my-5">
            <div className="col-start-2">
                <img
                    alt={album.title}
                    src={album.cover}
                    className="h-full w-full object-cover"
                />
            </div>
            <div className="flex flex-col justify-center col-start-3">
                {album.title && <h1 className="text-5xl">{album.title}</h1>}
                <ul>
                    {album.songs.map((song, index) => (
                        <li key={song.title}>
                            {index + 1}. {song.title} ({song.length})
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default TrackList;
