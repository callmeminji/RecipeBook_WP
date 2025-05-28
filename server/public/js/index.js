// 계정 아이콘 클릭 시 사용자 페이지로 이동
function goToAccount() {
    window.location.href = "account.html";
}
  
// "New Recipe" 버튼 클릭 시 글 작성 페이지로 이동
function goToNewRecipe() {
    window.location.href = "new-recipe.html";
}

function goToHome() {
  window.location.href = "index.html";
}


  async function loadRecipes() {
    const res = await fetch("http://localhost:5000/api/recipes");
    const recipes = await res.json();
  
    const list = document.getElementById("recipeList");
    recipes.forEach(recipe => {
      const card = document.createElement("div");
      card.classList.add("recipe-card");
      card.innerHTML = `
        <h3>${recipe.title}</h3>
        <p>${recipe.difficulty} · ${recipe.time}분</p>
      `;
      list.appendChild(card);
    });
  }
  
  document.addEventListener("DOMContentLoaded", loadRecipes);
  
  function goToAccount() {
    window.location.href = "account.html";
  }
  
  function searchRecipes() {
    const keyword = document.getElementById("searchInput").value;
    // 필터된 fetch 요청은 나중에 연결
  }
  