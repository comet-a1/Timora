class PresetsController < ApplicationController
  before_action :authenticate_user!

  def index
    @presets = current_user.presets
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
