function goToHome() {
  window.location.href = "index.html";
}

function goToAccount() {
  window.location.href = "account.html";
}

function isLoggedIn() {
  return sessionStorage.getItem("user") !== null;
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
  window.location.href = `login.html?redirect=${encodeURIComponent(redirect)}`;
}

let comments = [
  { id: 1, user: "eunyoung", text: "Looks delicious!", isMine: true },
  { id: 2, user: "minji", text: "I'll try this recipe!", isMine: false }
];

let pendingDeleteCommentId = null;

document.addEventListener("DOMContentLoaded", () => {
  const postId = new URLSearchParams(window.location.search).get("id");

  // 예시 데이터
  document.getElementById("postTitle").textContent = "Kimchi Stew";
  document.getElementById("postType").textContent = "Korean";
  document.getElementById("postDifficulty").textContent = "Easy";
  document.getElementById("postTime").textContent = "Under 10 min";
  document.getElementById("postIngredients").textContent = "- Kimchi\n- Pork\n- Tofu";
  document.getElementById("postInstructions").textContent = "1. Stir-fry kimchi\n2. Add pork and boil\n3. Add tofu";
  document.getElementById("bookmarkCount").textContent = "12";

  // 북마크 버튼
  const bookmark = document.getElementById("bookmarkIcon");
  bookmark.addEventListener("click", () => {
    if (!isLoggedIn()) {
      showLoginPrompt(getCurrentPageURL());
      return;
    }
    bookmark.classList.toggle("active");
  });

  // 수정 버튼
  document.getElementById("editBtn").addEventListener("click", () => {
    const recipeData = {
      title: document.getElementById("postTitle").textContent,
      type: document.getElementById("postType").textContent,
      difficulty: document.getElementById("postDifficulty").textContent,
      time: parseInt(document.getElementById("postTime").textContent.replace(/\D/g, '')),
      ingredients: document.getElementById("postIngredients").textContent,
      instructions: document.getElementById("postInstructions").textContent
    };
    localStorage.setItem("editRecipe", JSON.stringify(recipeData));
    window.location.href = "new-recipe.html?edit=1";
  });

  // 삭제 버튼
  document.getElementById("deleteBtn").addEventListener("click", () => {
    document.getElementById("deleteModal").style.display = "flex";
    sessionStorage.setItem("previousPage", document.referrer);
  });

  // 댓글 렌더링
  renderComments();

  // 댓글 등록
  document.getElementById("commentForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const input = document.getElementById("commentInput");
    const newComment = input.value.trim();
    if (newComment) {
      comments.unshift({
        id: Date.now(),
        user: "eunyoung",
        text: newComment,
        isMine: true
      });
      input.value = "";
      renderComments();
    }
  });
});

function renderComments() {
  const container = document.getElementById("commentList");
  container.innerHTML = "";
  comments.forEach(comment => {
    const item = document.createElement("div");
    item.className = "comment-item";
    item.dataset.commentId = comment.id;
    item.innerHTML = `
      <div class="comment-header">
        <img src="assets/user-icon.png" class="comment-user-icon" />
        <span class="comment-user-id">${comment.user}</span>
        ${comment.isMine ? `
          <div class="comment-actions">
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
          </div>
        ` : ""}
      </div>
      <div class="comment-body">
        <p class="comment-text">${comment.text}</p>
      </div>
    `;
    container.appendChild(item);
  });
}

// 댓글 수정/삭제 이벤트
// document.addEventListener("click", function (e) {
//   if (e.target.classList.contains("edit-btn")) {
//     const item = e.target.closest(".comment-item");
//     const body = item.querySelector(".comment-body");
//     const oldText = item.querySelector(".comment-text").textContent;

//     body.innerHTML = "";

//     const textarea = document.createElement("textarea");
//     textarea.classList.add("edit-textarea");
//     textarea.value = oldText;

//     const saveBtn = document.createElement("button");
//     saveBtn.textContent = "Save";
//     saveBtn.classList.add("save-edit");

//     body.appendChild(textarea);
//     body.appendChild(saveBtn);
//   }

