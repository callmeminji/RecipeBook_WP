![image](https://github.com/user-attachments/assets/b1519761-89a2-4b6c-9293-f3052d96e381)


**RecipeYa** is a web-based recipe sharing platform where users can browse, filter, upload, and bookmark cooking recipes. Designed with a clean, responsive UI and practical user experience in mind.

---

## 🔗 Demo

🌐 [Live Site](https://recipeya.onrender.com)  
📂 [GitHub Repository](https://github.com/callmeminji/RecipeBook_WP)

---

## 🚀 Features

- User registration and login
- Create, edit, and delete recipes (CRUD)
- Comment on recipes (add/delete)
- Search recipes by keyword
- Bookmark favorite recipes
- Personal user page (My Page)

---

## 🛠️ Tech Stack

| Layer       | Stack                          |
|-------------|---------------------------------|
| Frontend    | HTML, CSS, JavaScript |
| Backend     | Node.js, Express               |
| Database    | MongoDB         |
| Auth        | JWT            |
| Deployment  | Render                         |
| Tools       | GitHub, Postman, .http scripts |


---

## 🧑‍💻 Folder Structure (Client)
```
RecipeYa/
├── index.html
├── login.html
├── account.html
├── my-recipes.html
├── new-recipe.html
├── post.html
├── css/
│ ├── style.css
│ ├── index.css
│ ├── login.css
│ ├── post.css
│ └── ...
├── js/
│ ├── index.js
│ ├── login.js
│ ├── new-recipe.js
│ ├── post.js
│ └── ...
├── assets/
│ ├── logo.png
│ ├── home-icon.png
│ └── ...
└── README.md
```
---

## ⚙️ How to Run Locally

1. Clone the repository:

```bash
git clone https://github.com/callmeminji/RecipeBook_WP.git
cd RecipeBook_WP
```

2. Start the backend server:

```
cd server
npm start
```
  → Once you see MongoDB connected in the terminal, the server is running.

3. Launch frontend (open index.html directly or via [live server](http://localhost:3000))

---

## 📦 API Overview

> All endpoints are prefixed with `/api`

- `POST /auth/register` — Register new users  
- `POST /auth/login` — Authenticate and issue a JWT token
- `GET /users/me` — Fetch the current user's info  
- `GET /users/me/recipes` — View recipes written by the user  
- `GET /users/me/bookmarks` — Retrieve bookmarked recipes
- `GET /recipes` — Fetch all recipes  
- `POST /recipes` — Create a new recipe  
- `GET /recipes/:id` — View a single recipe  
- `PUT /recipes/:id` — Update an existing recipe  
- `DELETE /recipes/:id` — Delete a recipe  
- `POST /recipes/:id/bookmark` — Bookmark a recipe  
- `DELETE /recipes/:id/bookmark` — Remove a bookmark
- `POST /comments` — Create a new comment  
- `DELETE /comments/:id` — Delete a comment

---

## 🙌 Authors

- Team: **RecipeYa** 
- GitHub: [@callmeminji](https://github.com/callmeminji)

---

## 📄 License

This project is licensed under the **MIT License**.  
Feel free to fork and build on it!

