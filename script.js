const songList = document.getElementById("songList");
const lettersContainer = document.getElementById("letters");
let currentAudio = null;

// fetch songs via CORS proxy + iTunes
async function loadSongs(letter = "") {
  songList.innerHTML =
    "<li class='list-group-item text-center'>Loading songs...</li>";

  const term = letter || "love"; // default search
  const url = `https://api.allorigins.win/raw?url=${encodeURIComponent(
    "https://itunes.apple.com/search?term=" +
      encodeURIComponent(term) +
      "&media=music&entity=song&limit=30"
  )}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      songList.innerHTML =
        "<li class='list-group-item text-center'>No songs found</li>";
      return;
    }
    renderSongs(data.results, letter);
  } catch (err) {
    songList.innerHTML =
      "<li class='list-group-item text-center text-danger'>Error loading songs</li>";
    console.error(err);
  }
}

// render songs
function renderSongs(songs, letter) {
  songList.innerHTML = "";
  songs.forEach((song) => {
    if (
      letter &&
      !song.trackName.toLowerCase().startsWith(letter.toLowerCase())
    )
      return;

    const li = document.createElement("li");
    li.className = "list-group-item";

    li.innerHTML = `
      <div class="d-flex justify-content-between align-items-start">
        <div>
          <strong>${song.trackName}</strong><br />
          <small class="text-muted">${song.artistName}</small>
        </div>
        <div class="d-flex gap-2">
          ${
            song.previewUrl
              ? `<button class="btn btn-sm btn-outline-primary preview-btn">▶️</button>`
              : ""
          }
          <button class="btn btn-sm btn-outline-secondary lyrics-btn">
            Load Lyrics
          </button>
        </div>
      </div>
      <div class="lyrics mt-2 d-none"></div>
    `;

    const previewBtn = li.querySelector(".preview-btn");
    if (previewBtn) {
      previewBtn.onclick = () => {
        if (currentAudio) currentAudio.pause();
        currentAudio = new Audio(song.previewUrl);
        currentAudio.play();
      };
    }

    const lyricsBtn = li.querySelector(".lyrics-btn");
    const lyricsBox = li.querySelector(".lyrics");

    lyricsBtn.onclick = async () => {
      if (!lyricsBox.classList.contains("d-none")) {
        lyricsBox.classList.add("d-none");
        lyricsBtn.textContent = "Load Lyrics";
        return;
      }
      lyricsBtn.textContent = "Loading...";
      lyricsBox.classList.remove("d-none");

      try {
        const res = await fetch(
          `https://api.lyrics.ovh/v1/${encodeURIComponent(
            song.artistName
          )}/${encodeURIComponent(song.trackName)}`
        );
        const data = await res.json();

        lyricsBox.innerHTML = data.lyrics
          ? `<pre style="white-space: pre-wrap;">${data.lyrics}</pre>`
          : "<em>Lyrics not available</em>";
      } catch {
        lyricsBox.innerHTML = "<em>Error loading lyrics</em>";
      }

      lyricsBtn.textContent = "Hide Lyrics";
    };

    songList.appendChild(li);
  });
}

// alphabet buttons
function generateLetters() {
  for (let i = 65; i <= 90; i++) {
    const letter = String.fromCharCode(i);
    const btn = document.createElement("button");
    btn.className = "btn btn-outline-dark btn-sm";
    btn.textContent = letter;
    btn.onclick = () => loadSongs(letter);
    lettersContainer.appendChild(btn);
  }
}

generateLetters();
loadSongs(); // default
