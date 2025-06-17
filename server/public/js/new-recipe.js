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
      window.location.href = `post.html?id=${data.recipeId || JSON.parse(editRecipe)._id}`;
    } else {
      alert(data.message || "Failed to submit.");
    }
  } catch (err) {
    console.error("Error:", err);
    alert("An error occurred.");
  }
});
