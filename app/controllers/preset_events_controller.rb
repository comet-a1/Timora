class PresetEventsController < ApplicationController
  before_action :authenticate_user!

  def index
    preset = Preset.find_by(id: params[:preset_id])

    if preset
      # 同じ時間帯の最新予定だけを取得
      @preset_events = preset.preset_events
                            .select("preset_events.*, MAX(updated_at) AS latest_update")
                            .group(:start_time, :end_time, :id)
                            .order("start_time, end_time")

      render json: @preset_events
    else
      render json: []
    end
  end

  def create
    # 同じ時間帯の予定を検索
    existing_event = PresetEvent.find_by(
      preset_id: preset_event_params[:preset_id],
      start_time: preset_event_params[:start_time],
      end_time: preset_event_params[:end_time]
    )

    if existing_event
      # 既存の予定がある場合はタイトルを更新
      if existing_event.update(title: preset_event_params[:title])
        render json: { success: true, preset_event: existing_event }
      else
        render json: { success: false, errors: existing_event.errors.full_messages }
      end
    else
      # 新しい予定の場合は作成
      @preset_event = PresetEvent.new(preset_event_params)
      if @preset_event.save
        render json: { success: true, preset_event: @preset_event }
      else
        render json: { success: false, errors: @preset_event.errors.full_messages }
      end
    end
  end

  private

  def preset_event_params
    params.require(:preset_event).permit(:title, :start_time, :end_time, :preset_id)
  end
end
