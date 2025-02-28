document.addEventListener('DOMContentLoaded', function () {
  // fullCalendarの初期化
  $('#calendar').fullCalendar({
    header: {
      left: 'prev,next today',
      center: 'title',
      right: 'month,agendaWeek,agendaDay'
    },
    defaultView: 'agendaDay', 
    events: [
      {
        title: 'イベント1',
        start: '2025-02-10',
        end: '2025-02-12'
      },
      {
        title: 'イベント2',
        start: '2025-02-15T10:00:00',
        end: '2025-02-15T12:00:00'
      }
      // ここにイベントを追加
    ],
    selectable: true,
    selectHelper: true,
    editable: true,  // イベントの編集を許可
    droppable: true  // ドラッグアンドドロップでイベントを移動可能
  });

  // プリセット
  $('#day-view-calendar').fullCalendar({
    header: {
      left: 'prev,next today',
      center: 'title',
      right: 'agendaDay'
    },
    defaultView: 'agendaDay',
    events: [
      {
        title: 'プリセット1',
        start: '2025-02-10T09:00:00',
        end: '2025-02-10T10:00:00'
      },
      {
        title: 'プリセット2',
        start: '2025-02-15T10:00:00',
        end: '2025-02-15T12:00:00'
      }
      // プリセットのイベントデータ
    ],
    selectable: true,
    selectHelper: true,
    editable: true,
    droppable: true
  });

  // **ミニカレンダーの初期化**
  const miniCalendar = document.querySelector(".mini-calendar");
  const calendarDates = document.querySelector(".calendar-dates");
  const monthLabel = document.querySelector(".month-label");
  const prevMonthBtn = document.querySelector(".prev-month");
  const nextMonthBtn = document.querySelector(".next-month");

  let currentDate = new Date();

  function renderMiniCalendar() {
    calendarDates.innerHTML = "";
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    monthLabel.textContent = `${year}年${month + 1}月`;

    const firstDay = new Date(year, month, 1).getDay(); 
    const lastDate = new Date(year, month + 1, 0).getDate();
    const prevLastDate = new Date(year, month, 0).getDate();

    // 先月の日付
    for (let i = firstDay - 1; i >= 0; i--) {
      let date = document.createElement("div");
      date.classList.add("calendar-date", "other-month");
      date.textContent = prevLastDate - i;
      calendarDates.appendChild(date);
    }

    // 今月の日付
    for (let i = 1; i <= lastDate; i++) {
      let date = document.createElement("div");
      date.classList.add("calendar-date");
      date.textContent = i;

      let today = new Date();
      if (year === today.getFullYear() && month === today.getMonth() && i === today.getDate()) {
        date.classList.add("today");
      }

      // 日付をクリックするとFullCalendarの該当日を表示
      date.addEventListener("click", function () {
        document.querySelectorAll(".calendar-date").forEach(d => d.classList.remove("selected"));
        date.classList.add("selected");

        let clickedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        $('#calendar').fullCalendar('gotoDate', clickedDate);
      });

      calendarDates.appendChild(date);
    }

    // 翌月の日付
    let remainingDays = 42 - calendarDates.children.length;
    for (let i = 1; i <= remainingDays; i++) {
      let date = document.createElement("div");
      date.classList.add("calendar-date", "other-month");
      date.textContent = i;
      calendarDates.appendChild(date);
    }
  }

  prevMonthBtn.addEventListener("click", function () {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderMiniCalendar();
  });

  nextMonthBtn.addEventListener("click", function () {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderMiniCalendar();
  });

  renderMiniCalendar();

  // 切り替えボタンの処理
  const showCalendarBtn = document.getElementById('show-calendar');
  const showMemoBtn = document.getElementById('show-memo');
  const showPresetsBtn = document.getElementById('show-presets');
  const calendarSection = document.getElementById('calendar-section');
  const memoSection = document.getElementById('memo-section');
  const presetsSection = document.getElementById('presets-section');

  showCalendarBtn.addEventListener('click', function() {
    calendarSection.classList.add('active');
    memoSection.classList.remove('active');
    presetsSection.classList.remove('active');
    showCalendarBtn.classList.add('active');
    showMemoBtn.classList.remove('active');
    showPresetsBtn.classList.remove('active');
  });

  showMemoBtn.addEventListener('click', function() {
    memoSection.classList.add('active');
    calendarSection.classList.remove('active');
    presetsSection.classList.remove('active');
    showMemoBtn.classList.add('active');
    showCalendarBtn.classList.remove('active');
    showPresetsBtn.classList.remove('active');
  });

  showPresetsBtn.addEventListener('click', function() {
    presetsSection.classList.add('active');
    calendarSection.classList.remove('active');
    memoSection.classList.remove('active');
    showPresetsBtn.classList.add('active');
    showCalendarBtn.classList.remove('active');
    showMemoBtn.classList.remove('active');
  });

  // 仮のメモデータ（実際はDBから取得する想定）
  const memos = [
    { id: 1, title: "買い物リスト", date: "2025/02/26", content: "牛乳、卵、パンを買う" },
    { id: 2, title: "勉強計画", date: "2025/02/25", content: "数学の問題を30問解く" },
    { id: 3, title: "アプリ開発", date: "2025/02/24", content: "デザインの修正をする" }
  ];

  const memoList = document.getElementById("memo-list");
  const memoContent = document.getElementById("memo-content");

  // メモ一覧を表示
  function renderMemoList() {
    memoList.innerHTML = ""; // リストをクリア
    memos.forEach(memo => {
      const memoItem = document.createElement("div");
      memoItem.classList.add("memo-item");
      memoItem.dataset.id = memo.id; // メモのIDをセット

      memoItem.innerHTML = `
        <div class="memo-title">${memo.title}</div>
        <div class="memo-date">${memo.date}</div>
      `;

      memoItem.addEventListener("click", () => loadMemo(memo.id));

      memoList.appendChild(memoItem);
    });
  }

  // メモを読み込む
  function loadMemo(id) {
    const memo = memos.find(m => m.id === id);
    if (memo) {
      memoContent.value = memo.content;
    }
  }

  // 初回の描画
  renderMemoList();

  $('#day-view-calendar').fullCalendar({
    header: {
      left: 'prev,next today',
      center: 'title',
      right: 'day'  // 'day' 表示を指定
    },
    defaultView: 'agendaDay', // デフォルトの表示を「日」ビューに設定
    events: [
      // イベントを追加する場合、ここにJSON形式で設定
    ]
  });
});