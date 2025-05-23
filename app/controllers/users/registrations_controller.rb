class Users::RegistrationsController < Devise::RegistrationsController
  before_action :configure_sign_up_params, only: [:create_step1, :create_step2]

  # ステップ1 (new.html.erb)
  def new_step1
    @user = User.new
    render 'new'
  end

  def create_step1
    @user = User.new(user_params_step1)
    @user.validation_step = :step1

    if @user.valid?
      session[:user_params] = user_params_step1.to_h
      redirect_to new_user_step2_path
    else
      render :new
    end
  end

  # ステップ2 (step2.html.erb)
  def new_step2
    @user = User.new(session[:user_params])
    render 'step2'
  end

  def create_step2
    @user = User.new(session[:user_params])
    @user.assign_attributes(user_params_step2)
    @user.validation_step = :step2

    if @user.save
      session.delete(:user_params)
      sign_in(@user)
      redirect_to root_path, notice: "登録が完了しました！"
    else
      render :step2 
    end
  end

  private

  # ステップ1で必要なパラメータのみを許可
  def user_params_step1
    params.require(:user).permit(:email, :password, :password_confirmation)
  end

  # ステップ2で必要なパラメータを許可
  def user_params_step2
    params.require(:user).permit(:nickname, :profile_picture, :gender_id, :mbti_id, :birthdate, :occupation)
  end

  # Deviseのサインアップ用パラメータを許可
  def configure_sign_up_params
    devise_parameter_sanitizer.permit(:sign_up, keys: [:nickname, :profile_picture, :gender_id, :mbti_id, :birthdate, :occupation])
  end
end

