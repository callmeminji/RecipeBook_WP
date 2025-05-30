function goToHome() {
    window.location.href = "index.html";
  }
  function goToAccount() {
    window.location.href = "account.html";
  }
  
  // 샘플: 로그인한 사용자가 작성한 레시피 리스트 (나중에 서버로부터 받아옴)
  const myRecipes = [
    {
      id: 4,
      title: "Tteokbokki",
      imageUrl: "assets/default.jpg",
      difficulty: "Medium",
      time: 20,
      type: "Korean"
    },
    {
      id: 5,
      title: "Ramen",
      imageUrl: "assets/default.jpg",
      difficulty: "Easy",
      time: 15,
      type: "Japanese"
    }
  ];
  
  document.addEventListener("DOMContentLoaded", () => {
    const list = document.getElementById("myRecipeList");
  
    myRecipes.forEach(recipe => {
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
  