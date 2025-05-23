# frozen_string_literal: true

class MemosController < ApplicationController
  layout 'schedules_layout'
  def index
    @memos = current_user.memos
    respond_to do |format|
      format.html # ← views/memos/index.html.erb を使う
      format.json { render json: @memos.map { |memo| { id: memo.id, content: memo.content } } }
    end
  end

  def create
    # Memoオブジェクトを作成
    return unless params[:memo][:content].present?

    @memo = Memo.new(memo_params)
    @memo.user_id = current_user.id # ユーザーIDを設定（ログインユーザー）
    @memo.save
    render json: @memo
  end

  def update
    @memo = current_user.memos.find(params[:id])

    if @memo.update(content: params[:content])
      render json: @memo
    else
      render json: { error: 'Failed to update memo' }, status: :unprocessable_entity
    end
  end

  def show
    @memo = Memo.find(params[:id])
    render json: @memo # メモの詳細をJSONで返す
  end

  def destroy
    @memo = Memo.find(params[:id])

    if @memo.destroy
      render json: { message: 'Memo deleted successfully' }, status: :ok
    else
      render json: { error: 'Failed to delete memo' }, status: :unprocessable_entity
    end
  end

  private

  def memo_params
    params.require(:memo).permit(:content).merge(user_id: current_user.id)
  end
end
