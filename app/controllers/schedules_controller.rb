class SchedulesController < ApplicationController
  before_action :set_calendar_schedule, only: [:show, :update, :destroy]

  # スケジュール一覧表示
  def index
    @calendar_schedules = CalendarSchedule.where(user: current_user)
  end

  # 新しいスケジュール作成フォーム
  def new
    @calendar_schedule = CalendarSchedule.new
  end

  # 予定と日々のスケジュールを一度に作成
  def create
    @schedule = CalendarSchedule.new(schedule_params)
    @schedule.user = current_user  # 🔹 ユーザー情報を紐づける
  
    if @schedule.save
      redirect_to schedules_path, notice: "スケジュールが保存されました"
    else
      render :new, status: :unprocessable_entity
    end
  end

  # スケジュール詳細表示
  def show
  end

  # 予定を更新する
  def update
    ActiveRecord::Base.transaction do
      if @calendar_schedule.update(calendar_schedule_params)
        # 例: 最初の DailySchedule を更新する場合
        @daily_schedule = @calendar_schedule.daily_schedules.first
        if @daily_schedule.update(daily_schedule_params)
          render json: @calendar_schedule
        else
          render json: @daily_schedule.errors, status: :unprocessable_entity
        end
      else
        render json: @calendar_schedule.errors, status: :unprocessable_entity
      end
    end
  end

  # 予定を削除する
  def destroy
    ActiveRecord::Base.transaction do
      @calendar_schedule.destroy
      # もし関連の daily_schedule があれば削除
      @calendar_schedule.daily_schedules.destroy_all
    end
    head :no_content
  end

  private

  # パラメータの許可
  def schedule_params
    params.require(:calendar_schedule).permit(:title, :date, :description, :repeat_id, :status_id, :visibility)
  end

  def daily_schedule_params
    params.require(:daily_schedule).permit(:start_time, :end_time)
  end

  def set_calendar_schedule
    @calendar_schedule = current_user.calendar_schedules.find(params[:id])
  end
end
