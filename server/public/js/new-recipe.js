// API 서버 주소 설정
const BASE_URL = "https://recipeya.onrender.com";

// 페이지 로드 시 수정 모드인지 확인하고 기존 값 채우기
document.addEventListener("DOMContentLoaded", () => {
  const editMode = new URLSearchParams(window.location.search).get("edit");
  const editRecipe = localStorage.getItem("editRecipe");

  if (editMode && editRecipe) {
    const recipe = JSON.parse(editRecipe);
    document.getElementById("title").value = recipe.title || "";
    document.getElementById("time").value = recipe.cookingTime || "";
    document.getElementById("instructions").value = recipe.instructions || "";
    document.getElementById("ingredients").value = (recipe.ingredients || []).join("\n");

    if (recipe.type) {
      const typeRadio = document.querySelector(`input[name='type'][value='${recipe.type}']`);
      if (typeRadio) typeRadio.checked = true;
    }

    if (recipe.difficulty) {
      const diffRadio = document.querySelector(`input[name='difficulty'][value='${recipe.difficulty}']`);
      if (diffRadio) diffRadio.checked = true;
    }
  }
});

const form = document.getElementById("recipeForm");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const formData = new FormData();
  formData.append("title", document.getElementById("title").value);
  formData.append("cookingTime", document.getElementById("time").value);
  formData.append("instructions", document.getElementById("instructions").value);

  const type = document.querySelector("input[name='type']:checked");
  const difficulty = document.querySelector("input[name='difficulty']:checked");
  if (type) formData.append("type", type.value);
  if (difficulty) formData.append("difficulty", difficulty.value);

  const rawIngredients = document.getElementById("ingredients").value
    .split("\n")
    .map(i => i.trim())
    .filter(Boolean);
  rawIngredients.forEach(ing => {
    formData.append("ingredients", ing);
  });

  const image = document.getElementById("image").files[0];
  if (image) {
    formData.append("image", image);
  }

  const token = sessionStorage.getItem("token");
  if (!token) {
    alert("You must be logged in.");
    return;
  }

  // 수정 모드인지 확인
  const editMode = new URLSearchParams(window.location.search).get("edit");
  const editRecipe = localStorage.getItem("editRecipe");

  let url = `${BASE_URL}/api/recipes`;
  let method = "POST";

  if (editMode && editRecipe) {
    const recipe = JSON.parse(editRecipe);
    url = `${BASE_URL}/api/recipes/${recipe._id}`;
    method = "PUT";
  }

  try {
    const res = await fetch(url, {
      method: method,
      headers: {
        Authorization: "Bearer " + token,
      },
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      alert(editMode ? "Recipe updated!" : "Recipe submitted!");
      localStorage.removeItem("editRecipe"); // 수정 모드라면 로컬스토리지 초기화
      window.location.href = `post.html?id=${data.recipeId || JSON.parse(editRecipe)._id}`;
    } else {
      alert(data.message || "Failed to submit.");
    }
  } catch (err) {
    console.error("Error:", err);
    alert("An error occurred.");
  }
});
