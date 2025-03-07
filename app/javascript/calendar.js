document.addEventListener("DOMContentLoaded", function () {
  let calendarEl = document.getElementById("calendar"); // メインカレンダー

  // ✅ メインカレンダーの表示
  let calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth", // 初期表示を「月」に設定
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay", // 月・週・日表示を切り替え
    },
    locale: "ja", // 日本語設定
    events: "/events.json", // イベント取得API
  });

  calendar.render();
});