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
  has_many :posts
  has_many :likes, dependent: :destroy

  extend ActiveHash::Associations::ActiveRecordExtensions
  belongs_to :gender
  belongs_to :mbti


  validates :nickname, presence: true
  validates :birthdate, presence: true
  validates :email, presence: true
  validates :password, presence: true

  # フォロー関連
  has_many :active_relationships, class_name: "Relationship", foreign_key: "follower_id", dependent: :destroy
  has_many :passive_relationships, class_name: "Relationship", foreign_key: "followed_id", dependent: :destroy

  has_many :following, through: :active_relationships, source: :followed
  has_many :followers, through: :passive_relationships, source: :follower

  def follow(other_user)
    active_relationships.create(followed_id: other_user.id)
  end
  
  def unfollow(other_user)
    active_relationships.find_by(followed_id: other_user.id)&.destroy
  end
  
  def following?(other_user)
    following.include?(other_user)
  end
end
