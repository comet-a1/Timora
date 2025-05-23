# frozen_string_literal: true

class Event < ApplicationRecord
  belongs_to :user

  validates :date, presence: true
  validates :title, presence: true
  validates :start_time, presence: true
  validates :end_time, presence: true
end
