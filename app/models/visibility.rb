class Visibility < ActiveHash::Base
  self.data = [
    { id: 1, name: '非公開' },
    { id: 2, name: '公開' }
  ]

  include ActiveHash::Associations
  has_many :calendar_schedules
end