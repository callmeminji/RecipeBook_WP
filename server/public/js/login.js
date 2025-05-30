function goToHome() {
  window.location.href = "index.html";
}

// 리디렉션 주소 가져오기
const params = new URLSearchParams(window.location.search);
const redirectTo = params.get("redirect") || "index.html";

// 회원가입 처리
document.getElementById("signupForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("signupUsername").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  console.log("📬 회원가입:", { username, email, password });

  // TODO: fetch로 서버에 POST 요청
  alert("회원가입 완료! 로그인 해주세요.");
  location.reload(); // 새로고침하여 로그인 탭으로 전환
});

// 로그인 처리
document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  console.log("🔐 로그인:", { email, password });

  // 로그인 성공한 것처럼 세션 저장 (나중에 서버 연동 예정)
  sessionStorage.setItem("user", JSON.stringify({ email }));

  // 이전 페이지로 리디렉션
  window.location.href = redirectTo;
});
