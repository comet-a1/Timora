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

document.addEventListener("DOMContentLoaded", function () {
  const openBtn = document.getElementById("open-icon-modal");
  const closeBtn = document.getElementById("close-icon-modal");
  const modal = document.getElementById("icon-modal");

  if (openBtn && closeBtn && modal) {
    openBtn.addEventListener("click", function () {
      modal.style.display = "block";
    });

    closeBtn.addEventListener("click", function () {
      modal.style.display = "none";
    });

    // モーダル外クリックで閉じる
    window.addEventListener("click", function (event) {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    });
  }
});

document.getElementById('profile-picture-form').addEventListener('submit', function(event) {
  event.preventDefault(); // フォームのデフォルト送信を防止

  const formData = new FormData();
  const fileInput = document.getElementById('profile-picture-input');
  const file = fileInput.files[0];

  if (file) {
    formData.append('user[profile_picture]', file);

    // CSRFトークンの取得
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    
    fetch('/users/' + document.getElementById('current-user-id').value + '/profile_picture_update', {
      method: 'PATCH',
      headers: {
        'X-CSRF-Token': csrfToken, // CSRFトークンを送信
      },
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        console.error("エラー:", data.error);
      } else {
        // 画像の更新
        document.querySelectorAll('.updatable-picture').forEach(img => {
          img.src = data.profile_picture_url;
        });
    
        // モーダルを閉じる
        document.getElementById("icon-modal").style.display = "none";
    
        console.log("更新成功:", data.message);
      }
    })
    .catch(error => {
      console.error("アップロード中にエラーが発生しました:", error);
    });
  } else {
    alert('画像を選択してください');
  }
});

// モーダルを閉じる処理
document.getElementById('close-icon-modal').addEventListener('click', function() {
  document.getElementById('icon-modal').style.display = 'none';
});

