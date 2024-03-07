export const initLikesListeners = ({ comments }, { renderComments }) => {
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