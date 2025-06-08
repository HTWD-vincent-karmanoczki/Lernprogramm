"use strict";

import { getQuestions, getQuestionById, submitAnswer } from './rest.js';

const questionFile = 'scripts/questions.json';
const categoriesFile = 'scripts/categories.json';

export class Model {
    constructor() {
        this.category = '';
        this.questions = [];
        this.questionsWrong = 0;
        this.questionsFirstTry = 0; // Number of questions answered correctly on the first try
        this.totalQuestions = 0;
        this.currentQuestionIndex = 0;
        this.hasQuizWrong = false;
        this.quizStartTime = 0;
        this.quizEndTime = 0;
        this.categories = []; // List of categories
        this.isLocal = true; // Indicates if questions are loaded from a web server
    }

    takeStartTime() {
        // Record the start time of the quiz
        this.quizStartTime = Date.now();
    }

    takeEndTime() {
        // Record the end time of the quiz
        this.quizEndTime = Date.now();
    }

    shuffleArray(array) {
        // Shuffle an array using the Fisher-Yates algorithm
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    /**
     * Load the next question.
     * @return {Object|null} The next question object with question text and answers, or null if no more questions.
     */
    loadNextQuestion() {
        if (this.currentQuestionIndex < this.totalQuestions) {
            const question = this.questions[this.currentQuestionIndex];
            this.currentQuestionIndex++;
            return {question: question.question, answers: question.answers};
        } else {
            // No more questions available (quiz done)
            return null;
        }
    }

    async submitAnswerWeb(answerIndex) {
        // Submit the answer to the web server and return if it was correct
        const questionId = this.questions[this.currentQuestionIndex - 1].id;
        return (await submitAnswer(questionId, answerIndex)).success;
    }

    /**
     * Submit an answer for the current question.
     * @param {number} answerIndex - The index of the selected answer.
     * @return {boolean} True if the answer is correct, false otherwise.
     */
    async submitAnswer(answerIndex) {
        // Check if the answer is correct
        let isCorrect;
        if(this.isLocal)
            isCorrect = this.questions[this.currentQuestionIndex-1].correctIndex === answerIndex;
        else {
            isCorrect = await this.submitAnswerWeb(answerIndex);
        }
        if (isCorrect) {
            if(!this.hasQuizWrong) {
                this.questionsFirstTry++;
            }
            this.hasQuizWrong = false;
        } else {
            this.hasQuizWrong = true;
            this.questionsWrong++;
        }
        return isCorrect;
    }

    /**
     * Load questions from the JSON file based on their category.
     * @param {string} category - The category of questions to load.
     */
    async loadQuestions(category) {

        if(this.categories[category] && !this.categories[category].local) {
            // If the category is not local, load from web server
            await this.loadQuestionsFromWeb(category);
            return;
        }

        try {
            const response = await fetch(questionFile);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            this.questions = (data[category] || []).map(q => {
                const answers = [...q.l]; // Copy the answers array
                this.shuffleArray(answers);
                const correctIndex = answers.indexOf(q.l[0]); // Find new index of correct answer
                return {
                    question: q.a,
                    answers: answers,
                    correctIndex: correctIndex
                };
            });
            this.category = category;
            this.isLocal = true;
            this.shuffleArray(this.questions);
            this.currentQuestionIndex = 0;
            this.questionsFirstTry = 0;
            this.totalQuestions = this.questions.length;
            this.questionsWrong = 0;
            console.log(`Loaded ${this.totalQuestions} questions for category: ${category}`);
        } catch (error) {
            console.error('Failed to load questions:', error);
        }
    }

    /**
     * Load questions from a web server. Server is in rest.js.
     */
    async loadQuestionsFromWeb(category) {
        try {
            const questions = await getQuestions();
            this.questions = questions.map(q => {
                return {
                    id: q.id,
                    question: q.text,
                    answers: q.options
                };
            });
            this.category = category;
            this.isLocal = false;
            this.shuffleArray(this.questions);
            this.currentQuestionIndex = 0;
            this.questionsFirstTry = 0;
            this.totalQuestions = this.questions.length;
            this.questionsWrong = 0;
            console.log(`Loaded ${this.totalQuestions} questions from web`);
        } catch (error) {
            console.error('Failed to load questions from web:', error);
        }
    }

    /**
     * Load categories from the JSON file.
     */
    async loadCategories() {
        try {
            const response = await fetch(categoriesFile);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            // Save as a dict: { name: { label, description, local } }
            this.categories = {};
            for (const [name, obj] of Object.entries(data)) {
                this.categories[name] = {
                    label: obj["display-name"],
                    description: obj["description"],
                    local: obj["isLocal"] ?? true,
                    vexflow: obj["vexflow"] ?? false
                };
            }
            console.log(`Loaded ${Object.keys(this.categories).length} categories`);
        } catch (error) {
            console.error('Failed to load categories:', error);
        }
    }

    setTotalQuestions(questionCount) {
        if (questionCount > 0 && questionCount <= this.questions.length) {
            this.totalQuestions = questionCount;
        } else {
            console.warn(`Invalid question count: ${questionCount}. Setting to max available: ${this.questions.length}`);
            this.totalQuestions = this.questions.length;
        }
    }
}