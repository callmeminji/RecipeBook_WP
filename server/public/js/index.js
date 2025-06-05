// 샘플 데이터 테스트용
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


// 계정/홈/글쓰기 페이지 이동 함수
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

function goToLogin() {
  const redirect = encodeURIComponent(window.location.href);
  window.location.href = `login.html?redirect=${redirect}`;
}

function goToAccount() {
  if (!sessionStorage.getItem("user")) {
    showLoginPrompt("new-recipe.html");  // 로그인 안 되어 있으면 로그인하러 보내기
  } else {
    window.location.href = "account.html";
  }
}

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
  const redirect = modal.dataset.redirect || "index.html";
  window.location.href = `login.html?redirect=${encodeURIComponent(redirect)}`;
}



// 레시피 로딩
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
        window.location.href = `post.html?id=${recipe.id}`;
      };

      list.appendChild(card);
    });
  } catch (err) {
    console.error("Failed to load recipes:", err);
    list.innerHTML = "<p>😥 Failed to load recipes. Please try again later.</p>";
  }
}

// 페이지 로드 시 실행
document.addEventListener("DOMContentLoaded", loadRecipes);

// 검색 (추후 연결)
function searchRecipes() {
  const keyword = document.getElementById("searchInput").value;
  // TODO: keyword 기반 필터링 구현 예정
}
