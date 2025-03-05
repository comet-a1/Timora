class CreateDailySchedules < ActiveRecord::Migration[7.1]
  def change
    create_table :daily_schedules do |t|
      t.references :calendar_schedule, null: false, foreign_key: true
      t.time       :start_time,        null: false
      t.time       :end_time,          null: false

      t.timestamps
    end
  end
end
