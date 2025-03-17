class PresetEventsController < ApplicationController
  before_action :authenticate_user!

  def index
    @preset_events = PresetEvent.where(preset_id: prams[:preset_id])
    render json: { preset_events: @preset_events}
  end

  def create
    # 現在ログインしているユーザーのIDを取得
    user_id = current_user.id
    preset_id = params[:preset_event][:preset_id]
    title = params[:preset_event][:title]
    start_time = params[:preset_event][:start_time]
    end_time = params[:preset_event][:end_time]

    # presetsテーブルから選択されたプリセットを取得
    preset = Preset.find(preset_id)

    # 新しい予定を作成
    preset_event = PresetEvent.new(
      preset_id: preset.id,
      title: title,
      start_time: start_time,
      end_time: end_time
    )

    if preset_event.save
      render json: { success: true, message: "予定が保存されました。" }
    else
      render json: { success: false, message: "保存に失敗しました。" }
    end
  end
end
