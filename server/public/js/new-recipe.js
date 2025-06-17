// API 서버 주소 설정
const BASE_URL = "https://recipeya.onrender.com";

function goToHome() {
  window.location.href = "index.html";
}

function goToAccount() {
  window.location.href = "account.html";
}

// 페이지 로드 시 수정 모드인지 확인하고 기존 값 채우기
document.addEventListener("DOMContentLoaded", () => {
  const editMode = new URLSearchParams(window.location.search).get("edit");
  const editRecipe = localStorage.getItem("editRecipe");

  if (editMode && editRecipe) {
    const recipe = JSON.parse(editRecipe);
    document.getElementById("title").value = recipe.title || "";
    document.getElementById("time").value = recipe.cookingTime || recipe.time || "";
    document.getElementById("instructions").value = recipe.instructions || recipe.content || "";

    const ing = recipe.ingredients;
    document.getElementById("ingredients").value =
      Array.isArray(ing) ? ing.join("\n") : (typeof ing === "string" ? ing : "");

    // 라디오 버튼은 소문자 비교로 안전하게 체크
    if (recipe.type) {
      const typeRadio = document.querySelector(`input[name='type'][value='${recipe.type.toLowerCase()}']`);
      if (typeRadio) typeRadio.checked = true;
    }

    if (recipe.difficulty) {
      const diffRadio = document.querySelector(`input[name='difficulty'][value='${recipe.difficulty.toLowerCase()}']`);
      if (diffRadio) diffRadio.checked = true;
    }
  }
  // 슬라이더 값 실시간 표시
const timeInput = document.getElementById("time");
const timeOutput = document.getElementById("timeOutput");

if (timeInput && timeOutput) {
  timeOutput.textContent = `${timeInput.value} min`;

  timeInput.addEventListener("input", () => {
    timeOutput.textContent = `${timeInput.value} min`;
  });
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

  const editMode = new URLSearchParams(window.location.search).get("edit");
  const editRecipe = localStorage.getItem("editRecipe");

  let url = `${BASE_URL}/api/recipes`;
  let method = "POST";
  let targetId = null;

  if (editMode && editRecipe) {
  const recipe = JSON.parse(editRecipe);
  document.getElementById("title").value = recipe.title || "";
  document.getElementById("time").value = recipe.cookingTime || recipe.time || "";
  document.getElementById("instructions").value = recipe.instructions || recipe.content || "";

  const ing = recipe.ingredients;
  document.getElementById("ingredients").value =
    Array.isArray(ing) ? ing.join("\n") : (typeof ing === "string" ? ing : "");

  //  Type 라디오 버튼 체크
  if (recipe.type) {
    const typeRadios = document.querySelectorAll("input[name='type']");
    typeRadios.forEach(radio => {
      if (radio.value.toLowerCase() === recipe.type.toLowerCase()) {
        radio.checked = true;
      }
    });
  }

  //  Difficulty 라디오 버튼 체크
  if (recipe.difficulty) {
    const diffRadios = document.querySelectorAll("input[name='difficulty']");
    diffRadios.forEach(radio => {
      if (radio.value.toLowerCase() === recipe.difficulty.toLowerCase()) {
        radio.checked = true;
      }
    });
  }

  //  이미지 미리보기 (선택사항)
  if (recipe.imageUrl) {
    const preview = document.getElementById("imagePreview");
    if (preview) preview.src = recipe.imageUrl;
  }
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
      localStorage.removeItem("editRecipe");

      const finalId = data.recipeId || (data.recipe && data.recipe._id) || targetId;
      window.location.href = `post.html?id=${finalId}`;
    } else {
      alert(data.message || "Failed to submit.");
    }
  } catch (err) {
    console.error("Error:", err);
    alert("An error occurred.");
  }
});
