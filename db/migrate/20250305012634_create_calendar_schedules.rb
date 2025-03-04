class CreateCalendarSchedules < ActiveRecord::Migration[7.1]
  def change
    create_table :calendar_schedules do |t|
      t.references :user          , null: false, foreign_key: true
      t.date       :date          , null: false
      t.string     :title
      t.text       :description
      t.integer    :repeat_id     , default: 0
      t.integer    :status_id     , default: 0
      t.datetime   :reminder_time
      t.integer    :visibility    , default: 0

      t.timestamps
    end
  end
end
