document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".like-btn").forEach(button => {
    button.addEventListener("click", function () {
      const parent = button.closest(".like-section");
      const postId = parent.dataset.postId;
      const liked = button.classList.contains("liked");

      const method = liked ? "DELETE" : "POST";
      fetch(`/posts/${postId}/like`, {
        method: method,
        headers: {
          "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content,
          "Content-Type": "application/json"
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data.liked) {
            button.classList.add("liked");
          } else {
            button.classList.remove("liked");
          }
          parent.querySelector(".like-count").textContent = data.count;
        });
    });
  });
});
