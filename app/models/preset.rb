class Preset < ApplicationRecord
  belongs_to :user
  has_many :preset_events, dependent: :destroy

  validates :name, presence: true
end
