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

  fetch('/api/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password }),
  })
    .then((res) => {
      if (!res.ok) throw new Error('회원가입 실패');
      return res.json();
    })
    .then((data) => {
      alert('회원가입 성공! 로그인 해주세요.');
      location.reload(); // 새로고침하여 로그인 탭으로 전환
    })
    .catch((err) => {
      alert('회원가입 중 오류 발생');
      console.error(err);
    });
});

// 로그인 처리
document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  console.log("🔐 로그인:", { email, password });

  fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => {
      if (!res.ok) throw new Error('로그인 실패');
      return res.json();
    })
    .then((data) => {
      if (!data.user) throw new Error('사용자 정보가 없습니다.');
      sessionStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = redirectTo;
    })
    .catch((err) => {
      alert('로그인 실패: ' + err.message);
      console.error(err);
    });
});
