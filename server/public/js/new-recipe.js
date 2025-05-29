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
    formData.append("description", document.getElementById("description").value);
  
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
  
      if (res.ok) {
        alert("Recipe submitted!");
        window.location.href = "index.html";
      } else {
        alert("Submission failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Error occurred.");
    }
  });
  