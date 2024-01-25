function renderVote(mode) {
  return `<button class="vote vote--${mode}">
  <img class="vote__button" src="./images/icon-${mode}.svg"/>
  </button>`;
}

function renderCRUD() {
  return `<span class="CRUD">
  <button class="CRUD__btn CRUD__btn--reply">
    <img class="CRUD__img CRUD__img--reply" src="./images/icon-reply.svg">
    Reply
    </button>
  </span>`;
}

function renderComment(comment) {
  return `
  <div class="comment">
    <img class="comment__avatar" src="${comment.user.image.png}">
    <span class="comment__username">${comment.user.username}</span>
    <span class="comment__createdAt">${comment.createdAt}</span>
    <p class="comment__content">${comment.content}</p>
    <span class="comment__score">${renderVote("plus")}${
    comment.score
  }${renderVote("minus")}</span>
  ${renderCRUD()}
  </div>
    `;
}

function renderReplies(replies) {
  if (replies.length !== 0) {
    return `
      <div class="comments comments--replies">
      <hr class="comments__ruler"/>${replies
        .map(
          (reply) => `
      <div class="comment comment--reply">
        <img class="comment__avatar" src="${reply.user.image.png}">
        <span class="comment__username">${reply.user.username}</span>
        <span class="comment__createdAt">${reply.createdAt}</span>
        <p class="comment__content">${reply.content}</p>
        <span class="comment__score">${renderVote("plus")}${
            reply.score
          }${renderVote("minus")}</span>
        ${renderCRUD()}
      </div>`
        )
        .join("")}
    </div>`;
  } else {
    return "";
  }
}

function renderComments(comments) {
  const container = document.getElementsByClassName("comments")[0];
  container.innerHTML = comments
    .map(
      (comment) => `
          ${renderComment(comment)}
        ${renderReplies(comment.replies)}
      `
    )
    .join("");
}

async function fetchComments() {
  try {
    const response = await fetch("comments");
    const comments = await response.json();
    renderComments(comments);
  } catch (error) {
    console.error("Error while fetching comments:", error);
  }
}

window.onload = () => {
  fetchComments();
};
