class AppliedEventsController < ApplicationController
  before_action :authenticate_user!

  # プリセット適用
  def create
    applied_event = current_user.applied_events.new(applied_event_params)
  
    if applied_event.save
      # ✅ `events` に反映
      new_event = applied_event.apply_to_events # 新しいイベントを取得
      render json: { success: true, event: new_event }, status: :created
    else
      render json: { success: false, errors: applied_event.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def apply_to_events
    new_event = nil
    preset.preset_events.each do |preset_event|
      new_event = Event.create!(
        user_id: user_id,
        title: preset_event.title,
        start_time: generate_datetime(date, preset_event.start_time),
        end_time: generate_datetime(date, preset_event.end_time),
        date: date
      )
    end
    new_event # 作成した新しいイベントを返す
  end

  private

  def applied_event_params
    params.require(:applied_event).permit(:preset_id, :date)
  end
end
