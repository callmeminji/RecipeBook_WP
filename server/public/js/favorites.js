function goToHome() {
    window.location.href = "index.html";
  }
  function goToAccount() {
    window.location.href = "account.html";
  }
  
  // 샘플 찜한 레시피 데이터 (나중에 서버 fetch로 대체 가능)
  const favoriteRecipes = [
    {
      id: 1,
      title: "Kimchi Stew",
      imageUrl: "assets/default.jpg",
      difficulty: "Medium",
      time: 30,
      type: "Korean"
    },
    {
      id: 3,
      title: "Sushi Roll",
      imageUrl: "assets/iKON.jpg",
      difficulty: "Hard",
      time: 60,
      type: "Japanese"
    }
  ];
  
  document.addEventListener("DOMContentLoaded", () => {
    const list = document.getElementById("favoriteList");
  
    favoriteRecipes.forEach(recipe => {
      const card = document.createElement("div");
      card.className = "recipe-card";
      card.innerHTML = `
        <img src="${recipe.imageUrl}" alt="${recipe.title}" class="recipe-image">
        <div class="info">
          <h3>${recipe.title}</h3>
          <p class="meta">
            ⭐ ${recipe.difficulty} &nbsp;&nbsp; ⏱ ${recipe.time} min &nbsp;&nbsp; 🍽 ${recipe.type}
          </p>
        </div>
      `;
      card.onclick = () => {
        window.location.href = `post.html?id=${recipe.id}`;
      };
  
      list.appendChild(card);
    });
  });
  