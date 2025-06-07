// 샘플 데이터 (API 테스트용, 사용 안 하면 삭제해도 됨)
/*
const sampleRecipes = [
  {
    id: 1,
    title: "Kimchi Stew",
    imageUrl: "assets/default.jpg",
    difficulty: "Medium",
    time: 30,
    type: "Korean"
  },
  {
    id: 2,
    title: "Spaghetti",
    imageUrl: "assets/iKON.jpg",
    difficulty: "Easy",
    time: 25,
    type: "Western"
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
*/

//  페이지 이동 관련 함수들
function goToNewRecipe() {
  if (!sessionStorage.getItem("user")) {
    showLoginPrompt("new-recipe.html");
  } else {
    window.location.href = "new-recipe.html";
  }
}

function goToHome() {
  window.location.href = "index.html";
}

function goToAccount() {
  if (!sessionStorage.getItem("user")) {
    showLoginPrompt("account.html");
  } else {
    window.location.href = "account.html";
  }
}

//  로그인 모달 처리
function showLoginPrompt(redirectTarget) {
  const modal = document.getElementById("loginPromptModal");
  modal.style.display = "flex";
  modal.dataset.redirect = redirectTarget;
}

function closeLoginModal() {
  document.getElementById("loginPromptModal").style.display = "none";
}

function goToLogin() {
  const modal = document.getElementById("loginPromptModal");
  const redirect = modal?.dataset.redirect || window.location.href;
  window.location.href = `login.html?redirect=${encodeURIComponent(redirect)}`;
}

//  레시피 목록 불러오기
async function loadRecipes() {
  const list = document.getElementById("recipeList");
  list.innerHTML = ""; // 기존 내용 초기화

  try {
    const res = await fetch("/api/recipes");
    const recipes = await res.json();

    recipes.forEach(recipe => {
      const card = document.createElement("div");
      card.classList.add("recipe-card");

      card.innerHTML = `
        <img src="${recipe.imageUrl || 'assets/default.jpg'}" alt="${recipe.title}" class="recipe-image">
        <div class="info">
          <h3>${recipe.title}</h3>
          <p class="meta">
            ⭐ ${recipe.difficulty} &nbsp;&nbsp;
            ⏱ ${recipe.time} min &nbsp;&nbsp;
            🍽 ${recipe.type}
          </p>
        </div>
      `;

      card.onclick = () => {
        window.location.href = `post.html?id=${recipe._id}`;
      };

      list.appendChild(card);
    });

  } catch (err) {
    console.error("Failed to load recipes:", err);
    list.innerHTML = "<p class='error-msg'>😥 Failed to load recipes. Please try again later.</p>";
  }
}

//  검색 버튼 동작 (아직 구현 예정)
function searchRecipes() {
  const keyword = document.getElementById("searchInput").value;
  alert(`Search for: ${keyword} (기능 미구현)`);
}

//  이벤트 리스너 등록
document.addEventListener("DOMContentLoaded", () => {
  loadRecipes();

  const searchBtn = document.querySelector(".search-button");
  if (searchBtn) {
    searchBtn.addEventListener("click", searchRecipes);
  }
});
//필터 이벤트 연결
document.getElementById("typeFilter").addEventListener("change", applyFilter);
document.getElementById("difficultyFilter").addEventListener("change", applyFilter);
document.getElementById("timeFilter").addEventListener("change", applyFilter);
document.getElementById("allFilterBtn").addEventListener("click", loadRecipes);


//필터링
async function applyFilter() {
  const type = document.getElementById("typeFilter").value;
  const difficulty = document.getElementById("difficultyFilter").value;
  const time = document.getElementById("timeFilter").value;

  const params = new URLSearchParams();
  if (type) params.append("type", type);
  if (difficulty) params.append("difficulty", difficulty);
  if (time) params.append("cookingTimeCategory", time); // time이 아니라 cookingTimeCategory로 보내야 함!

  try {
    const res = await fetch(`/api/recipes/filter?${params.toString()}`);
    const recipes = await res.json();

    const list = document.getElementById("recipeList");
    list.innerHTML = "";

    recipes.forEach(recipe => {
      const card = document.createElement("div");
      card.classList.add("recipe-card");

      card.innerHTML = `
        <img src="${recipe.imageUrl || 'assets/default.jpg'}" alt="${recipe.title}" class="recipe-image">
        <div class="info">
          <h3>${recipe.title}</h3>
          <p class="meta">
            ⭐ ${recipe.difficulty} &nbsp;&nbsp;
            ⏱ ${recipe.cookingTime} min &nbsp;&nbsp;
            🍽 ${recipe.type}
          </p>
        </div>
      `;

      card.onclick = () => {
        window.location.href = `post.html?id=${recipe._id}`;
      };

      list.appendChild(card);
    });

  } catch (err) {
    console.error("Filter failed:", err);
  }
}

