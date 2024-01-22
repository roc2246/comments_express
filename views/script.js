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

function renderComments(comments){
    const container = document.getElementsByClassName('comments');
      container.innerHTML = comments.map(comment => `
        <div>
          ${renderComment(comment)}
          ${renderReplies(comment.replies)}
        </div>
      `).join('');
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
    console.log("TEST")
  fetchComments();
};
