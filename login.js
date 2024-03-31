import { login, setToken } from './api.js';
import { name, setAuth, setName } from './main.js';
import { renderApp } from './renderApp.js';
import _ from 'lodash';

export const renderLogin = () => {
    const appElement = document.querySelector('.container');
    const loginHtml = `<div class="add-form">
    <input type="text" class="add-form-login" id="login" placeholder="Введите ваш логин" value="" />
    <input type="password" class="add-form-password" id="password" placeholder="Введите ваш пароль"
      value=""></input>
    <div class="add-form-row">
      <button class="add-form-button" id="login-button">Войти</button>
    </div>
  </div>`;
    appElement.innerHTML = loginHtml;

    const buttonElement = document.getElementById('login-button');
    const loginInputElement = document.getElementById('login');
    const passwordInputElement = document.getElementById('password');

    buttonElement.addEventListener('click', () => {
        if (!loginInputElement.value || !passwordInputElement.value) {
            alert('Логин или пароль введены некорректно');
            return;
        }
        login({
            login: loginInputElement.value,
            password: passwordInputElement.value,
            forceError: true,
            name: _.capitalize(name),
        })
            .then((responseData) => {
                setToken(responseData.user.token);
                setAuth(true);
                setName(responseData.user.name);
                renderApp();
            })
            .catch((error) => {
                alert(error.message);
            });
    });
};
