class Event < ApplicationRecord
  attr_accessor :attendees
  has_many :attendances, dependent: :destroy
  has_many :users, through: :attendances
  belongs_to :originator, foreign_key: "user_id", class_name: "User"
  serialize :tags

  def set_attendees
    self.attendees = self.users.map {|user| user.name}
  end
end
