class UsersController < ApplicationController
  layout "posts_layout" 

  def show
    @user = User.find(params[:id])
    @posts = @user.posts.order(created_at: :desc)
    @presets  = @user.presets
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
end