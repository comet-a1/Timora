document.addEventListener("DOMContentLoaded", () => {
  const memoList = document.getElementById("memo-list");
  const memoContent = document.getElementById("memo-content");
  const completeBtn = document.getElementById("complete-btn");
  const deleteBtn = document.getElementById("delete-btn");
  const newMemoBtn = document.getElementById("new-memo-btn");

  let selectedMemoId = null; // 選択中のメモID
  let isNewMemo = false; // 新規メモ作成フラグ

  // **新規メモ作成**
  newMemoBtn.addEventListener("click", () => {
    memoContent.value = ""; // テキストエリアを空に
    memoContent.style.display = "block";
    completeBtn.style.display = "inline-block"; // 完了ボタン表示
    deleteBtn.style.display = "none"; // 削除ボタンは非表示
    selectedMemoId = null;
    isNewMemo = true; // 新規作成モードに設定

    // 既存の選択状態をリセット
    document.querySelectorAll(".memo-item").forEach((el) => el.classList.remove("selected"));
  });

  // **メモの選択**
  memoList.addEventListener("click", (event) => {
    if (!event.target.classList.contains("memo-item")) return;

    // **UIリセット**
    completeBtn.style.display = "none"; // 完了ボタン非表示（既存メモ選択時）
    deleteBtn.style.display = "inline-block"; // 削除ボタン表示
    isNewMemo = false; // 既存メモモードに切り替え

    // すべてのメモアイテムから選択状態を解除
    document.querySelectorAll(".memo-item").forEach((el) => el.classList.remove("selected"));
    event.target.classList.add("selected");

    // 選択されたメモのIDを取得
    selectedMemoId = event.target.dataset.id;

    // メモの内容を取得して表示
    fetch(`/memos/${selectedMemoId}`)
      .then((response) => response.json())
      .then((data) => {
        memoContent.value = data.content;
      });

    memoContent.style.display = "block";
  });

  // **リアルタイム自動保存**
  memoContent.addEventListener("input", (event) => {
    if (isNewMemo) return; // 新規メモ作成中は何もしない
  
    const updatedContent = event.target.value.trim();
    if (!selectedMemoId) return; // IDがない場合は何もしない
  
    fetch(`/memos/${selectedMemoId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content,
      },
      body: JSON.stringify({ content: updatedContent }),
    })
      .then((response) => response.json())
      .then((data) => {
        // メモ一覧の該当メモを更新
        const memoItem = document.querySelector(`.memo-item[data-id="${selectedMemoId}"]`);
        if (memoItem) {
          // メモの内容を更新
          memoItem.textContent = data.content.length > 18 ? data.content.substring(0, 18) + "…" : data.content;
  
          // 作成日と更新日を表示 (created_at と updated_at を合わせて表示)
          const dateSpan = memoItem.querySelector("span"); // 日付を表示するためのspanを選択
          if (dateSpan) {
            // ここで新しくupdated_atのデータを表示
            dateSpan.textContent = new Date(data.updated_at).toLocaleString(); // フォーマットを変更して表示
          }
        }
      })
      .catch((error) => {
        console.error("エラー:", error);
      });
  });

  // **完了ボタンの処理（新規メモの保存）**
  completeBtn.addEventListener("click", () => {
    if (!isNewMemo) return; // 既存メモなら何もしない

    const content = memoContent.value.trim();
    if (content === "") {
      // メモが空の場合は保存せずにUIをリセット
      memoContent.style.display = "none";  // メモエリアを非表示
      completeBtn.style.display = "none";  // 完了ボタンを非表示
      isNewMemo = false;  // 新規作成モードを解除
      return; // ここで処理を終了し、サーバーリクエストは送らない
    }

    fetch("/memos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content,
      },
      body: JSON.stringify({ content: memoContent.value }),
    })
      .then((response) => response.json())
      .then((data) => {
        // 新規メモをリストに追加
        const newMemoItem = document.createElement("div");
        newMemoItem.classList.add("memo-item");
        newMemoItem.dataset.id = data.id;
        newMemoItem.textContent = data.content.length > 18 ? data.content.substring(0, 18) + "…" : data.content;
        memoList.appendChild(newMemoItem);

        // UIリセット
        completeBtn.style.display = "none";
        isNewMemo = false;
        selectedMemoId = data.id;
      })
      .catch((error) => {
        console.error("エラー:", error);
      });
  });

  // **削除ボタンの処理**
  deleteBtn.addEventListener("click", () => {
    if (!selectedMemoId) return;

    fetch(`/memos/${selectedMemoId}`, {
      method: "DELETE",
      headers: {
        "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content,
      },
    })
      .then((response) => {
        if (response.ok) {
          // メモ一覧から削除
          const memoItem = document.querySelector(`.memo-item[data-id="${selectedMemoId}"]`);
          if (memoItem) {
            memoItem.remove();
          }

          // UIリセット
          memoContent.style.display = "none";
          deleteBtn.style.display = "none";
          selectedMemoId = null;
        } else {
          console.error("メモの削除に失敗しました");
        }
      })
      .catch((error) => {
        console.error("エラー:", error);
      });
  });
});