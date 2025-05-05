document.addEventListener("DOMContentLoaded", () => {
  const followBtn = document.querySelector(".follow-btn");

  if (!followBtn) return;

  followBtn.addEventListener("click", () => {
    const userId = followBtn.dataset.userId;
    const followed = followBtn.textContent.includes("解除");

    const method = followed ? "DELETE" : "POST";
    fetch(`/users/${userId}/${followed ? "unfollow" : "follow"}`, {
      method: method,
      headers: {
        "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content,
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => {
        followBtn.textContent = data.followed ? "フォロー解除" : "フォロー";
        document.getElementById("following-count").textContent = data.following_count;
        document.getElementById("followers-count").textContent = data.followers_count;
      });
  });
});









