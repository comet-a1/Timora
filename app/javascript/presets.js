document.addEventListener('DOMContentLoaded', function () {
  // モーダル要素取得
  const presetModal = document.getElementById("preset-modal");
  const newPresetBtn = document.getElementById("new-preset-btn");
  const closePresetModalBtn = document.getElementById("close-modal");
  const presetForm = document.getElementById("preset-form");
  const presetList = document.getElementById("preset-list");

  const scheduleModal = document.getElementById("schedule-modal");
  const createScheduleBtn = document.getElementById("create-schedule-btn");
  const deletePresetBtn = document.getElementById("delete-preset-btn");
  const presetNameHeading = document.getElementById("preset-name");

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
    const existingPreset = document.querySelector(`.preset-item[data-id="${preset.id}"]`);
    if (!existingPreset) {
      const div = document.createElement("div");
      div.classList.add("preset-item");
      div.textContent = preset.name;
      div.dataset.id = preset.id;

      // プリセット選択時の処理
      div.addEventListener("click", function () {
        selectedPresetId = preset.id;  // 選択されたプリセットのIDを保持
        presetNameHeading.textContent = preset.name;
        createScheduleBtn.style.display = "block";
        deletePresetBtn.style.display = "block";
        fetchPresetEvents(preset.id); // 予定の取得
      });

      presetList.appendChild(div);
    }
  }

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
  
    if (!selectedPresetId) {
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
          preset_id: selectedPresetId,
        },
      }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          closeModal(scheduleModal);
          fetchPresetEvents(selectedPresetId); // 予定の再取得＆表示
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
    const contextMenu = document.getElementById("context-menu");

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
    document.getElementById("context-menu").style.display = "none";
  }

  // ✅ 画面のどこかをクリックすると context-menu を閉じる
  document.addEventListener("click", function () {
    closeContextMenu();
  });

  // ✅ 予定の削除ボタンクリック時の処理
  document.getElementById("delete-event").addEventListener("click", function () {
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

  // ✅ 編集モーダルを開く関数
  function openEditModal(eventData) {
    // ✅ フォームの初期値に既存のデータをセット
    document.getElementById("schedule-title").value = eventData.title;
    document.getElementById("start-time").value = eventData.start_time;
    document.getElementById("end-time").value = eventData.end_time;

    // ✅ 編集モードフラグをセット
    window.isEditing = true;
    window.editEventId = eventData.id;

    // ✅ 予定作成モーダルを開く
    openModal(scheduleModal);
  }
  
  // プリセット削除ボタンのクリック処理
  deletePresetBtn.addEventListener("click", function () {
    if (!selectedPresetId) return;
  
    // サーバーに削除リクエストを送信
    fetch(`/presets/${selectedPresetId}`, {
      method: "DELETE",
      headers: {
        "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content,
      },
    })
      .then((response) => {
        if (response.ok) {
          // プリセット一覧からプリセットを削除
          const presetItem = document.querySelector(`.preset-item[data-id="${selectedPresetId}"]`);
          if (presetItem) {
            presetItem.remove();
          }

          // ✅ 予定エリアをリセット
          resetPresetEvents();

          // UIリセット
          presetNameHeading.textContent = "";  // プリセット名をリセット
          createScheduleBtn.style.display = "none";  // 予定作成ボタンを非表示
          deletePresetBtn.style.display = "none";  // 削除ボタンを非表示
          selectedPresetId = null;  // 削除後、選択されたIDをリセット
        } else {
          console.error("プリセットの削除に失敗しました");
        }
      })
      .catch((error) => {
        console.error("エラー:", error);
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
});