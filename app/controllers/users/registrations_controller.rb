class Users::RegistrationsController < Devise::RegistrationsController
  def step2
    @user = current_user || User.new
  end

  private

  def sign_up_params
    params.require(:user).permit(:email, :password, :password_confirmation, :gender_id, :mbti_id)
  end
end