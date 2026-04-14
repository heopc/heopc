import { useState, useEffect } from "react";

type Movie = {
  title: string;
  img: string;
  video: string;
};

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [admin, setAdmin] = useState(false);
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<Movie[]>([]);

  const [form, setForm] = useState<Movie>({
    title: "",
    img: "",
    video: ""
  });

  // FIX LOCALSTORAGE + TYPE SAFETY
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("movies") || "[]") as Movie[];
    const fav = JSON.parse(localStorage.getItem("fav") || "[]") as Movie[];

    setMovies(data);
    setFavorites(fav);
  }, []);

  const saveMovies = (newMovies: Movie[]) => {
    setMovies(newMovies);
    localStorage.setItem("movies", JSON.stringify(newMovies));
  };

  const saveFav = (newFav: Movie[]) => {
    setFavorites(newFav);
    localStorage.setItem("fav", JSON.stringify(newFav));
  };

  const login = () => {
    const u = prompt("username:");
    const p = prompt("password:");

    if (u === "Heopc" && p === "Theanh123@") {
      setAdmin(true);
    } else {
      alert("Sai!");
    }
  };

  const addMovie = () => {
    const newMovies: Movie[] = [...movies, form];
    saveMovies(newMovies);
    alert("Đã thêm!");
  };

  const toggleFav = (m: Movie) => {
    let newFav: Movie[];

    if (favorites.find((f: Movie) => f.title === m.title)) {
      newFav = favorites.filter((f: Movie) => f.title !== m.title);
    } else {
      newFav = [...favorites, m];
    }

    saveFav(newFav);
  };

  const filtered = (movies as Movie[]).filter((m: Movie) =>
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ background:"#141414", color:"white", minHeight:"100vh" }}>

      {/* HEADER */}
      <div style={{
        padding:"10px 20px",
        display:"flex",
        alignItems:"center",
        background:"#000"
      }}>
        <img
          src="https://www.image2url.com/r2/default/images/1776158656949-693fbd02-9d51-4750-94f1-9c6f6a64adb0.png"
          style={{
            height:"85px",
            flex:1,
            objectFit:"contain",
            filter:"drop-shadow(0 0 12px red)"
          }}
        />

        <div style={{ marginLeft:"10px" }}>
          <input
            placeholder="🔍 Tìm phim..."
            onChange={(e)=>setSearch(e.target.value)}
            style={{
              padding:"8px",
              borderRadius:"8px",
              border:"none"
            }}
          />

          {!admin && <button onClick={login}>Admin</button>}
        </div>
      </div>

      {/* ADMIN */}
      {admin && (
        <div style={{ padding:"20px", background:"#222" }}>
          <h2>Upload phim</h2>

          <input
            placeholder="Tên phim"
            onChange={(e)=>setForm({...form, title:e.target.value})}
          /><br/>

          <input
            placeholder="Link ảnh"
            onChange={(e)=>setForm({...form, img:e.target.value})}
          /><br/>

          <input
            placeholder="Link video"
            onChange={(e)=>setForm({...form, video:e.target.value})}
          /><br/>

          <button onClick={addMovie}>Thêm phim</button>
        </div>
      )}

      {/* LIST */}
      {!movie ? (
        <>
          <h2 style={{ padding:"20px", color:"white" }}>
            🎬 Danh sách phim
          </h2>

          <div style={{
            display:"grid",
            gridTemplateColumns:"repeat(auto-fill, minmax(180px,1fr))",
            gap:"20px",
            padding:"20px"
          }}>
            {filtered.map((m: Movie, i: number) => (
              <div key={i} style={{ cursor:"pointer" }}>
                <img src={m.img} width="100%" onClick={()=>setMovie(m)} />
                <p>{m.title}</p>

                <button onClick={()=>toggleFav(m)}>
                  {favorites.find((f: Movie) => f.title === m.title)
                    ? "💔 Bỏ thích"
                    : "❤️ Yêu thích"}
                </button>
              </div>
            ))}
          </div>

          {/* FAVORITES */}
          <h2 style={{ padding:"20px", color:"white" }}>
            ❤️ Yêu thích
          </h2>

          <div style={{
            display:"flex",
            gap:"20px",
            padding:"20px"
          }}>
            {favorites.map((m: Movie, i: number) => (
              <div key={i}
                onClick={()=>setMovie(m)}
                style={{ cursor:"pointer" }}>
                <img src={m.img} width="150"/>
                <p>{m.title}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div style={{ padding:"20px" }}>
          <button onClick={()=>setMovie(null)}>⬅ Back</button>
          <h2>{movie?.title}</h2>

          <video controls width="100%">
            <source src={movie?.video} />
          </video>
        </div>
      )}

    </div>
  );
}