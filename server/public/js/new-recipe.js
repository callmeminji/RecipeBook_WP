// API 서버 주소 설정
const BASE_URL = "https://recipeya.onrender.com";

function goToHome() {
  window.location.href = "index.html";
}

function goToAccount() {
  window.location.href = "account.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("recipeForm");
  if (!form) {
    console.error("recipeForm not found!");
    return;
  }

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
      alert("You must be logged in to submit a recipe.");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/recipes`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token
        },
        body: formData
      });

      const data = await res.json();

      if (res.ok && data.recipeId) {
        alert("Recipe submitted!");
        window.location.href = `post.html?id=${data.recipeId}`;
      } else {
        alert(data.message || "Submission failed.");
      }
    } catch (err) {
      console.error("Error submitting recipe:", err);
      alert("Error occurred.");
    }
  });

  // 조리 시간 슬라이더 표시
  const timeSlider = document.getElementById("time");
  const timeOutput = document.getElementById("timeOutput");

  timeSlider.addEventListener("input", () => {
    const value = parseInt(timeSlider.value, 10);
    timeOutput.innerText = value === 60 ? "60+ min" : `${value} min`;
  });

  // 수정 모드일 경우 값 채우기
  const editMode = new URLSearchParams(window.location.search).get("edit");
  if (editMode && localStorage.getItem("editRecipe")) {
    const recipe = JSON.parse(localStorage.getItem("editRecipe"));
    document.getElementById("title").value = recipe.title;
    document.querySelector(`input[name="type"][value="${recipe.type}"]`).checked = true;
    document.querySelector(`input[name="difficulty"][value="${recipe.difficulty}"]`).checked = true;
    timeSlider.value = recipe.time;
    timeOutput.innerText = recipe.time === 60 ? "60+ min" : `${recipe.time} min`;
    document.getElementById("ingredients").value = Array.isArray(recipe.ingredients)
      ? recipe.ingredients.join("\n")
      : recipe.ingredients;
    document.getElementById("instructions").value = recipe.instructions;
  } else {
    timeOutput.innerText = `${timeSlider.value} min`;
  }
});
