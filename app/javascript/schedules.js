document.addEventListener('DOMContentLoaded', function () {
  const buttons = document.querySelectorAll('.sidebar-btn');

  buttons.forEach(button => {
    button.addEventListener('click', function() {
      // すべてのボタンから 'active' クラスを削除
      buttons.forEach(btn => btn.classList.remove('active'));
      
      // クリックされたボタンに 'active' クラスを追加
      button.classList.add('active');
    });
  });

  // カレンダーボタン
  document.getElementById("show-calendar").addEventListener("click", function () {
    window.location.href = "/schedules"; // 遷移先をカレンダーのURLに変更
  });

  // プリセットボタン
  document.getElementById("show-presets").addEventListener("click", function () {
    window.location.href = "/presets"; // 遷移先をプリセット一覧などに変更
  });

  // メモボタン
    document.getElementById("show-memo").addEventListener("click", function () {
    window.location.href = "/memos"; // 遷移先をメモページに変更
  });

  const showPostsButton = document.getElementById("show-posts");
  console.log(showPostsButton); // nullが表示されるかどうかを確認
  if (showPostsButton) {
    showPostsButton.addEventListener("click", function () {
      window.location.href = "/posts";
    });
  }
});