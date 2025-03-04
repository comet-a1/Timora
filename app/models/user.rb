class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  has_many :calendar_schedules
  has_many :daily_schedules
  has_one_attached :profile_picture

  extend ActiveHash::Associations::ActiveRecordExtensions
  belongs_to :gender
  belongs_to :mbti


  validates :nickname, presence: true
  validates :birthdate, presence: true
  validates :email, presence: true
  validates :password, presence: true
end
