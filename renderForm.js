import { renderLogin } from "./login.js";
import { initButtonListeners, isAuth, name } from "./main.js"


export const renderForm = ({ container }) => {

    container.innerHTML = isAuth ? `<div class="add-form">
<input type="text" class="add-form-name" placeholder="Введите ваше имя" value="${name}" readonly/>
<textarea type="textarea" class="add-form-text" placeholder="Введите ваш коментарий" rows="4" value=""></textarea>
<div class="add-form-row">
  <button class="add-form-button">Написать</button>
</div>
</div>`: `<div class="auth-form" id="auth-message">Чтобы добавить комментарий, <span id="login-link">авторизуйтесь</span>...
</div>`

    const authLink = document.querySelector('#login-link');
    if (authLink) {
        authLink.addEventListener("click", renderLogin)
    }

    const addForm = document.querySelector('.add-form');
    if (addForm) {
        initButtonListeners();
    }
};

