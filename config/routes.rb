Rails.application.routes.draw do
  devise_for :users, controllers: {
    registrations: 'users/registrations'
  }

  devise_scope :user do
    get 'users/sign_up/step1', to: 'users/registrations#new_step1', as: 'new_user_step1'
    post 'users/sign_up/step1', to: 'users/registrations#create_step1', as: 'create_user_step1'

    get 'users/sign_up/step2', to: 'users/registrations#new_step2', as: 'new_user_step2'
    post 'users/sign_up/step2', to: 'users/registrations#create_step2', as: 'create_user_step2'
  end

  get '/schedules', to: 'schedules#index'
  get '/schedules/new', to: 'schedules#new'


  resources :schedules

  root 'posts#index'
  resources :posts

  get "up" => "rails/health#show", as: :rails_health_check
end
