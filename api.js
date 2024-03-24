const commentsURL = "https://wedev-api.sky.pro/api/v2/alexandrova-julia/comments";
const userURL = "https://wedev-api.sky.pro/api/user/login";

const token = "asb4c4boc86gasb4c4boc86g37w3cc3bo3b83k4g37k3bk3cg3c03ck4k";

export function getComments() {
    return fetch(commentsURL, {
        method: "GET",
        headers: {
            Authorization: token,
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
            Authorization: token,
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
            name: user.replaceAll("<", "&lt;").replaceAll(">", "&gt;"),
            text: text.replaceAll("<", "&lt;").replaceAll(">", "&gt;"),
            login,
            password,
            forceError: true,
        }),
    }).then((response) => {
        return response.json();
    });
}