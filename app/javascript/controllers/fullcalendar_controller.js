import { Controller } from "stimulus"
import { Calendar } from "fullcalendar"

export default class extends Controller {
  connect() {
    const calendarEl = this.element
    const calendar = new Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      events: '/events.json' // イベントデータの取得先
    })
    calendar.render()
  }
}
