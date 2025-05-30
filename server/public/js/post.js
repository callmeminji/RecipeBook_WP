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
      const redirectURL = getCurrentPageURL();
      window.location.href = `login.html?redirect=${redirectURL}`;
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
  