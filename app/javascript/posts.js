document.addEventListener("DOMContentLoaded", function () {
  const homeBtn = document.getElementById("home-btn");
  const profileBtn = document.getElementById("profile-btn");
  const homeSection = document.getElementById("home-section");
  const profileSection = document.getElementById("profile-section");

  homeBtn.addEventListener("click", function () {
    homeSection.classList.add("active");
    profileSection.classList.remove("active");

    homeBtn.classList.add("active");
    profileBtn.classList.remove("active");
  });

  profileBtn.addEventListener("click", function () {
    profileSection.classList.add("active");
    homeSection.classList.remove("active");

    profileBtn.classList.add("active");
    homeBtn.classList.remove("active");
  });

  const postsTab = document.getElementById("posts-tab");
  const bookmarksTab = document.getElementById("bookmarks-tab");
  const postsSection = document.getElementById("posts-section");
  const bookmarksSection = document.getElementById("bookmarks-section");

  postsTab.addEventListener("click", function () {
    postsSection.classList.add("active");
    bookmarksSection.classList.remove("active");
    postsTab.classList.add("active");
    bookmarksTab.classList.remove("active");
  });

  bookmarksTab.addEventListener("click", function () {
    bookmarksSection.classList.add("active");
    postsSection.classList.remove("active");
    bookmarksTab.classList.add("active");
    postsTab.classList.remove("active");
  });
});


