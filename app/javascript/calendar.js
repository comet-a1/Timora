document.addEventListener("DOMContentLoaded", function () {
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

  // モーダルを開くボタン
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
});