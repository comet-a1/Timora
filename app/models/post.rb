class Post < ApplicationRecord
  belongs_to :user
  belongs_to :preset, optional: true
end
