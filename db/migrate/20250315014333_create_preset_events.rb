class CreatePresetEvents < ActiveRecord::Migration[7.1]
  def change
    create_table :preset_events do |t|
      t.references :preset, null: false, foreign_key: true
      t.string :title
      t.time :start_time
      t.time :end_time
      t.timestamps
    end
  end
end
