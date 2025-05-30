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

    // 로그인된 경우에만 토글
    bookmark.classList.toggle("active");
    // TODO: 스크랩 수 증가 및 서버 반영
  });

  // 본인 글이면 수정/삭제 버튼 보여줌
  const isOwner = true; // 나중에 세션과 비교
  if (isOwner) {
    document.getElementById("actionButtons").style.display = "flex";
  }
});

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
  window.location.href = "new-recipe.html?edit=1"; // edit 모드로 이동
});



// 샘플 댓글 데이터 (나중에 서버에서 불러올 수 있음)
let comments = [
  { id: 1, user: "eunyoung", text: "Looks delicious!", isMine: true },
  { id: 2, user: "minji", text: "I'll try this recipe!", isMine: false }
];

// 댓글 렌더링 함수
function renderComments() {
  const container = document.getElementById("commentList");
  container.innerHTML = "";

  comments.forEach(comment => {
    const item = document.createElement("div");
    item.className = "comment-item";

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
      <p class="comment-text">${comment.text}</p>
    `;

    container.appendChild(item);
  });
}

// 댓글 등록 버튼 이벤트
document.getElementById("commentForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const input = document.getElementById("commentInput");
  const newComment = input.value.trim();

  if (newComment) {
    comments.unshift({
      id: Date.now(),
      user: "eunyoung",  // 실제 로그인된 유저로 대체
      text: newComment,
      isMine: true
    });

    input.value = "";
    renderComments();
  }
});

// 초기 실행
document.addEventListener("DOMContentLoaded", () => {
  renderComments();
});

// Delete 버튼 누르면 모달 열기
document.getElementById("deleteBtn").addEventListener("click", () => {
  document.getElementById("deleteModal").style.display = "flex";

  // 현재 페이지 저장해두기 (이전 페이지로 돌아가기 위해)
  sessionStorage.setItem("previousPage", document.referrer);
});

// 취소 버튼
function closeDeleteModal() {
  document.getElementById("deleteModal").style.display = "none";
}

// 삭제 확정
function confirmDelete() {
  const postId = new URLSearchParams(window.location.search).get("id");

  // 백엔드로 DELETE 요청
  fetch(`http://localhost:5000/api/recipes/${postId}`, {
    method: "DELETE",
  })
    .then(res => {
      if (res.ok) {
        alert("Recipe deleted.");

        // 이전 페이지로 이동
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
