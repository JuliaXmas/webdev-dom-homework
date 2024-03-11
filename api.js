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