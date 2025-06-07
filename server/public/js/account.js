function goToHome() {
  window.location.href = "index.html";
}

function goToFavorites() {
  window.location.href = "favorites.html";
}

function goToMyRecipes() {
  window.location.href = "my-recipes.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const userIdElement = document.getElementById("userId");

  // 로그인 안 되어 있으면 로그인 페이지로 리디렉션
  if (!user) {
    alert("로그인이 필요합니다.");
    window.location.href = "login.html";
    return;
  }

  // 사용자 이메일 or 이름 표시
  if (userIdElement) {
    userIdElement.textContent = user.email || user.username || "사용자";
  }

  // 로그아웃 버튼 이벤트
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      sessionStorage.clear();  // user + token 모두 제거
      alert("You have been logged out.");
      window.location.href = "index.html";
    });
  }
});
