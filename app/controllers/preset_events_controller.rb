class PresetEventsController < ApplicationController
  before_action :authenticate_user!

  def index
    preset = Preset.find_by(id: params[:preset_id])
    if preset
      @preset_events = preset.preset_events
      render json: @preset_events
    else
      render json: []
    end
  end

  def create
    @preset_event = PresetEvent.new(preset_event_params)
    if @preset_event.save
      render json: { success: true, preset_event: @preset_event }
    else
      render json: { success: false, errors: @preset_event.errors.full_messages }
    end
  end

  private

  def preset_event_params
    params.require(:preset_event).permit(:title, :start_time, :end_time, :preset_id)
  end
end
