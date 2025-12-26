let user = localStorage.getItem("user");
let posts = JSON.parse(localStorage.getItem("posts") || "[]");
let likes = JSON.parse(localStorage.getItem("likes") || "{}");
let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

window.onload = () => {
  if (user) {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("welcome").innerText = `👋 ${user}`;
  }
  render();
};

function login() {
  const name = document.getElementById("nickname").value.trim();
  if (!name) return;
  user = name;
  localStorage.setItem("user", name);
  location.reload();
}

function addPost() {
  if (!user) return alert("로그인 필요");

  const url = document.getElementById("urlInput").value;
  if (!url.includes("youtube.com/shorts")) {
    return alert("유튜브 쇼츠 링크만 가능");
  }

  const videoId = url.split("/shorts/")[1].split("?")[0];

  posts.push({
    id: Date.now(),
    user,
    videoId,
    likes: 0
  });

  save();
  render();
}

function likePost(id) {
  if (!likes[user]) likes[user] = [];
  if (likes[user].includes(id)) return;

  likes[user].push(id);
  const post = posts.find(p => p.id === id);
  post.likes++;

  save();
  render();
}

function toggleFavorite(id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter(f => f !== id);
  } else {
    favorites.push(id);
  }
  save();
  render();
}

function render() {
  const feed = document.getElementById("feed");
  feed.innerHTML = "";

  posts.forEach(p => {
    const liked = likes[user]?.includes(p.id);
    const fav = favorites.includes(p.id);

    feed.innerHTML += `
      <div class="card">
        <img class="thumbnail"
          src="https://img.youtube.com/vi/${p.videoId}/hqdefault.jpg"
          onclick="window.open('https://www.youtube.com/shorts/${p.videoId}')">

        <div class="actions">
          <button ${liked ? "disabled" : ""} onclick="likePost(${p.id})">
            ❤️ ${p.likes}
          </button>
          <button onclick="toggleFavorite(${p.id})">
            ${fav ? "⭐" : "☆"}
          </button>
        </div>

        <small>by ${p.user}</small>
      </div>
    `;
  });

  updateRanking();
}

function updateRanking() {
  const score = {};
  posts.forEach(p => {
    score[p.user] = Math.max(score[p.user] || 0, p.likes);
  });

  const list = document.getElementById("rankingList");
  list.innerHTML = "";

  Object.entries(score)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .forEach(([name, likes], i) => {
      list.innerHTML += `<li>${i + 1}. ${name} ❤️ ${likes}</li>`;
    });
}

function save() {
  localStorage.setItem("posts", JSON.stringify(posts));
  localStorage.setItem("likes", JSON.stringify(likes));
  localStorage.setItem("favorites", JSON.stringify(favorites));
}
