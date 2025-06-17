// API 서버 주소 설정
const BASE_URL = "https://recipeya.onrender.com";

function goToHome() {
  window.location.href = "index.html";
}

function goToAccount() {
  window.location.href = "account.html";
}

function isLoggedIn() {
  return sessionStorage.getItem("user") !== null;
}

function getCurrentUser() {
  const user = sessionStorage.getItem("user");
  return user ? JSON.parse(user).username : null;
}

function getCurrentPageURL() {
  return encodeURIComponent(window.location.pathname + window.location.search);
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
  window.location.href = `login.html?redirect=${redirect}`;
}

let pendingDeleteCommentId = null;
let currentRecipeId = null;

const bookmark = document.getElementById("bookmarkIcon");

function setBookmarkIcon(isActive) {
  bookmark.src = isActive ? "assets/filledheart.png" : "assets/emptyheart.png";
}

document.addEventListener("DOMContentLoaded", () => {
  currentRecipeId = new URLSearchParams(window.location.search).get("id");

  loadRecipeDetail();
  loadComments();

  bookmark.addEventListener("click", async () => {
    if (!isLoggedIn()) {
      showLoginPrompt(getCurrentPageURL());
      return;
    }

    const isActive = bookmark.classList.contains("active");
    const token = sessionStorage.getItem("token");

    try {
      const method = isActive ? "DELETE" : "POST";
      const res = await fetch(`${BASE_URL}/api/recipes/${currentRecipeId}/bookmark`, {
        method,
        headers: { Authorization: "Bearer " + token },
      });

      if (res.ok) {
        const data = await res.json();
        setBookmarkIcon(data.isBookmarked);
        document.getElementById("bookmarkCount").textContent = data.bookmarkCount;
        bookmark.classList.toggle("active", data.isBookmarked);
      } else {
        alert("북마크 처리 실패");
      }
    } catch (err) {
      console.error("Bookmark error:", err);
      alert("북마크 처리 중 오류 발생");
    }
  });

  document.getElementById("editBtn").addEventListener("click", () => {
    const ingredientsText = document.getElementById("postIngredients").textContent;
    const ingredientsArray = ingredientsText.split(',').map(item => item.trim());

    const recipeData = {
      _id: currentRecipeId,
      title: document.getElementById("postTitle").textContent,
      type: document.getElementById("postType").textContent,
      difficulty: document.getElementById("postDifficulty").textContent,
      cookingTime: parseInt(document.getElementById("postTime").textContent.replace(/\D/g, '')),
      ingredients: ingredientsArray,
      content: document.getElementById("postInstructions").textContent,
    };

    localStorage.setItem("editRecipe", JSON.stringify(recipeData));
    window.location.href = `new-recipe.html?edit=1&id=${currentRecipeId}`;
  });

  document.getElementById("commentForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    if (!isLoggedIn()) {
      showLoginPrompt(getCurrentPageURL());
      return;
    }

    const input = document.getElementById("commentInput");
    const content = input.value.trim();
    const user = getCurrentUser();

    if (content) {
      try {
        const res = await fetch(`${BASE_URL}/api/comments/${currentRecipeId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
          body: JSON.stringify({ content, user }),
        });
        if (res.ok) {
          input.value = "";
          loadComments();
        } else {
          alert("Failed to post comment.");
        }
      } catch (err) {
        console.error(err);
        alert("Error posting comment.");
      }
    }
  });
});

async function loadRecipeDetail() {
  try {
    const token = sessionStorage.getItem("token");
    const headers = token ? { Authorization: "Bearer " + token } : {};
    const res = await fetch(`${BASE_URL}/api/recipes/${currentRecipeId}`, { headers });
    if (!res.ok) throw new Error("Recipe not found");
    const recipe = await res.json();

    document.getElementById("postTitle").textContent = recipe.title;
    document.getElementById("postType").textContent = recipe.type;
    document.getElementById("postDifficulty").textContent = recipe.difficulty;
    document.getElementById("postTime").textContent = `${recipe.cookingTime} min`;
    document.getElementById("postIngredients").textContent = Array.isArray(recipe.ingredients) ? recipe.ingredients.join(", ") : recipe.ingredients;
    document.getElementById("postInstructions").textContent = recipe.instructions;
    document.getElementById("postImage").src = recipe.image ? `/uploads/${recipe.image}` : "assets/default.jpg";
    document.getElementById("bookmarkCount").textContent = recipe.bookmarkCount || "0";

    setBookmarkIcon(recipe.isBookmarked);
    bookmark.classList.toggle("active", recipe.isBookmarked);

    const currentUser = JSON.parse(sessionStorage.getItem("user"));
    const authorId = typeof recipe.author === "string" ? recipe.author : recipe.author._id;
    if (!currentUser || currentUser._id !== authorId) {
      document.getElementById("editBtn").style.display = "none";
      document.getElementById("deleteBtn").style.display = "none";
    }
  } catch (err) {
    console.error(err);
    alert("Failed to load recipe.");
  }
}

async function loadComments() {
  try {
    const res = await fetch(`${BASE_URL}/api/comments/${currentRecipeId}`);
    const data = await res.json();
    renderComments(data.comments || []);
  } catch (err) {
    console.error("Failed to load comments:", err);
  }
}

function renderComments(comments) {
  const container = document.getElementById("commentList");
  container.innerHTML = "";
  const currentUser = getCurrentUser();

  comments.forEach(comment => {
    const item = document.createElement("div");
    item.className = "comment-item";
    item.dataset.commentId = comment._id;
    item.innerHTML = `
      <div class="comment-header">
        <img src="assets/user-icon.png" class="comment-user-icon" />
        <span class="comment-user-id">${comment.author?.username || 'Unknown'}</span>
        ${comment.author?.username === currentUser ? `
          <div class="comment-actions">
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
          </div>` : ""}
      </div>
      <div class="comment-body">
        <p class="comment-text">${comment.content}</p>
      </div>
    `;
    container.appendChild(item);
  });
}

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("edit-btn")) {
    const item = e.target.closest(".comment-item");
    const commentTextEl = item.querySelector(".comment-text");
    const actionsEl = item.querySelector(".comment-actions");
    const oldText = commentTextEl.textContent;

    commentTextEl.style.display = "none";
    if (actionsEl) actionsEl.style.display = "none";
    if (item.querySelector("textarea")) return;

    const textarea = document.createElement("textarea");
    textarea.className = "edit-textarea";
    textarea.value = oldText;

    const saveBtn = document.createElement("button");
    saveBtn.className = "save-edit-btn";
    saveBtn.textContent = "Save";

    const wrapper = document.createElement("div");
    wrapper.className = "save-edit-wrapper";
    wrapper.appendChild(saveBtn);

    commentTextEl.after(textarea, wrapper);
  }

  if (e.target.classList.contains("save-edit-btn")) {
    const item = e.target.closest(".comment-item");
    const commentId = item.dataset.commentId;
    const newText = item.querySelector("textarea").value.trim();
    const commentTextEl = item.querySelector(".comment-text");
    const actionsEl = item.querySelector(".comment-actions");

    fetch(`${BASE_URL}/api/comments/${commentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
      body: JSON.stringify({ content: newText }),
    })
      .then(res => {
        if (res.ok) {
          commentTextEl.textContent = newText;
          commentTextEl.style.display = "block";
          item.querySelector("textarea").remove();
          e.target.remove();
          if (actionsEl) actionsEl.style.display = "flex";
        } else {
          alert("Failed to update comment.");
        }
      })
      .catch(err => {
        console.error(err);
        alert("Error updating comment.");
      });
  }

  if (e.target.classList.contains("delete-btn")) {
    const item = e.target.closest(".comment-item");
    pendingDeleteCommentId = item.dataset.commentId;
    document.getElementById("commentDeleteModal").style.display = "flex";
  }
});

function confirmCommentDelete() {
  if (!pendingDeleteCommentId) return;

  fetch(`${BASE_URL}/api/comments/${pendingDeleteCommentId}`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("token"),
    },
  })
    .then(res => {
      if (res.ok) {
        loadComments();
      } else {
        alert("Failed to delete comment.");
      }
    })
    .catch(err => {
      console.error(err);
      alert("Error deleting comment.");
    });

  closeCommentDeleteModal();
}

function closeCommentDeleteModal() {
  document.getElementById("commentDeleteModal").style.display = "none";
  pendingDeleteCommentId = null;
}

function closeDeleteModal() {
  document.getElementById("deleteModal").style.display = "none";
}

function confirmDelete() {
  fetch(`${BASE_URL}/api/recipes/${currentRecipeId}`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("token"),
    },
  })
    .then(res => {
      if (res.ok) {
        alert("Recipe deleted.");
        const prev = sessionStorage.getItem("previousPage") || "index.html";
        window.location.href = prev;
      } else {
        alert("Failed to delete recipe.");
      }
    })
    .catch(err => {
      console.error(err);
      alert("Error occurred.");
    });
}
