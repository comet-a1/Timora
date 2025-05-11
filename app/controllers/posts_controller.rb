class PostsController < ApplicationController
  layout 'posts_layout'
  
  def index
    @user = current_user
    @presets = current_user.presets
    @posts = Post.order(created_at: :desc)
  end

  def new
    @user = current_user
    @presets = current_user.presets
    @posts = Post.order(created_at: :desc)
  end

  def create
    @post = current_user.posts.build(post_params)
  
    if @post.post_type == "preset"
      @post.preset = Preset.find_by(id: params[:post][:preset_id])
    elsif @post.post_type == "date"
      @post.selected_date = params[:post][:selected_date]
    end
  
    if @post.save
      render json: { message: "投稿成功" }, status: :created
    else
      render json: { errors: @post.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @post = Post.find(params[:id])
    if @post.user == current_user
      @post.destroy
      head :no_content  # 成功時はJSONレスポンス返さない
    else
      head :forbidden
    end
  end

  def show
    @user = User.find(params[:id])
    @posts = @user.posts.order(created_at: :desc)
    @presets  = @user.presets
  end

  def like
    post = Post.find(params[:id])
    post.likes.find_or_create_by(user: current_user)
    render json: { liked: true, count: post.likes.count }
  end
  
  def unlike
    post = Post.find(params[:id])
    like = post.likes.find_by(user: current_user)
    post.likes.find_by(user: current_user)&.destroy
    render json: { liked: false, count: post.likes.count }
  end
  
  private

  def post_params
    params.require(:post).permit(:description, :preset_id, :selected_date, :post_type)
  end
end