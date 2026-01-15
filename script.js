const songList = document.getElementById("songList");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");

function loadSongs(query = "bollywood") {
  songList.innerHTML = "<li class='list-group-item'>Loading songs...</li>";

  const script = document.createElement("script");
  script.src = `https://api.deezer.com/search?q=${query}&limit=50&output=jsonp&callback=handleData`;
  document.body.appendChild(script);
}

function handleData(data) {
  songList.innerHTML = "";

  if (!data.data || data.data.length === 0) {
    songList.innerHTML = "<li class='list-group-item'>No songs found</li>";
    return;
  }

  const letter = searchInput.value.trim().toLowerCase();

  data.data.forEach(song => {
    if (letter && !song.title.toLowerCase().startsWith(letter)) return;

    const li = document.createElement("li");
    li.className = "list-group-item";
    li.textContent = `${song.title} — ${song.artist.name}`;
    songList.appendChild(li);
  });
}

searchBtn.addEventListener("click", () => {
  const letter = searchInput.value.trim();
  loadSongs(letter || "bollywood");
});

// Default: load all popular songs
loadSongs();