//   if (e.target.classList.contains("save-edit")) {
//     const item = e.target.closest(".comment-item");
//     const commentId = item.dataset.commentId;
//     const newText = item.querySelector("textarea").value;
//     const body = item.querySelector(".comment-body");

//     // 서버 PATCH 생략하고 로컬 반영
//     const comment = comments.find(c => c.id.toString() === commentId);
//     if (comment) comment.text = newText;

//     body.innerHTML = `<p class="comment-text">${newText}</p>`;
//   }

//   if (e.target.classList.contains("delete-btn")) {
//     const item = e.target.closest(".comment-item");
//     pendingDeleteCommentId = item.dataset.commentId;
//     document.getElementById("commentDeleteModal").style.display = "flex";
//   }
// });

document.addEventListener("click", function (e) {
  // Edit 버튼 클릭 시
  if (e.target.classList.contains("edit-btn")) {
    const item = e.target.closest(".comment-item");
    const commentTextEl = item.querySelector(".comment-text");
    const actionsEl = item.querySelector(".comment-actions");
    const oldText = commentTextEl.textContent;

    // 기존 텍스트 숨기고 Edit/Delete 숨김
    commentTextEl.style.display = "none";
    if (actionsEl) actionsEl.style.display = "none";

    // 이미 수정 중이면 return
    if (item.querySelector("textarea")) return;

    // textarea
    const textarea = document.createElement("textarea");
    textarea.className = "edit-textarea";
    textarea.value = oldText;
    textarea.style.width = "100%";
    textarea.style.marginTop = "0.5rem";

    // Save 버튼
    const saveBtn = document.createElement("button");
    saveBtn.className = "save-edit-btn";
    saveBtn.textContent = "Save";
    saveBtn.style.marginTop = "0.5rem";
    saveBtn.style.padding = "0.4rem 1.2rem";
    saveBtn.style.backgroundColor = "#f57c00";
    saveBtn.style.color = "white";
    saveBtn.style.border = "none";
    saveBtn.style.borderRadius = "6px";
    saveBtn.style.cursor = "pointer";
    saveBtn.style.fontWeight = "bold";
    saveBtn.style.marginLeft = "auto";

    commentTextEl.after(textarea, saveBtn);
  }

  // Save 버튼 클릭 시
  if (e.target.classList.contains("save-edit-btn")) {
    const item = e.target.closest(".comment-item");
    const textarea = item.querySelector("textarea");
    const newText = textarea.value.trim();
    const textEl = item.querySelector(".comment-text");
    const actionsEl = item.querySelector(".comment-actions");

    if (newText) {
      // 실제 서버 연결 시 patch 요청 가능
      // fetch(`/api/comments/${id}`, { method: "PATCH", ... })

      textEl.textContent = newText;
      textEl.style.display = "block";

      textarea.remove();
      e.target.remove();

      if (actionsEl) actionsEl.style.display = "flex"; // 다시 보이게
    }
  }

  // Delete 버튼 클릭 시 → 모달 열기
  if (e.target.classList.contains("delete-btn")) {
    const item = e.target.closest(".comment-item");
    pendingDeleteCommentId = item.dataset.commentId || item.getAttribute("data-comment-id");
    document.getElementById("commentDeleteModal").style.display = "flex";
  }
});

// 댓글 삭제 확인
function confirmCommentDelete() {
  if (!pendingDeleteCommentId) return;
  comments = comments.filter(c => c.id.toString() !== pendingDeleteCommentId);
  renderComments();
  closeCommentDeleteModal();
}

function closeCommentDeleteModal() {
  document.getElementById("commentDeleteModal").style.display = "none";
  pendingDeleteCommentId = null;
}

// 레시피 삭제 모달 관련
function closeDeleteModal() {
  document.getElementById("deleteModal").style.display = "none";
}

function confirmDelete() {
  const postId = new URLSearchParams(window.location.search).get("id");
  fetch(`http://localhost:5000/api/recipes/${postId}`, {
    method: "DELETE",
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
