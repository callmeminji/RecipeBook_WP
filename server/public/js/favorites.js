document.addEventListener("DOMContentLoaded", async () => {
  const list = document.getElementById("favoriteList");
  const token = sessionStorage.getItem("token");

  if (!token) {
    alert("로그인이 필요합니다.");
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch("/api/users/me/bookmarks", {
      headers: {
        Authorization: "Bearer " + token
      }
    });

    if (!res.ok) {
      throw new Error("Failed to load bookmarks");
    }

    const data = await res.json();
    const favoriteRecipes = data.bookmarks || [];  //  서버 응답 구조에 맞게

    if (favoriteRecipes.length === 0) {
      list.innerHTML = "<p>찜한 레시피가 없습니다.</p>";
      return;
    }

    favoriteRecipes.forEach(recipe => {
      const card = document.createElement("div");
      card.className = "recipe-card";
      card.innerHTML = `
        <img src="${recipe.image ? '/uploads/' + recipe.image : 'assets/default.jpg'}" alt="${recipe.title}" class="recipe-image">
        <div class="info">
          <h3>${recipe.title}</h3>
          <p class="meta">
            ⭐ ${recipe.difficulty} &nbsp;&nbsp; ⏱ ${recipe.cookingTime} min &nbsp;&nbsp; 🍽 ${recipe.type}
          </p>
        </div>
      `;
      card.onclick = () => {
        window.location.href = `post.html?id=${recipe._id}`;
      };

      list.appendChild(card);
    });

  } catch (err) {
    console.error("Error loading bookmarks:", err);
    list.innerHTML = "<p>북마크를 불러오는 데 실패했습니다.</p>";
  }
});
