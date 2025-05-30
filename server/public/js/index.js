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

// // 계정 아이콘 클릭 시 사용자 페이지로 이동
// function goToAccount() {
//     window.location.href = "account.html";
// }
  
// // "New Recipe" 버튼 클릭 시 글 작성 페이지로 이동
// function goToNewRecipe() {
//     window.location.href = "new-recipe.html";
// }

// function goToHome() {
//   window.location.href = "index.html";
// }


//   // async function loadRecipes() {
//   //   const res = await fetch("http://localhost:5000/api/recipes");
//   //   const recipes = await res.json();
  
//   //   const list = document.getElementById("recipeList");
//   //   recipes.forEach(recipe => {
//   //     const card = document.createElement("div");
//   //     card.classList.add("recipe-card");
//   //     card.innerHTML = `
//   //       <h3>${recipe.title}</h3>
//   //       <p>${recipe.difficulty} · ${recipe.time}분</p>
//   //     `;
//   //     list.appendChild(card);
//   //   });
//   // }

//   async function loadRecipes() {
//     const list = document.getElementById("recipeList");
  
//     // 서버 요청 대신 샘플 데이터 사용
//     const recipes = sampleRecipes;
  
//     list.innerHTML = ""; // 기존 카드 초기화
  
//     recipes.forEach(recipe => {
//       const card = document.createElement("div");
//       card.classList.add("recipe-card");
  
//       card.innerHTML = `
//         <img src="${recipe.imageUrl || 'assets/default.jpg'}" alt="${recipe.title}" class="recipe-image">
//         <div class="info">
//           <h3>${recipe.title}</h3>
//           <p class="meta">
//             ⭐ ${recipe.difficulty} &nbsp;&nbsp; ⏱ ${recipe.time} min &nbsp;&nbsp; 🍽 ${recipe.type}
//           </p>
//         </div>
//       `;
  
//       card.onclick = () => {
//         window.location.href = `post.html?id=${recipe.id}`;
//       };
  
//       list.appendChild(card);
//     });
//   }
  
  
//   document.addEventListener("DOMContentLoaded", loadRecipes);
  
//   function goToAccount() {
//     window.location.href = "account.html";
//   }
  
//   function searchRecipes() {
//     const keyword = document.getElementById("searchInput").value;
//     // 필터된 fetch 요청은 나중에 연결
//   }



// 계정/홈/글쓰기 페이지 이동 함수
function goToNewRecipe() {
  const user = sessionStorage.getItem("user");
  if (!user) {
    const redirect = encodeURIComponent("new-recipe.html");
    window.location.href = `login.html?redirect=${redirect}`;
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
  const user = sessionStorage.getItem("user");
  if (!user) {
    goToLogin();  // 로그인 안 되어 있으면 로그인하러 보내기
  } else {
    window.location.href = "account.html";
  }
}


// 레시피 로딩
async function loadRecipes() {
  const list = document.getElementById("recipeList");
  list.innerHTML = ""; // 기존 내용 초기화

  try {
    const res = await fetch("http://localhost:5000/api/recipes");
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
