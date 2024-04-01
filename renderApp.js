import { renderForm } from './renderForm.js';
import { getComments } from './api.js';
import { format } from 'date-fns';
import { renderComments } from './renderComments.js';

let comments = [];

export const renderApp = () => {
    let container = document.querySelector('.container');
    container.innerHTML = `<ul class="comments">
 </ul>
 <div id="form"></div>`;
    renderForm({ container: document.querySelector('#form') });
    const fetchAndRenderTasks = () => {
        const preloader = document.querySelector('.preloader');
        getComments()
            .then((responseData) => {
                comments = responseData.comments.map((comment) => {
                    const createDate = format(
                        new Date(),
                        'yyyy-MM-dd hh.mm.ss',
                    );
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
    fetchAndRenderTasks();
};
