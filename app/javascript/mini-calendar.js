document.addEventListener("DOMContentLoaded", function () {
  let miniCalendarEl = document.getElementById("mini-calendar");

  if (!miniCalendarEl) {
    console.error("mini-calendar が見つかりません。HTML に <div id='mini-calendar'></div> を追加してください。");
    return;
  }

  // 今日の日付を取得
  const today = new Date();
  let currentMonth = today.getMonth();
  let currentYear = today.getFullYear();

  function renderMiniCalendar(year, month) {
    miniCalendarEl.innerHTML = "";

    const calendarHeader = document.createElement("div");
    calendarHeader.classList.add("calendar-header");

    const prevButton = document.createElement("button");
    prevButton.innerHTML = "◀";
    prevButton.onclick = function () {
      changeMonth(-1);
    };

    const nextButton = document.createElement("button");
    nextButton.innerHTML = "▶";
    nextButton.onclick = function () {
      changeMonth(1);
    };

    const monthYearLabel = document.createElement("div");
    monthYearLabel.textContent = `${year}年 ${month + 1}月`;

    calendarHeader.appendChild(prevButton);
    calendarHeader.appendChild(monthYearLabel);
    calendarHeader.appendChild(nextButton);

    const calendarWeekdays = document.createElement("div");
    calendarWeekdays.classList.add("calendar-weekdays");
    ["日", "月", "火", "水", "木", "金", "土"].forEach((day) => {
      const weekday = document.createElement("div");
      weekday.textContent = day;
      calendarWeekdays.appendChild(weekday);
    });

    const calendarDates = document.createElement("div");
    calendarDates.classList.add("calendar-dates");

    // 月の最初の日と最後の日
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();

    // 前月の表示
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
      const dateElement = createDateElement(prevMonthLastDay - i, "other-month");
      calendarDates.appendChild(dateElement);
    }

    // 当月の表示
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const dateElement = createDateElement(i);
      if (year === today.getFullYear() && month === today.getMonth() && i === today.getDate()) {
        dateElement.classList.add("today");
      }
      calendarDates.appendChild(dateElement);
    }

    // 翌月の表示
    const remainingDays = 42 - (startDay + lastDay.getDate()); // 6行 × 7列 = 42日分
    for (let i = 1; i <= remainingDays; i++) {
      const dateElement = createDateElement(i, "other-month");
      calendarDates.appendChild(dateElement);
    }

    miniCalendarEl.appendChild(calendarHeader);
    miniCalendarEl.appendChild(calendarWeekdays);
    miniCalendarEl.appendChild(calendarDates);
  }

  function createDateElement(day, className = "") {
    const dateElement = document.createElement("div");
    dateElement.classList.add("calendar-date");
    if (className) dateElement.classList.add(className);
    dateElement.textContent = day;

    // ✅ クリックしたらメインカレンダーを変更
    dateElement.addEventListener("click", function () {
      const selectedDate = new Date(currentYear, currentMonth, day);
      updateMainCalendar(selectedDate);
    });
    return dateElement;
  }

  function changeMonth(delta) {
    currentMonth += delta;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    } else if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    renderMiniCalendar(currentYear, currentMonth);
  }

  renderMiniCalendar(currentYear, currentMonth);
});