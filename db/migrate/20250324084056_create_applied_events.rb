# frozen_string_literal: true

class CreateAppliedEvents < ActiveRecord::Migration[7.1]
  def change
    create_table :applied_events do |t|
      t.references :preset, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.date :date, null: false

      t.timestamps
    end
  end
end
