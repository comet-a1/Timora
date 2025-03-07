document.addEventListener("DOMContentLoaded", function () {
  const startTimeSelect = document.getElementById("eventStartTime");
  const endTimeSelect = document.getElementById("eventEndTime");

  function generateTimeOptions() {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute of ["00", "15", "30", "45"]) {
        const time = `${String(hour).padStart(2, "0")}:${minute}`;
        times.push(time);
      }
    }
    return times;
  }

  function populateTimeSelect(selectElement) {
    generateTimeOptions().forEach(time => {
      const option = document.createElement("option");
      option.value = time;
      option.textContent = time;
      selectElement.appendChild(option);
    });
  }

  populateTimeSelect(startTimeSelect);
  populateTimeSelect(endTimeSelect);
});