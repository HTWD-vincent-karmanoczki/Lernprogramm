"use strict";
/**
 * View class for the quiz
 * Responsible for rendering questions and answers dynamically
 */
export class View {
    constructor() {}

    showSection(sectionId) {
        // Hide all sections with class "view"
        document.querySelectorAll('.view').forEach(section => {
            section.classList.add('hidden');
        });
        // Show the requested section
        const section = document.getElementById(sectionId);
        if (section) section.classList.remove('hidden');
    }

    showQuestion(question, options, vexflow, onAnswerClick) {

        if(vexflow) {

            // Show VexFlow notes
            this.drawNotes(question);
            const notesArray = question.trim().split(/\s+/);
            this.playNotes(notesArray, "4n");

        } else {
            // Hide VexFlow container
            const vexFlowContainer = document.getElementById('notes');
            vexFlowContainer.innerHTML = ''; // Clear previous notes
            vexFlowContainer.style.display = 'none';

            // Set question text
            const questionElement = document.getElementById('quiz-question');
            questionElement.textContent = question;


        }

        // Clear existing options
        const optionsContainer = document.getElementById('quiz-answer-buttons');
        optionsContainer.innerHTML = '';
        // Create new options
        options.forEach((option, index) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-answer';
            btn.textContent = option;
            btn.addEventListener('click', () => {
                if (onAnswerClick) onAnswerClick(index);
            });
            optionsContainer.appendChild(btn);
        });
    }

    updateProgress(current, total) {
        const progressBar = document.getElementById('progress-bar');
        progressBar.max = total;
        progressBar.value = current-1;
    }

    setWrong(num) {
        const wrong = document.getElementById('wrong');
        wrong.textContent = `${num} wrong answers`;
    }

    showFeedback(isCorrect, answerIndex) {
        const answerButtons = document.querySelectorAll('.quiz-answer');
        if(isCorrect)
            answerButtons.forEach(btn => {
                btn.disabled = true; // Disable all buttons
            });
        else
            answerButtons[answerIndex].disabled = true; // Disable only the selected button
        answerButtons[answerIndex].classList.add(isCorrect ? 'correct' : 'wrong');
    }

    showStatistics(show) {
        const statsSection = document.getElementById('quiz-statistics');
        if (show) {
            statsSection.classList.remove('hidden');
        } else {
            statsSection.classList.add('hidden');
        }
    }

    drawNotes(note) {
        console.log('Drawing notes:', note);
        const vexFlowContainer = document.getElementById('notes');
        vexFlowContainer.innerHTML = ''; // Clear previous notes
        vexFlowContainer.style.display = 'block'; // Show the container

        // Create a new VexFlow renderer
        const VF = Vex.Flow;
        const renderer = new VF.Renderer(vexFlowContainer, VF.Renderer.Backends.SVG);
        renderer.resize(500, 200);
        const context = renderer.getContext();

        // Create a stave
        const stave = new VF.Stave(10, 40, 400);
        stave.addClef('treble').addTimeSignature('4/4');
        stave.setContext(context).draw();

        const keys = note.split(/\s+/);

        // Create notes
        const staveNote = new VF.StaveNote({ clef: "treble", keys: keys, duration: 'q' });

        // Add # and b changing
        keys.forEach((k, i) => {
            if (k.includes("#")) {
                staveNote.addModifier(new VF.Accidental("#"), i);
            } else if (k.includes("b")) {
                staveNote.addModifier(new VF.Accidental("b"), i);
            }
        });

        // Create a voice in 4/4
        const voice = new VF.Voice({ num_beats: 1, beat_value: 4 });
        voice.addTickables([staveNote]);

        // Format and draw the voice
        new VF.Formatter().joinVoices([voice]).format([voice], 400);
        voice.draw(context, stave);
    }

    playNotes(notes, duration = "4n") {
        if (!window.Tone) return;
        const toneNotes = notes.map(n => n.replace('/', ''));
        const synth = new Tone.PolySynth().toDestination();
        Tone.start();
        synth.triggerAttackRelease(toneNotes, duration);
        // Dispose synth after sound (optional, for memory)
        setTimeout(() => synth.dispose(), 1000);
    }

    showResults(questionCount, questionsWrong, questionsFirstTry,
                quizStartTime, quizEndTime, category
        ) {
            /*<p id="results-category"></p>
                <p id="results-questions"></p>
                <p id="results-first-try"></p>
                <p id="results-time"></p>
                <p id="results-mistakes"></p>*/
        const resultsCategory = document.getElementById('results-category');
        resultsCategory.textContent = `Kategorie: ${category}`;
        const resultsQuestions = document.getElementById('results-questions');
        resultsQuestions.textContent = `Anzahl der Fragen: ${questionCount}`;
        const resultsFirstTry = document.getElementById('results-first-try');
        resultsFirstTry.textContent = `Erste Versuche: ${questionsFirstTry} (${(questionsFirstTry / questionCount * 100).toFixed(2)}%)`;
        const resultsTime = document.getElementById('results-time');
        const timeTaken = (quizEndTime - quizStartTime) / 1000; // Convert to seconds
        resultsTime.textContent = `Zeit: ${timeTaken} Sekunden`;
        const resultsMistakes = document.getElementById('results-mistakes');
        resultsMistakes.textContent = `Falsche Antworten: ${questionsWrong}`;
        
    }

    addEventHandlerForRestartQuiz(onRestart) {
        const restartButton = document.getElementById('restart-quiz');
        restartButton.addEventListener('click', () => {
            if (onRestart) onRestart();
        });
    }

    /**
     * Prepare the home view with quiz buttons.
     * @param {dict} buttons - view name as key and label and  object as value.
     * */
    prepareViewHome(categories) {
        const quizContainer = document.getElementById('quiz-buttons');
        quizContainer.innerHTML = ''; // Clear existing buttons
        for(const [name, obj] of Object.entries(categories)) {
            const btn = document.createElement('button');
            btn.className = 'quiz-button';
            btn.textContent = obj.label;
            btn.setAttribute('data-view', name);
            quizContainer.appendChild(btn);
        }
    }

    prepareNavBar(categories) {
        const navLinks = document.getElementById('nav-list');
        navLinks.innerHTML = ''; // Clear existing links
        for(const [name, obj] of Object.entries(categories)) {
            const li = document.createElement('li');
            const link = document.createElement('a');
            link.href = '#';
            link.className = 'nav-link';
            link.textContent = obj.label;
            link.setAttribute('data-view', name);
            li.appendChild(link);
            navLinks.appendChild(li);
        }
        const sidebar = document.getElementById('sidebar');
        const toggleBtn = document.getElementById('sidebar-toggle');
        const app = document.getElementById('app');

        document.querySelectorAll('#sidebar a').forEach(link => {
            link.addEventListener('click', (e) => {
                sidebar.classList.remove('open');
                toggleBtn.classList.remove('open');
                app.classList.remove('sidebar-open');
            });
        });
    }

    prepareViewStart(category, questionsCount) {
        // Set category
        document.getElementById('start-category').textContent = category.label;
        document.getElementById('start-description').textContent = category.description;
        // Set question count
        const input = document.getElementById('question-count');
        input.max = questionsCount;

        if (parseInt(input.value, 10) > questionsCount) {
            input.value = questionsCount;
        }
    }

    /**
     * Add event handlers for quiz and nav buttons.
     * @param {function} onQuizSelect - Callback receiving the quiz type (e.g., "mathe")
     */
    addEventHandlersForHomeAndNav(onQuizSelect) {
        // Quiz buttons
        document.querySelectorAll('.quiz-button').forEach(btn => {
            btn.addEventListener('click', () => {
                const quizType = btn.getAttribute('data-view');
                if (onQuizSelect) onQuizSelect(quizType);
            });
        });

        // Nav bar links
        document.querySelectorAll('#sidebar a[data-view]').forEach(link => {
            link.addEventListener('click', () => {
                const quizType = link.getAttribute('data-view');
                if (onQuizSelect) onQuizSelect(quizType);
            });
        });
    }

    addEventHandlerForCountInput() {
        // Question count input (for clamping))
        const questionCountInput = document.getElementById('question-count');
        questionCountInput.addEventListener('input', () => {
            const max = parseInt(questionCountInput.max, 10);
            const min = parseInt(questionCountInput.min, 10);
            let value = parseInt(questionCountInput.value, 10);

            if (value > max) questionCountInput.value = max;
            if (value < min) questionCountInput.value = min;
        });
    }

    addEventHandlerForQuizStart(onQuizStart) {
        const startButton = document.getElementById('start-quiz');
        startButton.addEventListener('click', () => {
            const questionCount = parseInt(document.getElementById('question-count').value, 10);
            if (onQuizStart) onQuizStart(questionCount);
        });
    }

    setupKatex() {

        const obsConf = { characterData: true, childList: true, subtree: true };
        const katexOptions = {
            throwOnError: false,
            displayMode: true,
            delimiters: [
                { left: '$$', right: '$$', display: true },
                { left: '$', right: '$', display: true }
            ]
        };
        const observer = new MutationObserver(() => {
            observer.disconnect(); // Disconnect to avoid infinite loop
            const question = document.getElementById('quiz-question');
            renderMathInElement(question, katexOptions);
            const answerButtons = document.getElementById('quiz-answer-buttons');
            answerButtons.querySelectorAll('.quiz-answer').forEach(el => {
                renderMathInElement(el, katexOptions);
            });
            observer.observe(document.body, obsConf); // Reconnect observer
        });
        observer.observe(document.body, obsConf);
    }


}