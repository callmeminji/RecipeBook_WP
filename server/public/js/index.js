// 페이지 이동 관련
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

// 로그인 필요 모달 처리
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

// 레시피 카드 생성 함수
function createRecipeCard(recipe) {
  const card = document.createElement("div");
  card.classList.add("recipe-card");

  const imageUrl = recipe.image ? `/uploads/${recipe.image}` : 'assets/default.png';

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

  return card;
}


// 전체 레시피 목록 불러오기
async function loadRecipes() {
  const list = document.getElementById("recipeList");
  list.innerHTML = "";

  try {
    const res = await fetch("/api/recipes");
    const recipes = await res.json();

    recipes.forEach(recipe => {
      list.appendChild(createRecipeCard(recipe));
    });

  } catch (err) {
    console.error("Failed to load recipes:", err);
    list.innerHTML = "<p class='error-msg'>레시피를 불러오는 데 실패했습니다.</p>";
  }
}

// 제목 검색 기능
async function searchRecipes() {
  const keyword = document.getElementById("searchInput").value.trim();
  const list = document.getElementById("recipeList");
  list.innerHTML = "";

  if (!keyword) {
    loadRecipes();
    return;
  }

  try {
    const res = await fetch(`/api/recipes/search?keyword=${encodeURIComponent(keyword)}`);
    const recipes = await res.json();

    if (recipes.length === 0) {
      list.innerHTML = "<p class='error-msg'>검색 결과가 없습니다.</p>";
      return;
    }

    recipes.forEach(recipe => {
      list.appendChild(createRecipeCard(recipe));
    });

  } catch (err) {
    console.error("검색 실패:", err);
    list.innerHTML = "<p class='error-msg'>검색 중 오류가 발생했습니다.</p>";
  }
}

// 필터링 요청
async function applyFilter() {
  const type = document.getElementById("typeFilter").value;
  const difficulty = document.getElementById("difficultyFilter").value;
  const timeCategory = document.getElementById("timeFilter").value;

  const params = new URLSearchParams();
  if (type) params.append("type", type);
  if (difficulty) params.append("difficulty", difficulty);
  if (timeCategory) params.append("cookingTimeCategory", timeCategory);

  try {
    const res = await fetch(`/api/recipes/filter?${params.toString()}`);
    const recipes = await res.json();

    const list = document.getElementById("recipeList");
    list.innerHTML = "";

    // All 버튼 active 해제
    document.getElementById("allFilterBtn").classList.remove("active");

    recipes.forEach(recipe => {
      list.appendChild(createRecipeCard(recipe));
    });

  } catch (err) {
    console.error("Filter failed:", err);
  }
}

// 초기화 및 이벤트 등록
document.addEventListener("DOMContentLoaded", () => {
  loadRecipes();

  // 검색 버튼
  const searchBtn = document.querySelector(".search-button");
  if (searchBtn) {
    searchBtn.addEventListener("click", searchRecipes);
  }

  // 필터 이벤트
  document.getElementById("typeFilter").addEventListener("change", applyFilter);
  document.getElementById("difficultyFilter").addEventListener("change", applyFilter);
  document.getElementById("timeFilter").addEventListener("change", applyFilter);

  // 전체 보기 버튼
  document.getElementById("allFilterBtn").addEventListener("click", (e) => {
    e.preventDefault();
    loadRecipes();

    // All 버튼 active 클래스 추가
    const allBtn = document.getElementById("allFilterBtn");
    allBtn.classList.add("active");

    // select 필터 초기화
    document.getElementById("typeFilter").value = "";
    document.getElementById("difficultyFilter").value = "";
    document.getElementById("timeFilter").value = "";
  });
});