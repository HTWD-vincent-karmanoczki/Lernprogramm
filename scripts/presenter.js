"use strict";
/**
 * Presenter class for the quiz application
 * Handles user interactions and updates the view
 */
export class Presenter {
    constructor(view, model) {
        this.view = view;
        this.model = model;

        // Bind event handlers
        this.view.onAnswerClick = this.handleAnswerClick.bind(this);
        this.view.onQuizSelect = this.handleQuizSelect.bind(this);
        this.view.onQuizStart = this.startQuiz.bind(this);
        this.view.onRestartQuiz = this.restartQuiz.bind(this);
    }

    /**
     * Start the quiz by loading the first question.
     */
    startQuiz(questionCount) {
        this.model.setTotalQuestions(questionCount);
        this.model.takeStartTime();
        this.view.showSection('view-quiz');
        this.view.showStatistics(true);
        this.loadNextQuestion();
    }

    /**
     * Load the next question and update the view.
     */
    loadNextQuestion() {
        let obj = this.model.loadNextQuestion();
        if (obj) {

            let isVexFlow = this.model.categories[this.model.category].vexflow;

            this.view.showQuestion(obj.question, obj.answers, isVexFlow, this.view.onAnswerClick);
            this.view.updateProgress(this.model.currentQuestionIndex, this.model.totalQuestions);
            this.view.setWrong(this.model.questionsWrong);
        } else {
            this.view.updateProgress(2, 1);
            this.showResults();
        }
    }

    /**
     * Handle answer selection by the user.
     * @param {number} answerIndex - The index of the selected answer.
     */
    async handleAnswerClick(answerIndex) {
        const isCorrect = await this.model.submitAnswer(answerIndex);
        // Update the view with feedback
        this.view.showFeedback(isCorrect, answerIndex);

        if(isCorrect) {
            setTimeout(() => {
                // Load the next question after a short delay
                this.loadNextQuestion();
            }, 500); // 0.5 second delay for feedback visibility
        } else {
            this.view.setWrong(this.model.questionsWrong);
        }
    }

    /**
     * Handle quiz selection from the view.
     * @param {string} quizType - The type of quiz selected.
     */
    handleQuizSelect(quizType) {
        // Load questions based on selected quiz type
        this.model.loadQuestions(quizType).then(() => {
            this.view.prepareViewStart(this.model.categories[quizType], this.model.questions.length);
            this.view.showSection('view-start');
        });
    }

    restartQuiz() {
        this.view.showSection('view-home');
    }

    /**
     * Initialize the presenter
     */
    async init() {
        await this.model.loadCategories();
        this.view.prepareNavBar(this.model.categories);
        this.view.prepareViewHome(this.model.categories);
        this.view.addEventHandlersForHomeAndNav(this.handleQuizSelect.bind(this));
        this.view.addEventHandlerForCountInput();
        this.view.addEventHandlerForQuizStart(this.startQuiz.bind(this));
        this.view.addEventHandlerForRestartQuiz(this.restartQuiz.bind(this));
        this.view.setupKatex();
        this.view.showSection('view-home');
    }
    /**
     * Show the results of the quiz
     */
    showResults() {
        this.model.takeEndTime();
        this.view.showSection('view-results');
        this.view.showStatistics(false);
        this.view.showResults(this.model.totalQuestions,
            this.model.questionsWrong,
            this.model.questionsFirstTry,
            this.model.quizStartTime,
            this.model.quizEndTime,
            this.model.categories[this.model.category].label
        );
    }
}