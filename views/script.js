function renderComment(comment) {
  return `
    <p>${comment.content}</p>
    <p>Score: ${comment.score}</p>
    <p>Created at: ${comment.createdAt}</p>
    <p>User: ${comment.user.username}</p>
    <!-- Add any additional information you want to display -->
  </div>
    `;
}
function renderReplies(replies) {
  return replies
    .map(
      (reply) => `
      <div style="margin-left: 20px;">
        <p>${reply.content}</p>
        <p>Score: ${reply.score}</p>
        <p>Created at: ${reply.createdAt}</p>
        <p>User: ${reply.user.username}</p>
        <!-- Add any additional information you want to display for replies -->
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
        <div>
          ${renderComment(comment)}
        ${renderReplies(comment.replies)}
        </div>
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
