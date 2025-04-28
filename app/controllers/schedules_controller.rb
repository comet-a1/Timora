class SchedulesController < ApplicationController
  layout 'schedules_layout'
  
  def index
    @memos = current_user.memos
    @presets = current_user.presets
    @events = current_user.events

    respond_to do |format|
      format.html # HTMLビューを返す
      format.json { render json: @events.map { |event| format_event(event) } }
    end
  end

  def new
    @event = Event.new  # フォーム用の新しいEventオブジェクト
  end

  def create
    @event = Event.new(event_params.merge(user_id: current_user.id)) 
    if @event.save
      render json: { success: true, event: @event }, status: :created
    else
      render json: { success: false, errors: @event.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @event = Event.find(params[:id])

    if @event.destroy
      render json:{ success: true, message: "削除成功" }
    else
      render json: { success: false, error: "削除に失敗しました" }, status: :unprocessable_entity
    end
  end

  def update
    @event = Event.find(params[:id])

    if @event.update(event_params)
      render json: @event
    else
      render json: { error: "更新に失敗しました" }, status: :unprocessable_entity
    end
  end

  private

  def event_params
    params.require(:event).permit(:title, :date, :start_time, :end_time, :description)
  end
  
  def format_event(event)
    {
      id: event.id,
      title: event.title,
      start: "#{event.date}T#{event.start_time.strftime('%H:%M:%S')}",
      end: "#{event.date}T#{event.end_time.strftime('%H:%M:%S')}",
      description: event.description || ""
    }
  end
end
