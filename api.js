const commentsURL = "https://wedev-api.sky.pro/api/v2/alexandrova-julia/comments";
const userURL = "https://wedev-api.sky.pro/api/user/login";

export let token;

export const setToken = (newToken) => {
    token = newToken;
}


export function getComments() {
    return fetch(commentsURL, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((response) => {
            if (response.status === 500) {
                throw new Error("Сервер сломался");
            }
            return response.json();
        });
}

export function postComments({ name, text }) {
    return fetch(commentsURL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            name: name.replaceAll("<", "&lt;").replaceAll(">", "&gt;"),
            text: text.replaceAll("<", "&lt;").replaceAll(">", "&gt;"),
            forceError: true,
        }),
    })
}

export function login({ login, password }) {
    return fetch(userURL, {
        method: "POST",
        body: JSON.stringify({
            login,
            password,
        }),
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            if (response.status === 400) {
                throw new Error("Некорректные логин или пароль");
            }
            if (response.status === 500) {
                return Promise.reject("Ошибка сервера");
            }
        })
        .catch((error) => {
            if (error.message === "Failed to fetch") {
                throw new Error("Отсутствует Интернет-соединение");
            } else {
                throw error;
            }
        })
};