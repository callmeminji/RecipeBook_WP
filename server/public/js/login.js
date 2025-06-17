// API 서버 주소 설정
const BASE_URL = "https://recipeya.onrender.com";

function goToHome() {
  window.location.href = "index.html";
}

// 리디렉션 주소 가져오기
const params = new URLSearchParams(window.location.search);
const redirectRaw = params.get("redirect");
const redirectTo = redirectRaw ? decodeURIComponent(redirectRaw) : "index.html";

// 모달 열고 닫는 함수
function showModal(id) {
  document.getElementById(id).style.display = "flex";
}

function closeModal(id) {
  document.getElementById(id).style.display = "none";
}

// 회원가입 처리
document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("signupUsername").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  try {
    const res = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    if (res.status === 409) {
      showModal("signupExistsModal");
    } else if (res.ok) {
      showModal("signupSuccessModal");
    } else {
      alert("회원가입에 실패했습니다.");
    }
  } catch (err) {
    console.error("Signup error:", err);
    alert("회원가입 중 오류가 발생했습니다.");
  }
});

// 로그인 처리
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const data = await res.json();

      if (!data.user || !data.token) {
        throw new Error("로그인 응답에 사용자 정보 또는 토큰이 없습니다.");
      }

      sessionStorage.setItem("user", JSON.stringify(data.user));
      sessionStorage.setItem("token", data.token);

      window.location.href = redirectTo;
    } else {
      showModal("loginFailedModal");
    }
  } catch (err) {
    console.error("Login error:", err);
    alert("로그인 중 오류가 발생했습니다.");
  }
});
