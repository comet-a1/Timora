class Preset < ApplicationRecord
  belongs_to :user
  has_many :preset_events, dependent: :destroy
  has_many :applied_events, dependent: :destroy
  has_many :posts

  validates :name, presence: true
end
