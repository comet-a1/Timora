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

  const createPostModal = document.getElementById("createPostModal");
  const newPostBtn = document.getElementById("new-post-btn");
  const closeCreatePostModalBtn = document.getElementById("close-create-post-modal");
  const postForm = document.getElementById("post-form");
  const modalPostTitle = document.getElementById("create-post-modal-title");
  const presetSelect = document.getElementById("preset-select");

  // ✅ モーダルの表示関数
  function openCreatePostModal() {
    createPostModal.style.display = "flex"; // 投稿作成モーダルを表示
    loadPresets(); // プリセットを読み込む
  }

  // ✅ モーダルの閉会関数
  function closeCreatePostModal() {
    createPostModal.style.display = "none"; // 投稿作成モーダルを非表示
    postForm.reset(); // フォームをリセット
  }

  // ✅ ボタンにイベントリスナーを追加
  newPostBtn.addEventListener('click', openCreatePostModal);
  closeCreatePostModalBtn.addEventListener('click', closeCreatePostModal);
  
  // ✅ プリセットを読み込む関数（サーバーから取得）
  function loadPresets() {
    // ここでプリセットデータをサーバーから取得する
    fetch("/api/presets")  // 仮のAPIエンドポイント
      .then(response => response.json())
      .then(data => {
        // プリセットを選択肢として追加
        presetSelect.innerHTML = "<option value=''>プリセットを選択</option>"; // 初期の選択肢をクリア
        data.forEach(preset => {
          const option = document.createElement("option");
          option.value = preset.id;
          option.textContent = preset.name;
          presetSelect.appendChild(option);
        });
      })
      .catch(error => console.error("プリセット読み込みエラー:", error));
  }
});