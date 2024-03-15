
import { getComments, postComments } from './api.js';
import { renderComments } from './renderComments.js';

const inputName = document.querySelector('.add-form-name');
const inputText = document.querySelector('.add-form-text');
const buttonWrite = document.querySelector('.add-form-button');
const preloader = document.querySelector('.preloader');
const addForm = document.querySelector('.add-form');

let comments = [];

const fetchAndRenderTasks = () => {
  getComments()
    .then((responseData) => {
      comments = responseData.comments.map((comment) => {
        return {
          name: comment.author.name,
          date: new Date(comment.date).toLocaleDateString() + " " + (new Date(comment.date).getHours() < 10 ? '0' + new Date(comment.date).getHours() : new Date(comment.date).getHours()) + ":" + (new Date(comment.date).getMinutes() < 10 ? '0' + new Date(comment.date).getMinutes() : new Date(comment.date).getMinutes()) + ":" + (new Date(comment.date).getSeconds() < 10 ? '0' + new Date(comment.date).getSeconds() : new Date(comment.date).getSeconds()),
          isLiked: false,
          likes: comment.likes,
          text: comment.text,
          forceError: true,
        };
      });
      renderComments({ comments });
      preloader.classList.add('hide');
    })
    .catch((error) => {
      if (error instanceof TypeError) {
        preloader.classList.add('hide');
        addForm.textContent = "Не удалось загрузить комментарии";
        return;
      }
      alert("Кажется, у вас сломался Интернет, попробуйте позже");
    });
};

fetchAndRenderTasks();

renderComments({ comments });

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

  postComments({
    name: inputName.value,
    text: inputText.value,
  })
    .then((response) => {
      if (response.status === 400 && (nameValue.length < 3 || textValue.length < 3)) {
        throw new Error("Некорректный запрос");
      } else if (response.status === 500) {
        throw new Error("Сервер сломался");
      }
      return response.json();
    })
    .then(() => {
      return fetchAndRenderTasks();
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
        return;
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
  renderComments({ comments });
});

renderComments({ comments });

console.log("It works!");