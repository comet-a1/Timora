class Repeat < ActiveHash::Base
  self.data = [
    { id: 1, name: 'Daily' },
    { id: 2, name: 'Weekly' },
    { id: 3, name: 'Monthly' },
    { id: 4, name: 'Yearly' }
  ]

  include ActiveHash::Associations
  has_many :calendar_schedules
end