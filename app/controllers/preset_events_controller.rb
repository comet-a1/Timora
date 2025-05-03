class PresetEventsController < ApplicationController
  layout 'schedules_layout'
  before_action :authenticate_user!

  def index
    preset = Preset.find_by(id: params[:preset_id])

    if preset
      preset_events = preset.preset_events.order(:start_time)

      # 午前・午後に分割
      @morning_events = preset_events.select { |event| event.start_time.hour < 12 }
      @afternoon_events = preset_events.select { |event| event.start_time.hour >= 12 }

      # JSONで2つのブロックに分けて返す
      render json: {
        morning_events: @morning_events,
        afternoon_events: @afternoon_events,
      }
    else
      render json: { morning_events: [], afternoon_events: [] }
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

  # ✅ 予定の削除
  def destroy
    @preset_event = PresetEvent.find(params[:id])

    if @preset_event.destroy
      head :no_content
    else
      render json: { error: "削除に失敗しました" }, status: :unprocessable_entity
    end
  end

  def show
    @preset_event = PresetEvent.find(params[:id])
  
    # ✅ 期待するデータ形式で返す
    render json: {
      id: @preset_event.id,
      title: @preset_event.title, # ✅ title を含める
      start_time: @preset_event.start_time.strftime("%H:%M"), # ✅ 時刻のみ
      end_time: @preset_event.end_time.strftime("%H:%M"),     # ✅ 時刻のみ
      preset_id: @preset_event.preset_id
    }
  end

  # ✅ 予定更新処理
  def update
    @preset_event = PresetEvent.find(params[:id])
  
    if @preset_event.update(preset_event_params)
      # ✅ 更新後のデータを返す
      render json: {
        success: true,
        preset_event: {
          id: @preset_event.id,
          title: @preset_event.title,
          start_time: @preset_event.start_time.strftime("%Y-%m-%dT%H:%M:%S"),
          end_time: @preset_event.end_time.strftime("%Y-%m-%dT%H:%M:%S"),
          preset_id: @preset_event.preset_id
        }
      }
    else
      render json: { success: false, errors: @preset_event.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def preset_event_params
    params.require(:preset_event).permit(:title, :start_time, :end_time, :preset_id)
  end
end