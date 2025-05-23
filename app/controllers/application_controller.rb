class ApplicationController < ActionController::Base
  before_action :authenticate_user!
  before_action :basic_auth
  before_action :configure_permitted_parameters, if: :devise_controller?
  before_action :set_active_storage_url_options

  def after_sign_out_path_for(resource_or_scope)
    new_user_session_path  # サインインページにリダイレクト
  end

  private

  def basic_auth
    authenticate_or_request_with_http_basic do |username, password|
      username == ENV["BASIC_AUTH_USER"] && password == ENV["BASIC_AUTH_PASSWORD"]
    end
  end

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:nickname, :profile_picture, :gender_id, :mbti_id, :birthdate, :occupation])
  end

  def set_active_storage_url_options
    ActiveStorage::Current.url_options = {
      protocol: request.protocol.delete(':'), # "http" or "https"
      host: request.host,
      port: request.port
    }
  end
end
