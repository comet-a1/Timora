class PresetsController < ApplicationController
  before_action :authenticate_user!

  def index
    @presets = current_user.presets
    @preset_events = current_user.preset_events
    @presets =Preset.all
    render json: { presets: @presets }
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

  private

  def preset_params
    params.require(:preset).permit(:name).merge(user_id: current_user.id)
  end
end
