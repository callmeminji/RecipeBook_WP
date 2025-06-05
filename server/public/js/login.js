function goToHome() {
  window.location.href = "index.html";
}

// 리디렉션 주소 가져오기
const params = new URLSearchParams(window.location.search);
const redirectTo = params.get("redirect") || "index.html";

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
    console.error(err);
    alert("Something went wrong.");
  }
});

// 로그인 처리
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  console.log(" 로그인:", { email, password });

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const data = await res.json();

      if (!data.user) {
        throw new Error("사용자 정보가 없습니다.");
      }

      sessionStorage.setItem("user", JSON.stringify(data.user));

      // 리디렉션
      window.location.href = redirectTo;
    } else {
      showModal("loginFailedModal"); // 로그인 실패 시 모달
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong.");
  }
});
