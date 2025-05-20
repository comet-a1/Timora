class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  has_many :events, dependent: :destroy
  has_many :memos
  has_many :presets, dependent: :destroy
  has_many :applied_events, dependent: :destroy
  has_many :posts
  has_many :likes, dependent: :destroy

  extend ActiveHash::Associations::ActiveRecordExtensions
  belongs_to :gender
  belongs_to :mbti

  #バリデーション
  attr_accessor :validation_step

  with_options if: -> { validation_step == :step1 } do
    validates :email, presence: true
    validates :password, presence: true, length: { minimum: 6 }
    validates :password_confirmation, presence: true
  end

  with_options if: -> { validation_step == :step2 } do
    validates :nickname, presence: true
    validates :birthdate, presence: true
  end

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

  has_one_attached :profile_picture
  validate :correct_image_mime_type
  validate :correct_image_size

  private

  def password_required?
    # 画像の更新時にはパスワードが必要ない
    !profile_picture.attached?
  end

  def correct_image_mime_type
    if profile_picture.attached? && !profile_picture.content_type.in?(%w(image/png image/jpg image/jpeg))
      errors.add(:profile_picture, "はPNGまたはJPEG画像でなければなりません")
    end
  end

  def correct_image_size
    if profile_picture.attached? && profile_picture.byte_size > 5.megabytes
      errors.add(:profile_picture, "のサイズは5MB以下でなければなりません")
    end
  end
end
