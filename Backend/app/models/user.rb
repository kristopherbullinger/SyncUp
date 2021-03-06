class User < ApplicationRecord
  has_many :attendances
  has_many :events, through: :attendances

  validates :name, uniqueness: true
  validates :name, presence: true
  validates :email, presence: true
end
