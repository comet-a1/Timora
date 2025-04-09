document.addEventListener("DOMContentLoaded", function () {
  const homeBtn = document.getElementById("home-btn");
  const profileBtn = document.getElementById("profile-btn");
  const homeSection = document.getElementById("home-section");
  const profileSection = document.getElementById("profile-section");

  if (homeBtn && profileBtn && homeSection && profileSection) {
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
  } else {
    console.error("必要な要素が見つかりません。homeBtn, profileBtn, homeSection, profileSectionのいずれかが不足しています。");
  }

  document.getElementById("toScheduleBtn").addEventListener("click", function () {
    window.location.href = "/schedules";
  });
});