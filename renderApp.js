import { fetchAndRenderTasks } from "./main.js";
import { renderForm } from "./renderForm.js";


export const renderApp = () => {
  let container = document.querySelector(".container");
  container.innerHTML = `<ul class="comments">
 </ul>
 <div id="form"></div>`
  renderForm({ container: document.querySelector('#form') });
  fetchAndRenderTasks();
}

