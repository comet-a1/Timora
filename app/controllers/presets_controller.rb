class PresetsController < ApplicationController
  layout 'schedules_layout'
  before_action :authenticate_user!

  def index
    @presets = current_user.presets
    respond_to do |format|
      format.html # ← index.html.erb が表示される
      format.json { render json: { presets: @presets } }
    end
  end

  def create
    @preset = Preset.new(preset_params)
    @preset.user_id = current_user.id
  
    if @preset.save
      render json: { success: true, preset: { id: @preset.id, name: @preset.name } }, status: :created
    else
      render json: { success: false, message: 'プリセットの作成に失敗しました' }, status: :unprocessable_entity
    end
  end

  def destroy
    @preset = Preset.find(params[:id])
    
    if @preset.destroy
      render json: { message: "Memo deleted successfully" }, status: :ok
    else
      render json: { error: "Failed to delete preset" }, status: :unprocessable_entity
    end
  end

  def show
    @preset = current_user.presets.find(params[:id])
    @events = @preset.preset_events
    render json: @events
  end

  def preset_events
    # プリセットIDを取得
    preset = current_user.presets.find(params[:id])

    # プリセットに関連するイベントを取得
    events = preset.preset_events

    # JSONで返す
    render json: events
  end

  private

  def preset_params
    params.require(:preset).permit(:name).merge(user_id: current_user.id)
  end
end
