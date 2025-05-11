class CreatePosts < ActiveRecord::Migration[7.1]
  def change
    create_table :posts do |t|
      t.text :description
      t.string :post_type
      t.integer :preset_id
      t.date :selected_date
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
