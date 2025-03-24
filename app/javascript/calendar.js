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
  const applyPresetModal = document.getElementById("apply-preset-modal");
  const presetSelect = document.getElementById("preset");
  const applyPresetBtn = document.getElementById("apply-preset-btn");
  const dateInput = document.getElementById("date");

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
    applyPresetModal.style.display = "flex"; // モーダルを表示する
  });

  // モーダルを閉じる関数
  window.closeApplyPresetModal = function() {
    applyPresetModal.style.display = "none";
  };
});