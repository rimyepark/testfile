const commentForm = document.querySelector('#comment-box');
const username = document.querySelector('#username');
const pw = document.querySelector('#pw');
const commenttext = document.querySelector('#comment');
const commentList = document.getElementById("comment-List");

let comments = [];

function savecomment() {
  const commentsToSave = comments.map(comment => ({ username: comment.username, password: comment.password, text: comment.text, id: comment.id }));
  localStorage.setItem("comments", JSON.stringify(commentsToSave));
}

function openpopup(commentId) {
  const popup = document.createElement("div");
  popup.classList.add("popup");

  const popupContent = document.createElement("div");
  popupContent.classList.add("popup-content");

  const passwordLabel = document.createElement("label");
  passwordLabel.innerText = "비밀번호:";
  const passwordInput = document.createElement("input");
  passwordInput.type = "password";
  passwordInput.id = "popup-password";

  const confirmButton = document.createElement("button");
  confirmButton.innerText = "확인";

  confirmButton.addEventListener("click", function () {
    const password = passwordInput.value;

    if (checkPassword(commentId, password)) {
      deleteComment(commentId);
      popup.remove();
    } else {
      alert("비밀번호가 일치하지 않습니다.");
    }
  });

  popupContent.appendChild(passwordLabel);
  popupContent.appendChild(passwordInput);
  popupContent.appendChild(confirmButton);
  popup.appendChild(popupContent);
  document.body.appendChild(popup);
}

function deleteComment(commentId) {
  const tr = document.getElementById(commentId);
  tr.remove();
  comments = comments.filter((comment) => comment.id !== parseInt(commentId));
  savecomment();
}

function isDuplicateUsername(username) {
  return comments.some((comment) => comment.username === username);
}

function postcomment(newcomment) {
  const tr = document.createElement("tr");
  tr.id = newcomment.id;

  const usernameSpan = document.createElement("span");
  usernameSpan.innerText = newcomment.username;

  const commentSpan = document.createElement("span");
  commentSpan.innerText = newcomment.text;

  const deleteButton = document.createElement("button");
  deleteButton.innerText = "X";
  deleteButton.addEventListener("click", function () {
    openpopup(newcomment.id);
  });

  tr.appendChild(usernameSpan);
  tr.appendChild(commentSpan);
  tr.appendChild(deleteButton);
  commentList.appendChild(tr);
}

function commentSubmit(event) {
  event.preventDefault();
  const newUsername = username.value;
  const newPassword = pw.value;
  const newComment = commenttext.value;

  if (isDuplicateUsername(newUsername)) {
    alert("중복된 아이디입니다. 다른 아이디를 사용해주세요.");
    return;
  }

  username.value = "";
  pw.value = "";
  commenttext.value = "";

  const newcommentObj = {
    username: newUsername,
    password: newPassword,
    text: newComment,
    id: Date.now(),
  };

  comments.push(newcommentObj);
  postcomment(newcommentObj);
  savecomment();
}

commentForm.addEventListener('submit', commentSubmit);

const savedcomment = localStorage.getItem("comments");

if (savedcomment !== null) {
  const parsedcomment = JSON.parse(savedcomment);
  comments = parsedcomment;
  parsedcomment.forEach(postcomment);
}

function checkPassword(commentId, password) {
  const comment = comments.find((comment) => comment.id === parseInt(commentId));
  return comment && comment.password === password;
}
