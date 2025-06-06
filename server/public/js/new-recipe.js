function goToHome() {
  window.location.href = "index.html";
}

function goToAccount() {
  window.location.href = "account.html";
}

document.getElementById("recipeForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const formData = new FormData();
  formData.append("title", document.getElementById("title").value);
  formData.append("cookingTime", document.getElementById("time").value);
  formData.append("instructions", document.getElementById("instructions").value); // 서버에서 content로 매핑됨

  const type = document.querySelector("input[name='type']:checked");
  const difficulty = document.querySelector("input[name='difficulty']:checked");
  if (type) formData.append("type", type.value);
  if (difficulty) formData.append("difficulty", difficulty.value);

  // 재료 입력 (줄바꿈 기준), 개별로 FormData에 넣기
  const rawIngredients = document.getElementById("ingredients").value
    .split("\n")
    .map(i => i.trim())
    .filter(Boolean);

  rawIngredients.forEach(ing => {
    formData.append("ingredients", ing);
  });

  // 이미지 업로드
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
    const res = await fetch("/api/recipes", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token
        // Content-Type은 FormData일 경우 자동 설정됨 → 절대 직접 넣지 말 것!
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

document.addEventListener("DOMContentLoaded", () => {
  const editMode = new URLSearchParams(window.location.search).get("edit");
  if (editMode && localStorage.getItem("editRecipe")) {
    const recipe = JSON.parse(localStorage.getItem("editRecipe"));
    document.getElementById("title").value = recipe.title;
    document.querySelector(`input[name="type"][value="${recipe.type}"]`).checked = true;
    document.querySelector(`input[name="difficulty"][value="${recipe.difficulty}"]`).checked = true;
    document.getElementById("time").value = recipe.time;
    document.getElementById("timeOutput").value = recipe.time;
    document.getElementById("ingredients").value = Array.isArray(recipe.ingredients)
      ? recipe.ingredients.join("\n")
      : recipe.ingredients;
    document.getElementById("instructions").value = recipe.instructions;
  }
});
