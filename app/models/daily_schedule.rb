class DailySchedule < ApplicationRecord
  belongs_to :calendar_schedule
  
  validates :start_time, presence: true
  validates :end_time, presence: true
end
