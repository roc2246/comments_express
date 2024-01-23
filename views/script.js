function renderComment(comment) {
  return `
  <div class="comment">
    <img class="comment__avatar" src="${comment.user.image.png}">
    <span class="comment__username">${comment.user.username}</span>
    <span class="comment__createdAt">${comment.createdAt}</span>
    <p class="comment__content">${comment.content}</p>
    <span class="comment__score">Score: ${comment.score}</span>
  </div>
    `;
}

function renderReplies(replies) {
  return replies
    .map(
      (reply) => `
      <div class="comment comment--reply">
        <img class="comment__avatar" src="${reply.user.image.png}">
        <span class="comment__username">${reply.user.username}</span>
        <span class="comment__createdAt">${reply.createdAt}</span>
        <p class="comment__content">${reply.content}</p>
        <span class="comment__score">Score: ${reply.score}</span>
      </div>
    `
    )
    .join("");
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
    console.log(comments);
    renderComments(comments);
  } catch (error) {
    console.error("Error while fetching comments:", error);
  }
}

window.onload = () => {
  fetchComments();
};
