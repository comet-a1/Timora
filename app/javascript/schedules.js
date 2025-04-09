document.addEventListener('DOMContentLoaded', function () {
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

  document.getElementById("toPostsBtn").addEventListener("click", function () {
    window.location.href = "/posts";
  });
});