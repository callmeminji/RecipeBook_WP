// API 서버 주소 설정
const BASE_URL = "https://recipeya.onrender.com";

function goToHome() {
  window.location.href = "index.html";
}

function goToAccount() {
  window.location.href = "account.html";
}

document.addEventListener("DOMContentLoaded", async () => {
  const list = document.getElementById("favoriteList");
  const token = sessionStorage.getItem("token");

  if (!token) {
    alert("로그인이 필요합니다.");
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/api/users/me/bookmarks`, {
      headers: {
        Authorization: "Bearer " + token
      }
    });

    if (!res.ok) {
      throw new Error("Failed to load bookmarks");
    }

    const data = await res.json();
    const favoriteRecipes = data.bookmarks || [];

    if (favoriteRecipes.length === 0) {
      list.innerHTML = "<p>찜한 레시피가 없습니다.</p>";
      return;
    }

    favoriteRecipes.forEach(recipe => {
      const card = document.createElement("div");
      card.className = "recipe-card";
      card.innerHTML = `
        <div class="recipe-image-wrapper">
          <div class="recipe-title-box">${recipe.title}</div>
          <img src="${recipe.imageUrl || 'assets/default.jpg'}" alt="${recipe.title}" class="recipe-image">
        </div>
        <div class="recipe-info-list">
          <div class="recipe-info-item"><span class="emoji">🍽</span><span>${recipe.type || "Unknown"}</span></div>
          <span>${recipe.cookingTime ? `${recipe.cookingTime} min` : "Time unknown"}</span>
          <div class="recipe-info-item"><span class="emoji">⭐</span><span>${recipe.difficulty || "N/A"}</span></div>
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
