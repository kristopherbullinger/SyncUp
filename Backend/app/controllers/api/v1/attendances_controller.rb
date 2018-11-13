class Api::V1::AttendancesController < ApplicationController
  before_action :get_event, only: [:update, :destroy]

  def create
    @attendance = Attendance.create(attendance_params)
    render :json => @attendance, status: :created
  end

  def destroy
    @attendance.destroy
    render status: 204
  end


  private
  def get_attendance
    @attendance = Attendance.find(params[:id])
  end

  def attendance_params
    params.require(:attendance).permit(:event_id, :user_id)
  end

end
