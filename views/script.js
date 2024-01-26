function renderVote(mode) {
  return `<button class="vote vote--${mode}">
  <img class="vote__icon" src="./images/icon-${mode}.svg"/>
  </button>`;
}

function renderCRUD(postType, userType) {
  let buttons;
  if (userType === postType.user.username) {
    buttons = `
      <button class="CRUD__btn CRUD__btn--edit">
        <img class="CRUD__icon CRUD__icon--edit" src="./images/icon-edit.svg">
        Edit
      </button>
      <button class="CRUD__btn CRUD__btn--delete">
        <img class="CRUD__icon CRUD__icon--delete" src="./images/icon-delete.svg">
        Delete
      </button>`;
  } else {
    buttons = `
      <button class="CRUD__btn CRUD__btn--reply">
        <img class="CRUD__icon CRUD__icon--reply" src="./images/icon-reply.svg">
        Reply
      </button>`;
  }
  return `<span class="CRUD">${buttons}</span>`;
}

function renderForm(postType, userType) {
  if (userType === postType.user.username) {
    return `<p>TEST</p>`;
  } else {
    return ``;
  }
}

function renderComment(comment, userType) {
  return `
    <div class="comment">
      <img class="comment__avatar" src="${comment.user.image.png}">
      <span class="comment__username">${comment.user.username}</span>
      <span class="comment__createdAt">${comment.createdAt}</span>
      <p class="comment__content">${comment.content}</p>
      ${renderForm(comment, userType)}
      <span class="comment__score">${renderVote("plus")}${
    comment.score
  }${renderVote("minus")}</span>
      ${renderCRUD(comment, userType)}
    </div>`;
}

function renderReplies(replies, userType) {
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
          ${renderForm(reply, userType)}
          <span class="comment__score">${renderVote("plus")}${
              reply.score
            }${renderVote("minus")}</span>
          ${renderCRUD(reply, userType)}
        </div>`
          )
          .join("")}
      </div>`;
  } else {
    return "";
  }
}

function renderComments(comments, userType) {
  const container = document.getElementsByClassName("comments")[0];
  container.innerHTML = comments
    .map(
      (comment) => `
    ${renderComment(comment, userType)}
    ${renderReplies(comment.replies, userType)}
  `
    )
    .join("");
}

async function fetchComments(user) {
  try {
    const response = await fetch("comments");
    const comments = await response.json();
    renderComments(comments, user.username);
  } catch (error) {
    console.error("Error while fetching comments:", error);
  }
}

window.onload = async () => {
  try {
    const response = await fetch("users");
    const user = await response.json();
    fetchComments(user[0]);
  } catch (error) {
    console.error("Error while fetching user data:", error);
  }
};
