Rails.application.routes.draw do
  get 'schedules/index'
  get 'schedules/new'
  devise_for :users, controllers: {
    registrations: 'users/registrations'
  }

  devise_scope :user do
    get 'users/sign_up/step1', to: 'users/registrations#new_step1', as: 'new_user_step1'
    post 'users/sign_up/step1', to: 'users/registrations#create_step1', as: 'create_user_step1'

    get 'users/sign_up/step2', to: 'users/registrations#new_step2', as: 'new_user_step2'
    post 'users/sign_up/step2', to: 'users/registrations#create_step2', as: 'create_user_step2'
  end

  root 'posts#index'
  resources :posts do
    member do
      post 'like'
      delete 'like', to: 'posts#unlike'
    end
  end
  
  resources :users do
    member do
      post 'follow'
      delete 'unfollow'
    end
  end

  resources :schedules

  resources :memos

  resources :presets

  resources :preset_events

  resources :applied_events

  get 'posts/show', to: 'posts#show'
  get 'users/show/:id', to: 'users#show', as: 'user_show'

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
end
