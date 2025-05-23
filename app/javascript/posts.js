document.addEventListener("DOMContentLoaded", function () {
  document.addEventListener('wheel', function (e) {
    const tabContent = document.querySelector('.tab-content');
    if (!tabContent) return;

    e.preventDefault();

    const scrollAmount = e.deltaY * 2.7; // ← スクロール速度調整（1.5倍など）
    const duration = 180; // アニメーション時間（ミリ秒）
    const startTime = performance.now();
    const startScroll = tabContent.scrollTop;

    function smoothScroll(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1); // 0〜1に制限
      const ease = easeOutCubic(progress); // イージング関数
      tabContent.scrollTop = startScroll + scrollAmount * ease;

      if (progress < 1) {
        requestAnimationFrame(smoothScroll);
      }
    }

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    requestAnimationFrame(smoothScroll);
  }, { passive: false });

  document.getElementById("profile-btn").addEventListener("click", function () {
    const userId = this.dataset.userId;
    window.location.href = `/users/${userId}`;
  });

  document.getElementById("show-posts").addEventListener("click", function () {
    window.location.href = "/posts";
  });

  const showCalendarButton = document.getElementById("show-calendar");
  console.log(showCalendarButton); // nullが表示されるかどうかを確認
  if (showCalendarButton) {
    showCalendarButton.addEventListener("click", function () {
      window.location.href = "/schedules";
    });
  }

  const trigger = document.getElementById("profile-trigger");
  const menu = document.getElementById("profile-menu");

  trigger.addEventListener("click", (e) => {
    e.stopPropagation(); // 他のクリックイベントをキャンセル
    menu.style.display = menu.style.display === "none" ? "block" : "none";
  });

  // メニュー外をクリックしたら非表示
  document.addEventListener("click", (e) => {
    if (!trigger.contains(e.target)) {
      menu.style.display = "none";
    }
  });

  const tabButtons = document.querySelectorAll(".tab-switch");
  const panels = document.querySelectorAll(".tab-panel");

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      tabButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const target = btn.dataset.tab;
      panels.forEach(panel => {
        panel.classList.toggle("active", panel.id === target);
      });
    });
  });

  const createPostModal = document.getElementById("createPostModal");
  const newPostBtn = document.getElementById("new-post-btn");
  const closeCreatePostModalBtn = document.getElementById("close-create-post-modal");
  const postForm = document.getElementById("post-form");
  const modalPostTitle = document.getElementById("create-post-modal-title");

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
    const presetSelect = document.getElementById("preset-select");
    if (!presetSelect) {
      console.error("プリセットセレクトの要素が見つかりません");
      return;
    }

    fetch("/presets.json")
      .then(response => response.json())
      .then(data => {
        // プリセットを選択肢として追加
        presetSelect.innerHTML = "<option value=''>プリセットを選択</option>"; // 初期の選択肢をクリア
        data.presets.forEach(preset => {
          const option = document.createElement("option");
          option.value = preset.id;
          option.textContent = preset.name;
          presetSelect.appendChild(option);
        });
      })
      .catch(error => console.error("プリセット読み込みエラー:", error));
  }

  document.getElementById("preset-select").addEventListener("change", function () {
    const presetId = this.value;
    const amPreview = document.getElementById("am-preview");
    const pmPreview = document.getElementById("pm-preview");

    // 📌 日付をリセット
    document.getElementById("date-select").value = "";
  
    // リセット
    amPreview.innerHTML = "<strong>AMの予定</strong><br>";
    pmPreview.innerHTML = "<strong>PMの予定</strong><br>";
  
    if (presetId) {
      fetch(`/presets/${presetId}.json`)
        .then(response => response.json())
        .then(data => {
          if (data.length > 0) {
            data.forEach(event => {
              const start = new Date(event.start_time);
              const end = new Date(event.end_time);
  
              const formatTime = time => time.toLocaleTimeString("ja-JP", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
              });
  
              const timeRange = `🕒 ${formatTime(start)} - ${formatTime(end)}：${event.title}`;
  
              // AM か PM で分けて表示
              if (start.getHours() < 12) {
                amPreview.innerHTML += `<div>${timeRange}</div>`;
              } else {
                pmPreview.innerHTML += `<div>${timeRange}</div>`;
              }
            });
          } else {
            amPreview.innerHTML += "予定なし";
            pmPreview.innerHTML += "予定なし";
          }
        })
        .catch(error => {
          amPreview.innerHTML += "読み込み失敗";
          pmPreview.innerHTML += "読み込み失敗";
          console.error("エラー:", error);
        });
    }
  });

  document.getElementById("date-select").addEventListener("change", function () {
    const selectedDate = this.value;
    const amPreview = document.getElementById("am-preview");
    const pmPreview = document.getElementById("pm-preview");

    // 📌 プリセットをリセット
    document.getElementById("preset-select").value = "";
  
    amPreview.innerHTML = "<strong>AMの予定</strong><br>";
    pmPreview.innerHTML = "<strong>PMの予定</strong><br>";
  
    if (selectedDate) {
      fetch(`/schedules/by_date?date=${selectedDate}`)
        .then(response => response.json())
        .then(data => {
          if (data.length > 0) {
            data.forEach(event => {
              // 日時をISO形式に変換（スペースをTに置き換える）
              const start = new Date(event.start_time.replace(" ", "T"));
              const end = new Date(event.end_time.replace(" ", "T"));
            
              const formatTime = time => time.toLocaleTimeString("ja-JP", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
              });
            
              const timeRange = `🕒 ${formatTime(start)} - ${formatTime(end)}：${event.title}`;
            
              if (start.getHours() < 12) {
                amPreview.innerHTML += `<div>${timeRange}</div>`;
              } else {
                pmPreview.innerHTML += `<div>${timeRange}</div>`;
              }
            });
          } else {
            amPreview.innerHTML += "予定なし";
            pmPreview.innerHTML += "予定なし";
          }
        })
        .catch(error => {
          amPreview.innerHTML += "読み込み失敗";
          pmPreview.innerHTML += "読み込み失敗";
          console.error("エラー:", error);
        });
    }
  });


  const form = document.getElementById("post-form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    submitPost();
  });

  function submitPost() {
    const description = document.getElementById("post-description").value;
    const presetId = document.getElementById("preset-select").value;
    const selectedDate = document.getElementById("date-select").value;

    const postType = presetId ? "preset" : selectedDate ? "date" : "none";

    fetch("/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content
      },
      body: JSON.stringify({
        post: {
          description: description,
          preset_id: presetId || null,
          selected_date: selectedDate || null,
          post_type: postType
        }
      })
    })
    .then(response => {
      if (response.ok) {
        window.location.reload();
      } else {
        alert("投稿に失敗しました。");
      }
    })
    .catch(error => console.error("投稿エラー:", error));
  }

  // これでsubmitPostがグローバルに確実に定義されるようにする
  window.submitPost = submitPost;

  document.querySelectorAll('.post-menu-toggle').forEach(button => {
    button.addEventListener('click', e => {
      e.stopPropagation(); // 他のイベントとの干渉防止
      const menu = button.nextElementSibling;
      menu.classList.toggle('hidden');
    });
  });

  // クリックでメニュー閉じる
  document.addEventListener('click', () => {
    document.querySelectorAll('.post-context-menu').forEach(menu => {
      menu.classList.add('hidden');
    });
  });

  const modal = document.getElementById("deletePostModal");
  const confirmBtn = document.getElementById("confirm-delete-btn");
  const cancelBtn = document.getElementById("cancel-delete-btn");
  const deleteBtns = document.querySelectorAll(".delete-post");

  let targetPostBtn = null;
  let targetPostId = null;

  deleteBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      targetPostBtn = btn;
      targetPostId = btn.dataset.postId;
      modal.classList.remove("hidden");
    });
  });

  cancelBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
    targetPostBtn = null;
    targetPostId = null;
  });

  confirmBtn.addEventListener("click", async () => {
    if (!targetPostId) return;

    const token = document.querySelector('meta[name="csrf-token"]').getAttribute("content");

    const response = await fetch(`/posts/${targetPostId}`, {
      method: "DELETE",
      headers: {
        "X-CSRF-Token": token,
        "Content-Type": "application/json"
      }
    });

    if (response.ok) {
      const postElement = targetPostBtn.closest(".post");
      if (postElement) {
        postElement.remove();
      }
      modal.classList.add("hidden");
      window.location.reload(); 
    } else {
      alert("削除に失敗しました");
    }

    // リセット
    targetPostBtn = null;
    targetPostId = null;
  });

  document.querySelectorAll(".post-user-block").forEach(block => {
    const userId = block.dataset.userId;
    if (!userId) return;

    const profileImg = block.querySelector(".clickable-profile");
    const nickname = block.querySelector(".clickable-nickname");

    if (profileImg) {
      profileImg.addEventListener("click", function () {
        window.location.href = `/users/${userId}`;
      });
    }

    if (nickname) {
      nickname.addEventListener("click", function () {
        window.location.href = `/users/${userId}`;
      });
    }
  });
});