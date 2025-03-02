class Users::RegistrationsController < Devise::RegistrationsController
  before_action :configure_sign_up_params, only: [:create_step1, :create_step2]

  # ステップ1 (new.html.erb)
  def new_step1
    @user = User.new
  end

  def create_step1
    @user = User.new(user_params_step1)

    # セッションに必要な情報を保存（パスワードは含まない）
    session[:user_params] = user_params_step1.to_h

    # ステップ2に進む
    redirect_to new_user_step2_path
  end

  # ステップ2 (step2.html.erb)
  def new_step2
    @user = User.new(session[:user_params])  # step1の情報を取得
    render 'step2'
  end

  def create_step2
    @user = User.new(session[:user_params])  # step1の情報を取得
    @user.assign_attributes(user_params_step2)  # step2の情報を追加

    if @user.save
      session.delete(:user_params)  # セッションから情報を削除
      sign_in(@user)  # ユーザーをサインイン
      redirect_to root_path, notice: "登録が完了しました！"
    else
      render :new_step2  # バリデーションエラーがあった場合、再度ステップ2を表示
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

