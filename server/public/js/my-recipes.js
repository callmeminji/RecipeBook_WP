function goToHome() {
  window.location.href = "index.html";
}

function goToAccount() {
  window.location.href = "account.html";
}

document.addEventListener("DOMContentLoaded", async () => {
  const token = sessionStorage.getItem("token");
  const list = document.getElementById("myRecipeList");

  if (!token) {
    alert("로그인이 필요합니다.");
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch("/api/users/me/recipes", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    if (!res.ok) {
      throw new Error("서버 응답 실패");
    }

    const recipes = await res.json();

    if (recipes.length === 0) {
      list.innerHTML = "<p>작성한 레시피가 없습니다.</p>";
      return;
    }

    recipes.forEach((recipe) => {
      const card = document.createElement("div");
      card.className = "recipe-card";
      card.innerHTML = `
        <div class="recipe-image-wrapper">
          <div class="recipe-title-box">${recipe.title}</div>
          <img src="${recipe.imageUrl || 'assets/default.jpg'}" alt="${recipe.title}" class="recipe-image">
        </div>
        <div class="recipe-info-list">
          <div class="recipe-info-item"><span class="emoji">🍽</span><span>${recipe.type || "Unknown"}</span></div>
          <div class="recipe-info-item"><span class="emoji">⏱</span><span>${recipe.time ? `${recipe.time} min` : "Time unknown"}</span></div>
          <div class="recipe-info-item"><span class="emoji">⭐</span><span>${recipe.difficulty || "N/A"}</span></div>
        </div>
      `;
      card.onclick = () => {
        window.location.href = `post.html?id=${recipe._id}`;
      };
      list.appendChild(card);
    });
  } catch (err) {
    console.error("내 레시피 불러오기 실패:", err);
    list.innerHTML = "<p>레시피를 불러오는 중 오류가 발생했습니다.</p>";
  }
});
