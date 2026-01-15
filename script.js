const songList = document.getElementById("songList");
const lettersContainer = document.getElementById("letters");

let currentScript = null;
let currentAudio = null;

/* ---------------- JSONP CALLBACK ---------------- */
window.handleData = function (data) {
  songList.innerHTML = "";

  if (!data || !data.data || data.data.length === 0) {
    songList.innerHTML =
      "<li class='list-group-item text-center'>No songs found</li>";
    return;
  }

  data.data.forEach((song) => {
    const li = document.createElement("li");
    li.className = "list-group-item";

    li.innerHTML = `
      <div class="d-flex justify-content-between align-items-start">
        <div>
          <strong>${song.title}</strong><br/>
          <small class="text-muted">${song.artist.name}</small>
        </div>
        <div class="d-flex gap-2">
          ${
            song.preview
              ? `<button class="btn btn-sm btn-outline-primary preview-btn">▶️</button>`
              : ""
          }
          <button class="btn btn-sm btn-outline-secondary lyrics-btn">
            Load Lyrics
          </button>
        </div>
      </div>
      <div class="lyrics mt-3 d-none"></div>
    `;

    /* -------- Preview -------- */
    const previewBtn = li.querySelector(".preview-btn");
    if (previewBtn) {
      previewBtn.onclick = () => {
        if (currentAudio) currentAudio.pause();
        currentAudio = new Audio(song.preview);
        currentAudio.play();
      };
    }

    /* -------- Lyrics -------- */
    const lyricsBtn = li.querySelector(".lyrics-btn");
    const lyricsBox = li.querySelector(".lyrics");

    lyricsBtn.onclick = async () => {
      // Toggle
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
            song.artist.name
          )}/${encodeURIComponent(song.title)}`
        );
        const data = await res.json();

        lyricsBox.innerHTML = data.lyrics
          ? `<pre style="white-space: pre-wrap;">${data.lyrics}</pre>`
          : "<em>Lyrics not available</em>";
      } catch (err) {
        lyricsBox.innerHTML = "<em>Error loading lyrics</em>";
      }

      lyricsBtn.textContent = "Hide Lyrics";
    };

    songList.appendChild(li);
  });
};

/* ---------------- LOAD SONGS ---------------- */
function loadSongs(letter = "") {
  songList.innerHTML =
    "<li class='list-group-item text-center'>Loading songs...</li>";

  const query = letter ? `${letter}*` : "bollywood";

  if (currentScript) {
    document.body.removeChild(currentScript);
  }

  const script = document.createElement("script");
  script.src = `https://api.deezer.com/search?q=${query}&limit=50&output=jsonp&callback=handleData`;

  currentScript = script;
  document.body.appendChild(script);
}

/* ---------------- A–Z BUTTONS ---------------- */
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

/* ---------------- INIT ---------------- */
generateLetters();
loadSongs(); // default popular songs
