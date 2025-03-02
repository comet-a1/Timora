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

  root 'posts#index'
  resources :posts
  resources :schedules
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
end
