const songList = document.getElementById("songList");
const lettersContainer = document.getElementById("letters");

let currentScript = null;
let currentAudio = null;

/* ---------- GLOBAL JSONP CALLBACK ---------- */
window.handleData = function (data) {
  songList.innerHTML = "";

  if (!data?.data?.length) {
    songList.innerHTML =
      "<li class='list-group-item text-center'>No songs found</li>";
    return;
  }

  data.data.forEach(song => {
    const li = document.createElement("li");
    li.className =
      "list-group-item d-flex justify-content-between align-items-center";

    li.innerHTML = `
      <div>
        <strong>${song.title}</strong><br/>
        <small class="text-muted">${song.artist.name}</small>
      </div>
      ${
        song.preview
          ? `<button class="btn btn-sm btn-outline-primary">▶️</button>`
          : ""
      }
    `;

    // Preview play
    const btn = li.querySelector("button");
    if (btn) {
      btn.onclick = () => {
        if (currentAudio) currentAudio.pause();
        currentAudio = new Audio(song.preview);
        currentAudio.play();
      };
    }

    songList.appendChild(li);
  });
};

/* ---------- LOAD SONGS ---------- */
function loadSongs(letter = "") {
  songList.innerHTML =
    "<li class='list-group-item text-center'>Loading songs...</li>";

  const query = letter ? `${letter}*` : "bollywood";

  if (currentScript) document.body.removeChild(currentScript);

  const script = document.createElement("script");
  script.src = `https://api.deezer.com/search?q=${query}&limit=50&output=jsonp&callback=handleData`;

  currentScript = script;
  document.body.appendChild(script);
}

/* ---------- A–Z BUTTONS ---------- */
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

/* ---------- INIT ---------- */
generateLetters();
loadSongs(); // default popular songs
