function goToHome() {
    window.location.href = "index.html";
  }
  
  function logout() {
    // 나중에 토큰 삭제 등의 로직 추가 가능
    alert("You have been logged out.");
    window.location.href = "index.html";
  }
  
  function goToFavorites() {
    window.location.href = "favorites.html";
  }
  
  function goToMyRecipes() {
    window.location.href = "my-recipes.html";
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    const userId = "eunyoung"; // 나중에 로그인 상태에서 받아온 값으로 대체
    document.getElementById("userId").textContent = userId;
  });
  