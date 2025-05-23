# frozen_string_literal: true

class Mbti < ActiveHash::Base
  self.data = [
    { id: 0, name: '未設定' },
    { id: 1, name: 'INTJ' },
    { id: 2, name: 'INTP' },
    { id: 3, name: 'ENTJ' },
    { id: 4, name: 'ENTP' },
    { id: 5, name: 'INFJ' },
    { id: 6, name: 'INFP' },
    { id: 7, name: 'ENFJ' },
    { id: 8, name: 'ENFP' },
    { id: 9, name: 'ISTJ' },
    { id: 10, name: 'ISFJ' },
    { id: 11, name: 'ESTJ' },
    { id: 12, name: 'ESFJ' },
    { id: 13, name: 'ISTP' },
    { id: 14, name: 'ISFP' },
    { id: 15, name: 'ESTP' },
    { id: 16, name: 'ESFP' }
  ]

  include ActiveHash::Associations
  has_many :users
end
