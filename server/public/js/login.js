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
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    if (res.status === 409) {
      showModal("signupExistsModal"); // 이미 존재하는 계정
    } else if (res.ok) {
      showModal("signupSuccessModal"); // 회원가입 성공
    } else {
      alert("Signup failed.");
    }
  } catch (err) {
    console.error("Signup error:", err);
    alert("Something went wrong during signup.");
  }
});

// 로그인 처리
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const data = await res.json();

      if (!data.user || !data.token) {
        throw new Error("로그인 응답에 사용자 정보 또는 토큰이 없습니다.");
      }

      // 세션에 저장
      sessionStorage.setItem("user", JSON.stringify(data.user));
      sessionStorage.setItem("token", data.token);

      // 리디렉션 이동
      window.location.href = redirectTo;
    } else {
      showModal("loginFailedModal"); // 로그인 실패 시 모달
    }
  } catch (err) {
    console.error("Login error:", err);
    alert("Something went wrong during login.");
  }
});