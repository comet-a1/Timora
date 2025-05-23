# frozen_string_literal: true

class UsersController < ApplicationController
  layout 'posts_layout'

  def show
    @user = User.find(params[:id])
    @posts = @user.posts.order(created_at: :desc)
    @presets = @user.presets
  end

  def follow
    user = User.find(params[:id])
    current_user.follow(user)
    render json: {
      followed: true,
      following_count: user.following.count,
      followers_count: user.followers.count
    }
  end

  def unfollow
    user = User.find(params[:id])
    current_user.unfollow(user)
    render json: {
      followed: false,
      following_count: user.following.count,
      followers_count: user.followers.count
    }
  end

  def profile_picture_update
    @user = User.find(params[:id])
    @user.profile_picture.purge if @user.profile_picture.attached?
    @user.profile_picture.attach(params[:user][:profile_picture])

    if @user.save
      render json: {
        message: 'アイコンを更新しました',
        profile_picture_url: url_for(@user.profile_picture)
      }
    else
      render json: { error: '保存に失敗しました' }, status: :unprocessable_entity
    end
  end

  private

  def profile_picture_params
    params.require(:user).permit(:profile_picture, :password)
  end
end
