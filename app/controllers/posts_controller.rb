class PostsController < ApplicationController
  def index
    @posts = current_user.posts
    @presets = current_user.presets
    @posts = Post.order(created_at: :desc)
  end

  def create
    @post = current_user.posts.build(post_params)

    if @post.save
      render json: { message: "投稿成功" }, status: :created
    else
      render json: { errors: @post.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def post_params
    params.require(:post).permit(:description, :preset_id)
  end
end