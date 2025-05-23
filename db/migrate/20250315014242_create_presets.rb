# frozen_string_literal: true

class CreatePresets < ActiveRecord::Migration[7.1]
  def change
    create_table :presets do |t|
      t.references :user, null: false, foreign_key: true
      t.string :name, null: false
      t.timestamps
    end
  end
end
