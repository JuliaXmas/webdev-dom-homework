import { sanitizeHtml } from './sanitizeHtml.js';
import { getComments } from './api.js';
import { postComments } from './api.js';

const inputName = document.querySelector('.add-form-name');
const inputText = document.querySelector('.add-form-text');
const buttonWrite = document.querySelector('.add-form-button');
const commentList = document.querySelector('.comments');
const preloader = document.querySelector('.preloader');
const addForm = document.querySelector('.add-form');

let comments = [];

getComments()
  .then((responseData) => {
    comments = responseData.comments.map((comment) => {
      return {
        name: comment.author.name,
        date: new Date(comment.date).toLocaleDateString() + " " + (new Date(comment.date).getHours() < 10 ? '0' + new Date(comment.date).getHours() : new Date(comment.date).getHours()) + ":" + (new Date(comment.date).getMinutes() < 10 ? '0' + new Date(comment.date).getMinutes() : new Date(comment.date).getMinutes()) + ":" + (new Date(comment.date).getSeconds() < 10 ? '0' + new Date(comment.date).getSeconds() : new Date(comment.date).getSeconds()),
        isLiked: false,
        likes: comment.likes,
        text: comment.text,
      };
    });
    renderComments();
    preloader.classList.add('hide');
  })
  .catch((error) => {
    if (error instanceof TypeError) {
      preloader.classList.add('hide');
      addForm.textContent = "Не удалось загрузить комментарии";
      alert("Кажется, у вас сломался Интернет, попробуйте позже");
      return;
    }
  });

const initLikesListeners = () => {
  const likeButtonsElements = document.querySelectorAll(".like-button");

  for (const likeButtonElement of likeButtonsElements) {
    likeButtonElement.addEventListener("click", (event) => {
      event.stopPropagation();
      const index = likeButtonElement.dataset.index;
      const comment = comments[index];

      comment.likes = comment.isLiked
        ? comment.likes - 1
        : comment.likes + 1;

      comment.isLiked = !comment.isLiked;
      renderComments();
    });
  }

  for (const comment of document.querySelectorAll(".comment")) {
    comment.addEventListener("click", () => {
      const currentPost = comments[comment.dataset.index];
      inputText.value = `%BEGIN_QUOTE${currentPost.name} : ${currentPost.text}END_QUOTE%`;
    });
  }
};

const renderComments = () => {
  commentList.innerHTML = comments.map((comment, index) => {
    return `<li class="comment" data-index="${index}">
  <div class="comment-header">
    <div>${sanitizeHtml(comment.name)}</div>
    <div>${comment.date},</div>
  </div>
    <div class="comment-body">
    <div class="comment-text">
    ${sanitizeHtml(comment.text).replaceAll("%BEGIN_QUOTE", "<div class='quote'>").replaceAll("END_QUOTE%", "</div>")}
    </div>
  </div>
  <div class="comment-footer">
    <div class="likes">
      <span class="likes-counter">${comment.likes}</span>
      <button data-index="${index}" class="like-button ${comment.isLiked ? "-active-like" : ""}"></button>
    </div>
  </div>
    </li>`
  }).join("");
  initLikesListeners();
}
renderComments();

buttonWrite.addEventListener("click", () => {
  inputName.classList.remove("error");
  inputText.classList.remove("error");
  if (inputName.value.trim() === "" || inputName.value === null) {
    inputName.classList.add("error");
    return;
  } else if (inputText.value.trim() === "" || inputText.value === null) {
    inputText.classList.add("error");
    return;
  };

  const nameValue = inputName.value;
  const textValue = inputText.value;

  buttonWrite.disabled = true;
  buttonWrite.textContent = "Комментарий добавляется...";

  postComments({ inputName, inputText })
    .then((response) => {
      if (response.status === 400 && (nameValue.length < 3 || textValue.length < 3)) {
        throw new Error("Некорректный запрос");
      }
      if (response.status === 500) {
        throw new Error("Сервер сломался");
      }
      else {
        return response.json();
      }
    })
    .then(() => {
      getComments()
    })
    .then((response) => {
      return response.json();
    })
    .then((responseData) => {
      comments = responseData.comments.map((comment) => {
        return {
          name: comment.author.name,
          date: new Date(comment.date).toLocaleDateString() + " " + (new Date(comment.date).getHours() < 10 ? '0' + new Date(comment.date).getHours() : new Date(comment.date).getHours()) + ":" + (new Date(comment.date).getMinutes() < 10 ? '0' + new Date(comment.date).getMinutes() : new Date(comment.date).getMinutes()) + ":" + (new Date(comment.date).getSeconds() < 10 ? '0' + new Date(comment.date).getSeconds() : new Date(comment.date).getSeconds()),
          isLiked: comment.isLiked,
          likes: comment.likes,
          text: comment.text,
        };
      });
      renderComments();
    })
    .then(() => {
      buttonWrite.disabled = false;
      buttonWrite.textContent = "Написать";
      inputName.value = "";
      inputText.value = "";
    })
    .catch((error) => {
      if (error.message === "Сервер сломался") {
        alert("Сервер сломался, попробуй позже");
        inputName.value = nameValue;
        inputText.value = textValue;
        return;
      } if (error.message === "Некорректный запрос") {
        alert("Имя и комментарий должны быть не короче 3 символов");
        inputName.value = nameValue;
        inputText.value = textValue;
      }
      if (error instanceof TypeError) {
        alert("Кажется, у вас сломался интернет, попробуйте позже");
        return;
      }
      console.log(error);
    })
    .finally(() => {
      buttonWrite.disabled = false;
      buttonWrite.textContent = "Написать";
    });
  renderComments();

});


console.log("It works!");