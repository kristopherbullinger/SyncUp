class Event < ApplicationRecord
  attr_accessor :attendees
  has_many :attendances
  has_many :users, through: :attendances
  serialize :tags

  def set_attendees
    self.attendees = self.users.map {|user| user.name}
  end
end
