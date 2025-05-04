class Post < ApplicationRecord
  belongs_to :user
  belongs_to :preset, optional: true

  has_many :likes, dependent: :destroy
end
