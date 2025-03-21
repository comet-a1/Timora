document.addEventListener('DOMContentLoaded', function () {
  // モーダル要素取得
  const presetModal = document.getElementById("preset-modal");
  const newPresetBtn = document.getElementById("new-preset-btn");
  const closePresetModalBtn = document.getElementById("close-modal");
  const presetForm = document.getElementById("preset-form");
  const presetList = document.getElementById("preset-list");

  const scheduleModal = document.getElementById("schedule-modal");
  const createScheduleBtn = document.getElementById("create-schedule-btn");
  const presetNameHeading = document.getElementById("preset-name");

  const contextMenu = document.getElementById("context-menu");
  let selectedPresetId = null; // 右クリックしたプリセットのID

  // モーダル開閉関数
  function openModal(modal) {
    modal.style.display = "flex";

    // 予定作成モーダルを開いた場合はリセット
    if (modal === scheduleModal) {
      resetScheduleForm(); // ここでリセット
    }
  }

  // 予定作成フォームのリセット
  function resetScheduleForm() {
    document.getElementById("schedule-form").reset(); // フォームリセット
  }

  function closeModal(modal) {
    modal.style.display = "none";
  }

  // プリセット作成モーダルを開く
  newPresetBtn.addEventListener("click", function () {
    openModal(presetModal);
  });

  // モーダルを閉じる
  closePresetModalBtn.addEventListener("click", function () {
    closeModal(presetModal);
  });

  // フォーム送信時の処理（プリセット作成）
  presetForm.addEventListener("submit", function (event) {
    event.preventDefault(); // デフォルトの送信を防止

    const presetName = document.getElementById("preset-name-input").value.trim();

    if (!presetName) {
      alert("プリセット名を入力してください。");
      return;
    }

    // AJAXでプリセットを保存
    fetch('/presets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content
      },
      body: JSON.stringify({
        preset: { name: presetName }
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        closeModal(presetModal);
        addPresetToList(data.preset);
        presetForm.reset();
      } else {
        alert("プリセットの作成に失敗しました。");
      }
    })
  });

  // プリセットをリストに追加
  function addPresetToList(preset) {
    console.log("プリセットリストに追加:", preset);

    const li = document.createElement("li");
    li.textContent = preset.name;
    li.dataset.id = preset.id;

    li.addEventListener("click", function () {
      console.log("プリセット選択:", preset.id);
      document.getElementById("preset-name").textContent = preset.name;
    });

    presetList.appendChild(li);
  }

  // 初回読み込み時にプリセットを取得＆表示
  function loadPresets() {
    fetch('/presets')
      .then(response => response.json())
      .then(data => {
        console.log("プリセット一覧取得:", data);
        if (Array.isArray(data.presets)) {
          data.presets.forEach(addPresetToList);
        } else {
          console.error("取得データが配列でない:", data);
        }
      })
      .catch(error => console.error("プリセット読み込みエラー:", error));
  }

  loadPresets(); // 初回読み込み実行

  // プリセットをリストに追加
  function addPresetToList(preset) {
    const li = document.createElement("li");
    li.textContent = preset.name;
    li.dataset.id = preset.id;

    // プリセット選択時の処理
    li.addEventListener("click", function () {
      presetNameHeading.textContent = preset.name;
      createScheduleBtn.style.display = "block";
      window.currentPresetId = preset.id; // グローバルに保持
    });

    // 右クリック時の処理（コンテキストメニュー）
    li.addEventListener("contextmenu", function (event) {
      event.preventDefault();
      selectedPresetId = preset.id;
      showContextMenu(event);
    });

    presetList.appendChild(li);
  }

  // コンテキストメニューを表示
  function showContextMenu(event) {
    contextMenu.style.display = "block";
    contextMenu.style.left = `${event.pageX}px`;
    contextMenu.style.top = `${event.pageY}px`;
  }

  // コンテキストメニューを閉じる
  document.addEventListener("click", function () {
    contextMenu.style.display = "none";
  });

  // プリセットの削除
  window.deletePreset = function () {
    if (!selectedPresetId) return;

    if (!confirm("本当に削除しますか？")) return;

    fetch(`/presets/${selectedPresetId}`, {
      method: "DELETE",
      headers: {
        "X-CSRF-Token": document.querySelector('[name="csrf-token"]').content
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert("プリセットを削除しました！");
        document.querySelector(`li[data-id='${selectedPresetId}']`).remove();
      } else {
        alert("削除に失敗しました。");
      }
    })
    .catch(error => console.error("Error:", error));
  };

  // プリセットの名前変更
  window.renamePreset = function () {
    if (!selectedPresetId) return;

    const newName = prompt("新しいプリセット名を入力してください:");
    if (!newName) return;

    fetch(`/presets/${selectedPresetId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": document.querySelector('[name="csrf-token"]').content
      },
      body: JSON.stringify({ preset: { name: newName } })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert("プリセット名を変更しました！");
        document.querySelector(`li[data-id='${selectedPresetId}']`).textContent = newName;
      } else {
        alert("名前変更に失敗しました。");
      }
    })
    .catch(error => console.error("Error:", error));
  };

  // 予定作成ボタンの処理
  createScheduleBtn.addEventListener("click", function () {
    openModal(scheduleModal);
  });

  // 予定作成モーダルを閉じる
  window.closeModal = function () {
    closeModal(scheduleModal);
  };

  // 予定作成フォーム送信処理
  document.getElementById("schedule-form").addEventListener("submit", function (event) {
    event.preventDefault();
  
    const title = document.getElementById("schedule-title").value;
    const startTime = document.getElementById("start-time").value;
    const endTime = document.getElementById("end-time").value;
  
    if (!window.currentPresetId) {
      alert("プリセットを選択してください。");
      return;
    }
  
    // AJAXで予定を保存
    fetch("/preset_events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": document.querySelector('[name="csrf-token"]').content,
      },
      body: JSON.stringify({
        preset_event: {
          title: title,
          start_time: startTime,
          end_time: endTime,
          preset_id: window.currentPresetId,
        },
      }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {

          closeModal(scheduleModal);
          fetchPresetEvents(window.currentPresetId); // ✅ 予定の再取得＆表示
        } else {
          alert("エラーが発生しました。");
        }
      })
      .catch(error => {
        console.error("予定作成エラー:", error);
      });
  });

  // 予定を取得して表示する関数
  function fetchPresetEvents(presetId) {
    fetch(`/preset_events?preset_id=${presetId}`) // ✅ URL修正
      .then(response => response.json())
      .then(data => {
        console.log("取得した予定:", data); // ✅ ログで確認
        displayPresetEvents(data.morning_events, data.afternoon_events); 
      })
      .catch(error => console.error("予定の取得エラー:", error));
  }

  // 予定を画面に表示する関数
  function displayPresetEvents(morningEvents, afternoonEvents) {
    const morningContainer = document.querySelector(".preset-event-morning");
    const afternoonContainer = document.querySelector(".preset-event-afternoon");
  
    // 一度リストをクリア
    morningContainer.innerHTML = "";
    afternoonContainer.innerHTML = "";
  
    // 午前の予定の表示
    if (morningEvents.length === 0) {
      morningContainer.innerHTML = "<p>午前の予定はありません。</p>";
    } else {
      morningEvents.forEach((event) => {
        const formattedStartTime = formatTime(event.start_time);
        const formattedEndTime = formatTime(event.end_time);
  
        const eventItem = document.createElement("div");
        eventItem.classList.add("preset-event-item");
        eventItem.innerHTML = `
          <p>${formattedStartTime}～${formattedEndTime}　${event.title}</p>
        `;
        morningContainer.appendChild(eventItem);
      });
    }
  
    // 午後の予定の表示
    if (afternoonEvents.length === 0) {
      afternoonContainer.innerHTML = "<p>午後の予定はありません。</p>";
    } else {
      afternoonEvents.forEach((event) => {
        const formattedStartTime = formatTime(event.start_time);
        const formattedEndTime = formatTime(event.end_time);
  
        const eventItem = document.createElement("div");
        eventItem.classList.add("preset-event-item");
        eventItem.innerHTML = `
          <p>${formattedStartTime}～${formattedEndTime}　${event.title}</p>
        `;
        afternoonContainer.appendChild(eventItem);
      });
    }
  }

  // 時間のフォーマットを変換する関数
  function formatTime(isoString) {
    const date = new Date(isoString);

  // 日本時間の表示形式に変換
  const options = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // 24時間表記
    timeZone: "Asia/Tokyo" // JST指定
  };

  return new Intl.DateTimeFormat("ja-JP", options).format(date);
  }

  document.getElementById("preset-list").addEventListener("click", function(event) {
    if (event.target.tagName === "LI") {
      const presetId = event.target.dataset.id; // ✅ 正しいIDの取得
      document.getElementById("preset-name").textContent = event.target.textContent;
      document.getElementById("create-schedule-btn").style.display = "block";
      window.currentPresetId = presetId; // ✅ プリセットIDをグローバル変数に保存

      // ✅ プリセットIDを利用して予定を取得して表示
      fetchPresetEvents(presetId);
    }
  });

  // 右クリックメニューを閉じる
  document.addEventListener("click", function () {
    contextMenu.style.display = "none";
  });

  // 時間選択肢を生成する関数
  function generateTimeOptions(selectId) {
    const select = document.getElementById(selectId);
    const startTime = new Date(0); // 0時からスタート
    const endTime = new Date(0); // 23:45までの時間

    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        // 時間と分を設定
        startTime.setHours(hour, minute, 0, 0);
        
        // 時間のフォーマットをHH:MMに
        const timeString = startTime.toTimeString().slice(0, 5);
        
        // <option>要素を生成
        const option = document.createElement('option');
        option.value = timeString;
        option.textContent = timeString;
        
        // セレクトボックスに追加
        select.appendChild(option);
      }
    }
  }

  // 開始時間と終了時間の選択肢を生成
  generateTimeOptions('start-time');
  generateTimeOptions('end-time');
});