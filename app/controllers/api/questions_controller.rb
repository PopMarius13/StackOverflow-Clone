class Api::QuestionsController < ApplicationController
  def index
    #search
    if params[:search].present? && params[:search] != "undefined"
      @questions = search_questions(params[:search])
    else
      @questions = Question.all
    end

    # metadata questions
    @tags = Hash.new
    @questions.each do |question|
      taggings = Tagging.where(question_id: question.id)
      tags = Tag.where(id: taggings.pluck(:tag_id))
      @tags[question.id] = tags
    end

    # order
    sort_question(params[:order])

    # pagination
    page = 1
    page = params[:page].to_i unless params[:page] == "undefined" || params[:page] == "null"
    @questions = @questions.paginate(page: page, per_page: 15)
    render :index
  end

  def create
    @question = Question.new(question_params)
    
    if @question.save
      taggings = params[:taggings]

      taggings.each do |tag|
        tagDb = Tag.where(name: tag).first
        if tagDb.nil?
          tagDb = Tag.create(name: tag)
        end
        Tagging.create(tag_id: tagDb.id, question_id: @question.id)
      end

      render 'api/questions/show'
    else
      render json: @question.errors.full_messages, status: 422
    end
  end

  def show
    @question = Question.find(params[:id])
    if @question
      render Json: @question
    else
      render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    @question = Question.find_by(id: question_params[:id])
    tags = params[:tags]
    if @question
      if @question.update(question_params)
        Tagging.where(question_id: @question.id).destroy_all
        if tags.present?
          tags.each do |tag_name|
            tag = Tag.find_by_name(tag_name)
            if tag.nil?
              tag = Tag.create(name: tag_name)
            end
            Tagging.create(tag_id: tag.id, question_id: @question.id)
          end
        end
        render :show
      else
        render json: @question.errors.full_messages, status: 422
      end
    else
      render json: ['Question Not Found'], status: 404
    end
  end

  def destroy
    @question = Question.find_by(id: params[:id])
    if @question.nil?
      render json: ['Question cannot be found'], status: 422
    else
      if current_user.id == @question.author_id
        @question.destroy!
        render :show
      else
        render json: ['Question is not destroyed'], status: 422
      end
    end
  end

  private
  def question_params
    params.require(:question).permit(:editor_id, :title, :body, :author_id, :id, :updated_at)
  end

  def sort_question(type)
    case type
    when "Newest"
      @questions = @questions.order(:created_at)
    when "Oldest"
      @questions = @questions.order(created_at: :desc)
    when "MostAnswered"
      @questions = @questions.left_joins(:answers)
        .select('questions.*, COUNT(answers.id) AS answer_count')
        .group('questions.id')
        .order('answer_count DESC')
    when "LeastAnswered"
      @questions = @questions.left_joins(:answers)
        .select('questions.*, COUNT(answers.id) AS answer_count')
        .group('questions.id')
        .order('answer_count')
    else
      @questions = @questions.order(:created_at)
    end
  end

  def search_questions(search)
    words = search.split(' ')
    if words.length > 0
      questions = Question.where('title LIKE ?', "%#{words.join('%')}%")
    end
    questions
  end
end