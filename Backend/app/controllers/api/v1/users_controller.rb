class Api::V1::UsersController < ApplicationController
  before_action :get_user, only: [:update, :destroy]

  def index
    @users = User.all
    render :json => @users, status: :ok
  end

  def create
    @user = User.find_or_create_by(user_params)
    if @user.valid?
      render :json => @user, status: :created
    else
      errors = @user.errors.full_messages
      user = JSON::parse(@user.to_json).merge({"errors" => errors})
      render :json => user, status: 400
    end
  end

  def update
    @user.update(user_params)
    render :json => @user, status: 200
  end

  def destroy
    @user.destroy
    render status: 204
  end


  private

  def get_event
    @user = User.find(params[:id])
  end

  def user_params
    params.require(:user).permit(:name, :email)
  end

end
