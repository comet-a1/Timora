class UsersController < ApplicationController
  layout "posts_layout" 

  def show
    @user = User.find(params[:id])
    @posts = @user.posts.order(created_at: :desc)
    @presets  = @user.presets
  end
end