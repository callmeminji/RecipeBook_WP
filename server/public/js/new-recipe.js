function goToHome() {
    window.location.href = "index.html";
  }
  
function goToAccount() {
    window.location.href = "account.html";
  }
  
  document.getElementById("recipeForm").addEventListener("submit", async function (e) {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("title", document.getElementById("title").value);
    formData.append("time", document.getElementById("time").value);
    
    // 아래 2줄로 나눠 저장
    formData.append("ingredients", document.getElementById("ingredients").value);
    formData.append("instructions", document.getElementById("instructions").value);
  
    const type = document.querySelector("input[name='type']:checked");
    const difficulty = document.querySelector("input[name='difficulty']:checked");
    if (type) formData.append("type", type.value);
    if (difficulty) formData.append("difficulty", difficulty.value);
  
    const image = document.getElementById("image").files[0];
    if (image) {
      formData.append("image", image);
    }
  
    try {
      const res = await fetch("http://localhost:5000/api/recipes", {
      method: "POST",
      body: formData
    });
  
      const data = await res.json();  // 서버 응답을 JSON으로 파싱
  
      if (res.ok && data.recipeId) {
        alert("Recipe submitted!");
        // 바로 post 페이지로 이동
        window.location.href = `post.html?id=${data.recipeId}`;
      } else {
        alert("Submission failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Error occurred.");
    }
  });
  
  