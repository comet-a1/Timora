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

  let selectedPresetId = null; // 右クリックしたプリセットのID

  // モーダル開閉関数
  function openModal(modal) {
    modal.style.display = "flex";

    // 予定作成モーダルを開いた場合はリセット
    if (modal === scheduleModal) {
      // resetScheduleForm(); // ここでリセット
    }
  }

  // 予定作成フォームのリセット
  function resetScheduleForm() {
    console.log("✅ 新規作成時にフォームリセットが実行されました！");
    document.getElementById("schedule-title").value = ""; // タイトルをリセット
    document.getElementById("start-time").innerHTML = "";
    document.getElementById("end-time").innerHTML = "";

    // ✅ 開始時間と終了時間の再生成
    generateTimeOptions("start-time");
    generateTimeOptions("end-time");
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

  document.getElementById('cancel-btn').addEventListener('click', function () {
    closeModal(presetModal);  // モーダルを閉じる関数を呼び出す
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
          closeModal(presetModal);;
          addPresetToList(data.preset);
          presetForm.reset();
        } else {
          alert("プリセットの作成に失敗しました。");
        }
      })
  });

  // プリセットをリストに追加
  function addPresetToList(preset) {
    const presetList = document.getElementById("preset-list"); // プリセットリストの親要素
    const existingPreset = document.querySelector(`.preset-item[data-id="${preset.id}"]`);
    if (!existingPreset) {
      const li = document.createElement("li");
      li.classList.add("preset-item");
      li.textContent = preset.name;
      li.dataset.id = preset.id;

      // プリセット選択時の処理
      li.addEventListener("click", function () {
        selectedPresetId = preset.id;
        presetNameHeading.textContent = preset.name;
        createScheduleBtn.style.display = "block";
        deletePresetBtn.style.display = "block";
        fetchPresetEvents(preset.id); // 予定の取得
      });

      const presetList = document.getElementById("preset-list");
      presetList.appendChild(li); // <ul> に <li> を追加
    }
  }

  // 予定作成ボタンの処理
  createScheduleBtn.addEventListener("click", function () {
    console.log("✅ 新規作成モードへ切り替え");
    window.isEditing = false; // ✅ 新規作成モード
    window.editEventId = null; // ✅ 編集IDリセット
    window.selectedEvent = null; // ✅ 前回の選択イベントリセット

    resetScheduleForm(); // ✅ 新規作成時はフォームリセット
    openModal(scheduleModal); // ✅ モーダルを開く
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
  
    if (!selectedPresetId) {
      alert("プリセットを選択してください。");
      return;
    }
  
    // ✅ 編集 or 新規作成の判定
    if (window.isEditing) {
      updatePresetEvent(window.editEventId, title, startTime, endTime);
    } else {
      createPresetEvent(title, startTime, endTime);
    }
  
    // ✅ フラグリセット
    window.isEditing = false;
    window.editEventId = null;
  });

  // ✅ 新規予定作成
  function createPresetEvent(title, startTime, endTime) {
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
          preset_id: selectedPresetId,
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          closeModal(scheduleModal);
          fetchPresetEvents(selectedPresetId); // ✅ 予定の再取得
        } else {
          alert("予定の作成に失敗しました。");
        }
      })
      .catch((error) => {
        console.error("予定作成エラー:", error);
      });
  }

  // ✅ 予定の更新
  function updatePresetEvent(eventId, title, startTime, endTime) {
    fetch(`/preset_events/${eventId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": document.querySelector('[name="csrf-token"]').content,
      },
      body: JSON.stringify({
        preset_event: {
          title: title,
          start_time: startTime,
          end_time: endTime,
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          closeModal(scheduleModal);
          fetchPresetEvents(selectedPresetId); // ✅ 予定の再取得
        } else {
          alert("予定の更新に失敗しました。");
        }
      })
      .catch((error) => {
        console.error("予定更新エラー:", error);
      });
  }

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
  
    // ✅ 午前の予定の表示
    if (morningEvents.length === 0) {
      morningContainer.innerHTML = "<p>午前の予定はありません。</p>";
    } else {
      morningEvents.forEach((event) => {
        const eventItem = createEventElement(event, "morning"); // ✅ 予定アイテム作成
        morningContainer.appendChild(eventItem);
      });
    }
  
    // ✅ 午後の予定の表示
    if (afternoonEvents.length === 0) {
      afternoonContainer.innerHTML = "<p>午後の予定はありません。</p>";
    } else {
      afternoonEvents.forEach((event) => {
        const eventItem = createEventElement(event, "afternoon"); // ✅ 予定アイテム作成
        afternoonContainer.appendChild(eventItem);
      });
    }
  }

  // ✅ 予定アイテムを作成する関数（右クリックイベント付き）
  function createEventElement(event, period) {
    const formattedStartTime = formatTime(event.start_time);
    const formattedEndTime = formatTime(event.end_time);

    const eventItem = document.createElement("div");
    eventItem.classList.add("preset-event-item");
    eventItem.dataset.id = event.id;
    eventItem.dataset.title = event.title;
    eventItem.dataset.startTime = event.start_time;
    eventItem.dataset.endTime = event.end_time;
    eventItem.dataset.period = period; // ✅ 午前・午後の区別

    eventItem.innerHTML = `
      <p>${formattedStartTime}～${formattedEndTime}　${event.title}</p>
    `;

    // ✅ 右クリックで context-menu を表示
    eventItem.addEventListener("contextmenu", function (e) {
      e.preventDefault();
      showContextMenu(e, eventItem);
    });

    return eventItem;
  }

  // ✅ context-menu を表示する関数
  function showContextMenu(event, eventItem) {
    const contextMenu = document.getElementById("preset-context-menu");

    // メニューの位置をマウス位置にセット
    contextMenu.style.top = `${event.clientY}px`;
    contextMenu.style.left = `${event.clientX}px`;
    contextMenu.style.display = "block";

    // ✅ 選択した予定情報を保持
    window.selectedEvent = {
      id: eventItem.dataset.id,
      title: eventItem.dataset.title,
      startTime: eventItem.dataset.startTime,
      endTime: eventItem.dataset.endTime,
      period: eventItem.dataset.period,
      element: eventItem,
    };
  }

  // ✅ context-menu を閉じる
  function closeContextMenu() {
    document.getElementById("preset-context-menu").style.display = "none";
  }

  // ✅ 画面のどこかをクリックすると context-menu を閉じる
  document.addEventListener("click", function () {
    closeContextMenu();
  });

  // ✅ 予定の削除ボタンクリック時の処理
  document.getElementById("delete-preset").addEventListener("click", function () {
    const selectedEvent = window.selectedEvent;
    if (!selectedEvent) return;
  
    // ✅ サーバーに preset_event 削除リクエストを送信
    fetch(`/preset_events/${selectedEvent.id}`, {
      method: "DELETE",
      headers: {
        "X-CSRF-Token": document.querySelector('[name="csrf-token"]').content,
      },
    })
      .then((response) => {
        if (response.ok) {
          // ✅ 予定の表示から削除
          selectedEvent.element.remove();
        } else {
          alert("予定の削除に失敗しました。");
        }
      })
      .catch((error) => {
        console.error("削除エラー:", error);
      });
  
    // ✅ context-menu を閉じる
    closeContextMenu();
  });

  // ✅ 予定の編集ボタンクリック時の処理
  document.getElementById("edit-preset").addEventListener("click", function () {
    const selectedEvent = window.selectedEvent;
    if (!selectedEvent) return;
  
    // ✅ 編集モーダルを開く
    openEditModal({
      id: selectedEvent.id,
      title: selectedEvent.title,
      startTime: selectedEvent.startTime,
      endTime: selectedEvent.endTime,
    });
  
    closeContextMenu(); // ✅ context-menu を閉じる
  });

  // ✅ ISO形式を "HH:mm" に変換する関数
  function formatToTimeString(isoString) {
    const date = new Date(isoString);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`; // 例: "09:15"
  }

  // ✅ 編集モーダルを開く関数（修正済み）
  function openEditModal(eventData) {
    console.log("受信したデータ:", eventData); // ✅ デバッグ
    openModal(scheduleModal); // ✅ モーダルを開く
  
    // ✅ 編集データをフォームにセット
    document.getElementById("schedule-title").value = eventData.title || "";
    document.getElementById("start-time").innerHTML = "";
    document.getElementById("end-time").innerHTML = "";
  
    // ✅ 時間選択肢を再生成
    generateTimeOptions("start-time");
    generateTimeOptions("end-time");
  
    // ✅ 開始時間と終了時間のセット
    document.getElementById("start-time").value = formatToTimeString(eventData.startTime);
    document.getElementById("end-time").value = formatToTimeString(eventData.endTime);
  
    // ✅ 編集モード有効化
    window.isEditing = true;
    window.editEventId = eventData.id;
    window.selectedEvent = eventData; // ✅ 選択されたイベントを保持
  }

  // ✅ データ取得処理
  function fetchPresetEvent(eventId) {
    fetch(`/preset_events/${eventId}`) // ✅ 正しいshowアクション
      .then((response) => response.json())
      .then((data) => {
        if (data.title) {
          openEditModal(data); // ✅ 取得したデータでモーダルを開く
        } else {
          console.error("データが取得できませんでした:", data);
        }
      })
      .catch((error) => {
        console.error("予定データ取得エラー:", error);
      });
  }

  const deletePresetBtn = document.getElementById("delete-preset-btn");
  const modal = document.getElementById("deletePresetModal");
  const confirmBtn = document.getElementById("preset-confirm-delete-btn");
  const cancelBtn = document.getElementById("preset-cancel-delete-btn");

  let targetPresetId = null;

  // モーダルを表示する処理
  deletePresetBtn.addEventListener("click", () => {
    if (!selectedPresetId) return;
    targetPresetId = selectedPresetId; // 外で定義されてる選択中IDを使用
    modal.classList.remove("hidden");
  });

  // モーダルをキャンセル
  cancelBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  // 「削除」ボタン押下時にfetch送信して削除実行
  confirmBtn.addEventListener("click", () => {
    if (!targetPresetId) return;

    fetch(`/presets/${targetPresetId}`, {
      method: "DELETE",
      headers: {
        "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content,
      },
    })
      .then((response) => {
        if (response.ok) {
          // 該当プリセットをリストから削除
          const presetItem = document.querySelector(`.preset-item[data-id="${targetPresetId}"]`);
          if (presetItem) presetItem.remove();

          // 予定リセット・UI更新
          resetPresetEvents();
          presetNameHeading.textContent = "";
          createScheduleBtn.style.display = "none";
          deletePresetBtn.style.display = "none";
          selectedPresetId = null;
          targetPresetId = null;
          window.location.reload(); 
        } else {
          console.error("プリセットの削除に失敗しました");
        }
      })
      .catch((error) => {
        console.error("エラー:", error);
      })
      .finally(() => {
        modal.classList.add("hidden"); // 削除完了後にモーダルを閉じる
      });
  });

  // ✅ 予定エリアのリセット関数
  function resetPresetEvents() {
    document.querySelector(".preset-event-morning").innerHTML = "<p>午前の予定はありません。</p>";
    document.querySelector(".preset-event-afternoon").innerHTML = "<p>午後の予定はありません。</p>";
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

  // 初回読み込み時にプリセットを表示
  function loadPresets() {
    // すでにHTML側で表示されているプリセットをJavaScript側で処理
    const presetItems = document.querySelectorAll('.preset-item');
    presetItems.forEach(item => {
      item.addEventListener('click', function () {
        selectedPresetId = item.dataset.id;  // クリックしたプリセットのIDを取得
        presetNameHeading.textContent = item.textContent;
        createScheduleBtn.style.display = "block";
        deletePresetBtn.style.display = "block";
        fetchPresetEvents(item.dataset.id); // 予定を取得
      });
    });
  }

  loadPresets(); // 初回読み込み実行
});