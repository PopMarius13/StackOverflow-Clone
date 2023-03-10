class CreateUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :users do |t|
      t.string :display_name, null: false
      t.string :email, null: false, index: { unique: true}
      t.string :password_digest, null: false
      t.string :session_token, null: false, index: { unique: true}
      t.integer :reputation, null: false, default: 0
      t.text :about_me

      t.timestamps
    end
  end
end

