document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM読み込み完了！");
  let calendarEl = document.getElementById("calendar"); // メインカレンダー

  // ✅ メインカレンダーの表示
  let calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",

    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay",
    },
    selectable: true,
    editable: true,
    locale: "ja",
    events: function (fetchInfo, successCallback, failureCallback) {
      fetch("/schedules.json")
        .then((response) => response.json())
        .then((data) => {
          console.log("取得したイベントデータ:", data); // ✅ ここでデータを確認
          successCallback(data);
        })
        .catch((error) => {
          console.error("イベント取得エラー:", error);
          failureCallback(error);
        });
    },
    eventClick: function (info) {
      alert("イベント: " + info.event.title);
    },
  });

  // カレンダーインスタンスをグローバルに保持
  window.calendar = calendar;

  calendar.render();

  // ✅ 他のスクリプトから呼び出せるようにグローバル関数として登録
  window.updateMainCalendar = function (date) {
    console.log("メインカレンダーを更新:", date);
    calendar.gotoDate(date);
  };

  window.addEventToCalendar = function (eventData) {
    console.log("カレンダーに追加:", eventData);
    calendar.addEvent(eventData);
  };


  // ✅ 予定作成モーダルの要素
  const eventModal = document.getElementById("event-modal");
  const newEventBtn = document.getElementById("new-event-btn");
  const closeEventModalBtn = document.getElementById("close-modal");
  const eventForm = document.getElementById("event-form");

  // ✅ モーダルの閉会関数
  function openModal(modal) {
    modal.style.display = "flex"; // ✅ 引数modalを正しく使用
  }

  function closeModal(modal) {
    modal.style.display = "none";
    eventForm.reset(); // ✅ フォームリセット
  }

  document.getElementById("new-event-btn").addEventListener("click", function () {
    console.log("ボタンクリックされました！"); // ✅ デバッグ用
    openModal(eventModal);
  });

  // ✅ 新規予定作成ボタンのクリックイベント
  document.getElementById('cancel-btn').addEventListener('click', function () {
    closeModal(eventModal);  // モーダルを閉じる関数を呼び出す
  });

  // ✅ 予定作成フォームの送信処理
  eventForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // ✅ フォームデータ取得
    const formData = {
      title: document.getElementById("event-title").value,
      date: document.getElementById("event-date").value,
      start_time: document.getElementById("event-start-time").value,
      end_time: document.getElementById("event-end-time").value,
      description: document.getElementById("event-description").value,
    };

    // ✅ POSTリクエストで予定作成
    fetch("/schedules", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": document.querySelector('[name="csrf-token"]').content,
      },
      body: JSON.stringify({ event: formData }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("予定の作成に失敗しました。");
        }
        return response.json();
      })
      .then((data) => {
        console.log("新しい予定:", data);
        alert("予定が作成されました！");

        // ✅ カレンダーを更新して新しいイベントを表示
        if (window.calendar) {
          window.calendar.refetchEvents(); // FullCalendarの再描画
        }

        // ✅ モーダルを閉じる
        closeModal();
      })
      .catch((error) => {
        console.error("エラー:", error);
        alert("予定の作成に失敗しました。");
      });
  });

  // ✅ モーダル外のクリックで閉じる
  window.addEventListener("click", function (event) {
    if (event.target === eventModal) {
      closeModal();
    }
  });
  // モーダルを閉じる関数
  window.closeEventModal = function() {
    eventModal.style.display = "none";
  };


  // preset適用処理
  const openPresetBtn = document.getElementById("open-preset-btn");
  const applyModal = document.getElementById("apply-modal");
  const presetSelect = document.getElementById("apply-preset");
  const dateInput = document.getElementById("apply-date");

  // ボタンをクリックしたときにモーダルを表示
  openPresetBtn.addEventListener("click", function () {
    // プリセットをサーバーから取得して選択欄に表示
    fetch('/presets.json')
      .then(response => response.json())
      .then(data => {
        presetSelect.innerHTML = '';
  
        // プリセットがある場合だけ表示
        if (data.presets.length > 0) {
          data.presets.forEach(preset => {
            const option = document.createElement('option');
            option.value = preset.id;  // プリセットのID
            option.textContent = preset.name;  // プリセット名
            presetSelect.appendChild(option);
          });
        } else {
          // プリセットがない場合には '選択してください' を表示
          const defaultOption = document.createElement('option');
          defaultOption.value = "";
          defaultOption.textContent = "選択してください";
          presetSelect.appendChild(defaultOption); // 一番上に表示
        }
      })
      .catch(error => console.error('プリセットの読み込みエラー:', error));

    // モーダルを表示
    applyModal.style.display = "flex"; // モーダルを表示する
  });

  // モーダルを閉じる関数
  window.closeApplyModal = function() {
    applyModal.style.display = "none";
  };

  document.getElementById("apply-form").addEventListener("submit", function (event) {
    event.preventDefault();
  
    const date = document.getElementById("apply-date").value;
    const presetId = document.getElementById("apply-preset").value;
  
    // ✅ AJAXで適用リクエスト
    fetch("/applied_events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": document.querySelector('[name="csrf-token"]').content,
      },
      body: JSON.stringify({
        applied_event: {
          preset_id: presetId,
          date: date,
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Returned data:", data); // データの確認
        if (data.success && Array.isArray(data.event) && data.event.length > 0) {
          // イベントが配列で、かつ要素がある場合
          const event = data.event[0];
  
          // 新しいイベントデータの作成
          const newEvent = {
            title: event.title, // 正しいタイトル
            start: event.start_time, // 正しい開始時刻
            end: event.end_time, // 正しい終了時刻
          };
          console.log("New event data:", newEvent); // イベントデータの確認
  
          // グローバルに保持されているcalendarインスタンスに新しいイベントを追加
          if (window.calendar) {
            // 新しいイベントをカレンダーに追加
            window.calendar.addEvent(newEvent);
  
            // カレンダーのイベントデータを再取得して再描画
            window.calendar.refetchEvents();
  
            // モーダルを閉じる
            closeApplyModal();
          } else {
            console.error("FullCalendarインスタンスが見つかりません。");
          }
        } else {
          alert("適用に失敗しました。データが正しくありません。");
        }
      })
      .catch((error) => {
        console.error("適用エラー:", error);
      });
  });

  function populateTimeOptions(selectElement) {
    // 開始時間と終了時間
    const startHour = 0; // 0:00
    const endHour = 23;  // 23:45 まで

    // 15分刻みで時間生成
    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const formattedHour = String(hour).padStart(2, "0");
        const formattedMinute = String(minute).padStart(2, "0");
        const timeValue = `${formattedHour}:${formattedMinute}`; // 00:00, 00:15, ...
        
        // オプションを作成
        const option = document.createElement("option");
        option.value = timeValue;
        option.textContent = timeValue;
      
        // select に追加
        selectElement.appendChild(option);
      }
    }
  }
  // 時間選択要素の取得
  const startTimeSelect = document.getElementById("event-start-time");
  const endTimeSelect = document.getElementById("event-end-time");

  // 開始時間と終了時間のオプションを生成
  if (startTimeSelect && endTimeSelect) {
    populateTimeOptions(startTimeSelect);
    populateTimeOptions(endTimeSelect);
  }
});