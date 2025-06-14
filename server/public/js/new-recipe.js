function goToHome() {
  window.location.href = "index.html";
}

function goToAccount() {
  window.location.href = "account.html";
}
document.addEventListener("DOMContentLoaded", () => {
  // 등록 이벤트도 DOM이 준비된 뒤에 걸어야 함
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
      const res = await fetch("/api/recipes", {
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

  // 아래는 이미 감싸져 있던 로직이니까 그대로 OK
  const editMode = new URLSearchParams(window.location.search).get("edit");
  const timeSlider = document.getElementById("time");
  const timeOutput = document.getElementById("timeOutput");

  timeSlider.addEventListener("input", () => {
    const value = parseInt(timeSlider.value, 10);
    timeOutput.innerText = value === 60 ? "60+ min" : `${value} min`;
  });

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


// document.getElementById("recipeForm").addEventListener("submit", async function (e) {
//   e.preventDefault();

//   const formData = new FormData();
//   formData.append("title", document.getElementById("title").value);
//   formData.append("cookingTime", document.getElementById("time").value);
//   formData.append("instructions", document.getElementById("instructions").value); // 서버에서 content로 매핑됨

//   const type = document.querySelector("input[name='type']:checked");
//   const difficulty = document.querySelector("input[name='difficulty']:checked");
//   if (type) formData.append("type", type.value);
//   if (difficulty) formData.append("difficulty", difficulty.value);

//   // 재료 입력 (줄바꿈 기준), 개별로 FormData에 넣기
//   const rawIngredients = document.getElementById("ingredients").value
//     .split("\n")
//     .map(i => i.trim())
//     .filter(Boolean);

//   rawIngredients.forEach(ing => {
//     formData.append("ingredients", ing);
//   });

//   // 이미지 업로드
//   const image = document.getElementById("image").files[0];
//   if (image) {
//     formData.append("image", image);
//   }

//   const token = sessionStorage.getItem("token");
//   if (!token) {
//     alert("You must be logged in to submit a recipe.");
//     return;
//   }

//   try {
//     const res = await fetch("/api/recipes", {
//       method: "POST",
//       headers: {
//         Authorization: "Bearer " + token
//         // Content-Type은 FormData일 경우 자동 설정됨 → 절대 직접 넣지 말 것!
//       },
//       body: formData
//     });

//     const data = await res.json();

//     if (res.ok && data.recipeId) {
//       alert("Recipe submitted!");
//       window.location.href = `post.html?id=${data.recipeId}`;
//     } else {
//       alert(data.message || "Submission failed.");
//     }
//   } catch (err) {
//     console.error("Error submitting recipe:", err);
//     alert("Error occurred.");
//   }
// });

// document.addEventListener("DOMContentLoaded", () => {
//   const editMode = new URLSearchParams(window.location.search).get("edit");
//   const timeSlider = document.getElementById("time");
//   const timeOutput = document.getElementById("timeOutput");

//   // 슬라이더 변화 시 "60+" 표시
//   timeSlider.addEventListener("input", () => {
//     const value = parseInt(timeSlider.value, 10);
//     timeOutput.innerText = value === 60 ? "60+ min" : `${value} min`;
//   });

//   // 수정 모드면 기존 값 적용
//   if (editMode && localStorage.getItem("editRecipe")) {
//     const recipe = JSON.parse(localStorage.getItem("editRecipe"));
//     document.getElementById("title").value = recipe.title;
//     document.querySelector(`input[name="type"][value="${recipe.type}"]`).checked = true;
//     document.querySelector(`input[name="difficulty"][value="${recipe.difficulty}"]`).checked = true;
//     timeSlider.value = recipe.time;
//     timeOutput.innerText = recipe.time === 60 ? "60+ min" : `${recipe.time} min`;
//     document.getElementById("ingredients").value = Array.isArray(recipe.ingredients)
//       ? recipe.ingredients.join("\n")
//       : recipe.ingredients;
//     document.getElementById("instructions").value = recipe.instructions;
//   } else {
//     // 기본값 초기 출력
//     timeOutput.innerText = `${timeSlider.value} min`;
//   }
// });
