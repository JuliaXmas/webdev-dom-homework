export function getComments() {
    return fetch("https://wedev-api.sky.pro/api/v1/alexandrova-julia/comments", {
        method: "GET"
    })
        .then((response) => {
            if (response.status === 500) {
                throw new Error("Сервер сломался");
            }
            return response.json();
        })
}

export function postComments({ inputName, inputText }) {
    return fetch("https://wedev-api.sky.pro/api/v1/alexandrova-julia/comments", {
        method: "POST",
        body: JSON.stringify({
            name: inputName.value.replaceAll("<", "&lt;").replaceAll(">", "&gt;"),
            text: inputText.value.replaceAll("<", "&lt;").replaceAll(">", "&gt;"),
            forceError: false,
        }),
    })
}