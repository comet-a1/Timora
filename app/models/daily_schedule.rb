class DailySchedule < ApplicationRecord
  belongs_to :calendar_schedule
  
  validates :start_time, presence: true
  validates :end_time, presence: true

  def end_time_after_start_time
    if end_time <= start_time
      errors.add(:end_time, 'は開始時間より後でなければなりません')
    end
  end
end
