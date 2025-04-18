class CreatePosts < ActiveRecord::Migration[7.1]
  def change
    create_table :posts do |t|
      t.text :description
      t.integer :preset_id
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
