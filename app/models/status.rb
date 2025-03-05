class Status < ActiveHash::Base
  self.data = [
    { id: 1, name: 'Pending' },
    { id: 2, name: 'Confirmed' },
    { id: 3, name: 'Cancelled' },
    { id: 4, name: 'Completed' }
  ]

  include ActiveHash::Associations
  has_many :calendar_schedules
end