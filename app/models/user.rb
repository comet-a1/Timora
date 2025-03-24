class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  has_one_attached :profile_picture
  has_many :events, dependent: :destroy
  has_many :memos
  has_many :presets, dependent: :destroy
  has_many :applied_events, dependent: :destroy

  extend ActiveHash::Associations::ActiveRecordExtensions
  belongs_to :gender
  belongs_to :mbti


  validates :nickname, presence: true
  validates :birthdate, presence: true
  validates :email, presence: true
  validates :password, presence: true
end
