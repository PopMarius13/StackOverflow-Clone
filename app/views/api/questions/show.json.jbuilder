json.question do
    json.extract! @question, :id, :title, :body, :views, :author_id, :editor_id, :created_at, :updated_at
    json.votes_attributes @question.votes.where(type: false).each do |vote|
        json.extract! vote, :id, :post_id, :voter_id, :vote
    end
end