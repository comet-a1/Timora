class CalendarSchedule < ApplicationRecord
  belongs_to :user
  has_many :daily_schedules, dependent: :destroy

  extend ActiveHash::Associations::ActiveRecordExtensions
  belongs_to_active_hash :repeat
  belongs_to_active_hash :status
  belongs_to_active_hash :visibility
  
  validates :title, presence: true
  validates :date, presence: true


  def set_default_status
    self.status_id ||= :pending  # デフォルトは :pending
  end

  # 必要に応じて、リマインダーの日時が設定されている場合の処理を追加
  def reminder_time_valid?
    reminder_time.nil? || reminder_time > DateTime.now
  end
end
