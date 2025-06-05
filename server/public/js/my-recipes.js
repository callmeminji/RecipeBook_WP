function goToHome() {
  window.location.href = "index.html";
}

function goToAccount() {
  window.location.href = "account.html";
}

function isLoggedIn() {
  return sessionStorage.getItem("user") !== null;
}

function getToken() {
  return sessionStorage.getItem("token");
}

document.addEventListener("DOMContentLoaded", async () => {
  if (!isLoggedIn()) {
    alert("You must be logged in to view your recipes.");
    window.location.href = "login.html?redirect=account.html";
    return;
  }

  const list = document.getElementById("myRecipeList");
  list.innerHTML = "";

  try {
    const res = await fetch("/api/recipes/me/recipes", {
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    });

    if (!res.ok) {
      throw new Error("Failed to load your recipes");
    }

    const myRecipes = await res.json();

    if (myRecipes.length === 0) {
      list.innerHTML = "<p>You haven't created any recipes yet.</p>";
      return;
    }

    myRecipes.forEach(recipe => {
      const card = document.createElement("div");
      card.className = "recipe-card";

      card.innerHTML = `
        <img src="${recipe.image ? `/uploads/${recipe.image}` : 'assets/default.jpg'}" alt="${recipe.title}" class="recipe-image">
        <div class="info">
          <h3>${recipe.title}</h3>
          <p class="meta">
             ${recipe.difficulty} &nbsp;&nbsp;
             ${recipe.cookingTime} min &nbsp;&nbsp;
             ${recipe.type}
          </p>
        </div>
      `;

      card.onclick = () => {
        window.location.href = `post.html?id=${recipe._id}`;
      };

      list.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    list.innerHTML = "<p> Failed to load recipes. Please try again later.</p>";
  }
});
