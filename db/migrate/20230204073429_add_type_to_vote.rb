class AddTypeToVote < ActiveRecord::Migration[7.0]
  def change
    add_column :votes, :type_post, :boolean, :default => false
  end
end
