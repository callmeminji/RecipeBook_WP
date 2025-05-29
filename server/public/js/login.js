function goToHome() {
    window.location.href = "index.html";
  }
  
  document.getElementById("signupForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("signupUsername").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;
  
    console.log("📬 회원가입:", { username, email, password });
  
    // 나중에 fetch로 서버에 POST 요청하면 됨
  });
  
  document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
  
    console.log("🔐 로그인:", { email, password });
  
    // 나중에 fetch로 로그인 요청 가능
  });
  