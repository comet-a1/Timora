class AppliedEvent < ApplicationRecord
  belongs_to :preset
  belongs_to :user

  # `applied_event` から `preset_event` を取り出す
  has_many :preset_events, through: :preset

  # `applied_event` から `event` を作成する
  def apply_to_events
    preset.preset_events.each do |preset_event|
      Event.create!(
        user_id: user_id,
        title: preset_event.title,
        start_time: generate_datetime(date, preset_event.start_time),
        end_time: generate_datetime(date, preset_event.end_time),
        date: self.date
      )
    end
  end

  private

  # 日付と時間を結合して `datetime` を生成
  def generate_datetime(date, time_string)
    DateTime.parse("#{date} #{time_string}")
  end
end
