import { renderLogin } from './login.js';
import { name, isAuth } from './renderComments.js';
import { renderComments } from './renderComments.js';
import { postComments } from './api.js';
import { renderApp } from './renderApp.js';

let comments = [];

export const renderForm = ({ container }) => {
    container.innerHTML = isAuth
        ? `<div class="add-form">
<input type="text" class="add-form-name" placeholder="Введите ваше имя" value="${name}" readonly/>
<textarea type="textarea" class="add-form-text" placeholder="Введите ваш коментарий" rows="4" value=""></textarea>
<div class="add-form-row">
  <button class="add-form-button">Написать</button>
</div>
</div>`
        : `<div class="add-form-auth"><div class="auth-form" id="auth-message"><p>Чтобы добавить комментарий, <a class ="login-link" id="login-link">авторизуйтесь</a>...</p>
</div></div>`;

    const authLink = document.querySelector('#login-link');
    if (authLink) {
        authLink.addEventListener('click', renderLogin);
    }

    const addForm = document.querySelector('.add-form');
    if (addForm) {
        const initButtonListeners = () => {
            const buttonWrite = document.querySelector('.add-form-button');
            const inputName = document.querySelector('.add-form-name');
            const inputText = document.querySelector('.add-form-text');
            buttonWrite.addEventListener('click', () => {
                inputName.classList.remove('error');
                inputText.classList.remove('error');
                if (inputName.value.trim() === '' || inputName.value === null) {
                    inputName.classList.add('error');
                    return;
                } else if (
                    inputText.value.trim() === '' ||
                    inputText.value === null
                ) {
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
                        return renderApp();
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
                            alert(
                                'Имя и комментарий должны быть не короче 3 символов',
                            );
                            inputText.value = textValue;
                            return;
                        }
                        if (error instanceof TypeError) {
                            alert(
                                'Кажется, у вас сломался интернет, попробуйте позже',
                            );
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
        initButtonListeners();
    }
};
