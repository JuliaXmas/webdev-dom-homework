import { sanitizeHtml } from './sanitizeHtml.js';

const commentList = document.querySelector('.comments');

export const renderComments = ({ comments }) => {
  commentList.innerHTML = comments.map((comment, index) => {
    return `<li class="comment" data-index="${index}">
      <div class="comment-header">
        <div>${sanitizeHtml(comment.name)}</div>
        <div>${comment.date},</div>
      </div>
        <div class="comment-body">
        <div class="comment-text">
        ${sanitizeHtml(comment.text).replaceAll("%BEGIN_QUOTE", "<div class='quote'>").replaceAll("END_QUOTE%", "</div>")}
        </div>
      </div>
      <div class="comment-footer">
        <div class="likes">
          <span class="likes-counter">${comment.likes}</span>
          <button data-index="${index}" class="like-button ${comment.isLiked ? "-active-like" : ""}"></button>
        </div>
      </div>
        </li>`
  }).join("");
  initLikesListeners({ comments }, { renderComments });
}

const initLikesListeners = ({ comments }, { renderComments }) => {
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
      renderComments({ comments });
    });
  }
};