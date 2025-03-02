Rails.application.routes.draw do
  devise_for :users, controllers: {
    registrations: 'users/registrations'
  }

  devise_scope :user do
    get 'users/sign_up/step2', to: 'users/registrations#step2', as: :step2_users_registration
  end

  get 'step2', to: 'devise/registrations#step2', as: 'step2'

  get '/schedules', to: 'schedules#index'
  get '/schedules', to: 'schedules#new'

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
