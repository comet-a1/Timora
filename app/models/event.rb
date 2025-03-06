class Event < ApplicationRecord
  belongs_to :user

  validates :date, presence: true
  validates :title, presence: true
  validates :start, presence: true
  validates :end, presence: true
end
