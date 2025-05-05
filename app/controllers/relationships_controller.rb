class RelationshipsController < ApplicationController
  before_action :authenticate_user!

  def create
    user = User.find(params[:id])
    current_user.follow(user)
    render json: { followed: true }
  end

  def destroy
    user = User.find(params[:id])
    current_user.unfollow(user)
    render json: { followed: false }
  end
end
