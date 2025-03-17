class PresetsController < ApplicationController
  before_action :authenticate_user!

  def index
    @presets =Preset.all
    render json: { presets: @presets }
  end

  def create
    @preset = Preset.new(preset_params)
    @preset.user_id = current_user.id
  
    if @preset.save
      render json: { success: true, message: "プリセットが保存されました" }
    else
      render json: { success: false, message: "プリセットの保存に失敗しました", errors: @preset.errors.full_messages }
    end
  end

  private

  def preset_params
    params.require(:preset).permit(:name)
  end
end
