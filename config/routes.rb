TodoMvc::Application.routes.draw do
  root "application#index"
  
  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      resources :todos
    end
  end
end
