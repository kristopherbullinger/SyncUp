Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  namespace :api do
    namespace :v1 do
      resources :users, :attendances, :events
      # GET user/:id/attendances
      # GET event/:id/attendances
    end
  end
end
