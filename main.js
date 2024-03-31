import { getComments, postComments } from './api.js';
import { renderApp } from './renderApp.js';
import { renderComments } from './renderComments.js';
import { format } from 'date-fns';

const preloader = document.querySelector('.preloader');

let comments = [];
export let isAuth = false;
export let name = null;

export const setAuth = (value) => {
    isAuth = value;
};

export const setName = (newName) => {
    name = newName;
};

export const fetchAndRenderTasks = () => {
    getComments()
        .then((responseData) => {
            comments = responseData.comments.map((comment) => {
                const createDate = format(new Date(), 'yyyy-MM-dd hh.mm.ss');
                return {
                    name: comment.author.name,
                    date: createDate,
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
            const addForm = document.querySelector('.add-form');
            if (error instanceof TypeError) {
                preloader.classList.add('hide');
                addForm.textContent = 'Не удалось загрузить комментарии';
                return;
            }
            alert('Кажется, у вас сломался Интернет, попробуйте позже');
        });
};

renderApp();

export const initButtonListeners = () => {
    const buttonWrite = document.querySelector('.add-form-button');
    const inputName = document.querySelector('.add-form-name');
    const inputText = document.querySelector('.add-form-text');
    buttonWrite.addEventListener('click', () => {
        inputName.classList.remove('error');
        inputText.classList.remove('error');
        if (inputName.value.trim() === '' || inputName.value === null) {
            inputName.classList.add('error');
            return;
        } else if (inputText.value.trim() === '' || inputText.value === null) {
            inputText.classList.add('error');
            return;
        }

        const nameValue = inputName.value;
        const textValue = inputText.value;
        buttonWrite.disabled = true;
        buttonWrite.textContent = 'Комментарий добавляется...';

        postComments({
            name: inputName.value,
            text: inputText.value,
        })
            .then((response) => {
                if (
                    response.status === 400 &&
                    (nameValue.length < 3 || textValue.length < 3)
                ) {
                    throw new Error('Некорректный запрос');
                } else if (response.status === 500) {
                    throw new Error('Сервер сломался');
                }
                return response.json();
            })
            .then(() => {
                return fetchAndRenderTasks();
            })
            .then(() => {
                buttonWrite.disabled = false;
                buttonWrite.textContent = 'Написать';
                inputText.value = '';
            })
            .catch((error) => {
                if (error.message === 'Сервер сломался') {
                    alert('Сервер сломался, попробуй позже');
                    inputText.value = textValue;
                    return;
                }
                if (error.message === 'Некорректный запрос') {
                    alert('Имя и комментарий должны быть не короче 3 символов');
                    inputText.value = textValue;
                    return;
                }
                if (error instanceof TypeError) {
                    alert('Кажется, у вас сломался интернет, попробуйте позже');
                    return;
                }
                console.log(error);
            })
            .finally(() => {
                buttonWrite.disabled = false;
                buttonWrite.textContent = 'Написать';
            });
        renderComments({ comments });
    });
};

renderComments({ comments });

console.log('It works!');
