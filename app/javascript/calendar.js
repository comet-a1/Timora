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
        console.log("Returned data:", data);
        if (data.success) {
          const newEvent = {
            title: data.event.title,
            start: data.event.start_time, // FullCalendarが要求する形式で調整
            end: data.event.end_time,
          };
          console.log("New event data:", newEvent);

          // FullCalendarインスタンスにイベントを追加
          const calendar = new FullCalendar.Calendar(document.getElementById('calendar'), {});
          calendar.addEvent(newEvent);

          closeApplyModal();
        } else {
          alert("適用に失敗しました。");
        }
      })
      .catch((error) => {
        console.error("適用エラー:", error);
      });
  });
});