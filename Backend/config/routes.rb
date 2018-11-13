Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  namespace :api do
    namespace :v1 do
      resources :users, :events
      resources :attendances, except: [:destroy]
      # GET user/:id/attendances
      # GET event/:id/attendances
      delete "attendances", to: "attendances#destroy"
    end
  end
end
