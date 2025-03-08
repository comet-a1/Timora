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
});