class Api::V1::EventsController < ApplicationController
  before_action :get_event, only: [:update, :destroy]

  def index
    @events = Event.all
    modifiedEvents = []
    @events.each do |event|
      event.tags ||= []
      event.tags << "music" << "games"
      event = JSON::parse(event.to_json).merge({"attendees" => event.set_attendees})
      modifiedEvents << event
    end
    render :json => modifiedEvents, status: :ok
  end

  def create
    @event = Event.create(event_params)
    render :json => @event, status: :created
  end

  def update
    @event.update(event_params)
    render :json => @event, status: 200
  end

  def destroy
    @event.destroy
    render status: 204
  end


  private

  def get_event
    @event = Event.find(params[:id])
  end

  def event_params
    params.require(:event).permit(:address, :date, :title, :description, :tags => [])
  end

end
