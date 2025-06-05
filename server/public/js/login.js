function goToHome() {
  window.location.href = "index.html";
}

// 리디렉션 주소 가져오기
const params = new URLSearchParams(window.location.search);
const redirectTo = params.get("redirect") || "index.html";

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
    const res = await fetch("http://localhost:5000/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password })
    });

fetch('/api/auth/signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ username, email, password }),
})
  .then((res) => {
    if (res.status === 409) {
      showModal("signupExistsModal"); // 중복 이메일
    } else if (res.ok) {
      showModal("signupSuccessModal"); // 성공
    } else {
      alert("Signup failed.");
    }
  })
  .catch((err) => {
    console.error(err);
    alert("Something went wrong.");
  });



// 로그인 처리
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const res = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

<<<<<<< HEAD
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
=======
    if (res.ok) {
      const data = await res.json();
      sessionStorage.setItem("user", JSON.stringify(data));
      
      // 이전 페이지로 리디렉션
      const redirect = new URLSearchParams(window.location.search).get("redirect") || "index.html";
      window.location.href = redirect;
    } else {
      showModal("loginFailedModal");
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong.");
  }
>>>>>>> 2bff4d5e96e779ddbd610496bb10b048e8e4e086
});
