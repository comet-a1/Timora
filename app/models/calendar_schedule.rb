class CalendarSchedule < ApplicationRecord
  belongs_to :user
  has_many :daily_schedules, dependent: :destroy
  
  validates :title, presence: true
  validates :date, presence: true
  validates :repeat_id, presence: true
  validates :status_id, presence: true
  validates :visibility, presence: true
end
