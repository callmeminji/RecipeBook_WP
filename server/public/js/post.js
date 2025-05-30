function goToHome() {
    window.location.href = "index.html";
  }
  
  function goToAccount() {
    window.location.href = "account.html";
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
  
    // 북마크 토글
    const bookmark = document.getElementById("bookmarkIcon");
    bookmark.addEventListener("click", () => {
      bookmark.classList.toggle("active");
      let countEl = document.getElementById("bookmarkCount");
      let current = parseInt(countEl.textContent) || 0;
      countEl.textContent = bookmark.classList.contains("active")
        ? `${current + 1} bookmarks`
        : `${current - 1} bookmarks`;
    });
  
    // 본인 글인 경우만 수정/삭제 표시
    const isOwner = true;
    if (isOwner) {
      document.getElementById("actionButtons").style.display = "flex";
    }
  });
  