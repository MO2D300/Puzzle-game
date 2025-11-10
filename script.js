class PuzzleMasterPro {
    constructor() {
        this.score = 0;
        this.level = 1;
        this.hintsLeft = 3;
        this.currentPuzzle = null;
        this.timer = 60;
        this.timerInterval = null;
        this.playerName = '';
        
        this.difficultyLevels = [
            { name: 'سهل', time: 60, points: 10 },
            { name: 'متوسط', time: 45, points: 20 },
            { name: 'صعب', time: 30, points: 30 },
            { name: 'خبير', time: 20, points: 50 },
            { name: 'أسطوري', time: 15, points: 100 }
        ];

        this.puzzles = this.generatePuzzles();
        this.init();
    }

    generatePuzzles() {
        return [
            // ألغاز رياضية (مستوى سهل)
            { 
                type: 'math', 
                difficulty: 1,
                question: '٨ × ٦ - ٥ = ?', 
                answer: '43', 
                hint: 'احسب الضرب أولاً ثم الطرح',
                options: ['43', '48', '53', '38']
            },
            { 
                type: 'math', 
                difficulty: 1,
                question: '١٥ ÷ ٣ × ٤ = ?', 
                answer: '20', 
                hint: 'القسمة أولاً ثم الضرب',
                options: ['20', '12', '18', '5']
            },

            // ألغاز متتاليات (مستوى متوسط)
            { 
                type: 'sequence', 
                difficulty: 2,
                sequence: [٢, ٤, ٦, ٨, ?], 
                answer: '10', 
                hint: 'أرقام زوجية متتالية',
                options: ['10', '12', '9', '11']
            },
            { 
                type: 'sequence', 
                difficulty: 2,
                sequence: [١, ٣, ٦, ١٠, ?], 
                answer: '15', 
                hint: 'أضف ٢، ثم ٣، ثم ٤، إلخ',
                options: ['15', '14', '16', '13']
            },

            // ألغاز منطقية (مستوى صعب)
            { 
                type: 'logic', 
                difficulty: 3,
                question: 'إذا كان عمر أحمد ضعف عمر بدر، وقبل ٥ سنوات كان عمر أحمد ٣ أضعاف عمر بدر، فكم عمر أحمد الآن؟', 
                answer: '20', 
                hint: 'استخدم معادلات رياضية',
                options: ['20', '15', '25', '30']
            },
            { 
                type: 'logic', 
                difficulty: 3,
                question: 'أي رقم لا ينتمي للمجموعة: ٢، ٣، ٦، ٧، ٨، ١٤، ١٥، ٣٠', 
                answer: '8', 
                hint: 'ابحث عن نمط الضرب والجمع',
                options: ['8', '14', '15', '30']
            },

            // ألغاز أنماط (مستوى خبير)
            { 
                type: 'pattern', 
                difficulty: 4,
                question: 'ما الرقم التالي: ١، ١، ٢، ٣، ٥، ٨، ١٣، ?', 
                answer: '21', 
                hint: 'كل رقم هو مجموع الرقمين السابقين',
                options: ['21', '18', '20', '19']
            },
            { 
                type: 'pattern', 
                difficulty: 4,
                question: 'اكمل النمط: A, C, E, G, ?', 
                answer: 'I', 
                hint: 'حروف الإنجليزية بترتيب فردي',
                options: ['I', 'H', 'J', 'K']
            },

            // ألغاز كلمات (مستوى أسطوري)
            { 
                type: 'riddle', 
                difficulty: 5,
                question: 'أخوك وليس أخوك، ابن عمك وليس ابن عمك، فمن يكون؟', 
                answer: 'ابن خالك', 
                hint: 'فكر في أقاربك من جهة الأم',
                options: ['ابن خالك', 'ابن عمتك', 'أختك', 'جدك']
            },
            { 
                type: 'riddle', 
                difficulty: 5,
                question: 'ما هو الشيء الذي كلما أخذت منه كبر؟', 
                answer: 'الحفرة', 
                hint: 'شيء مادي عندما تزيل منه يزيد حجمه',
                options: ['الحفرة', 'العمر', 'المعرفة', 'الثقب']
            }
        ];
    }

    init() {
        this.setupEventListeners();
        this.showScreen('start-screen');
    }

    setupEventListeners() {
        document.getElementById('start-btn').addEventListener('click', () => this.startGame());
        document.getElementById('leaderboard-btn').addEventListener('click', () => this.showLeaderboard());
        document.getElementById('back-btn').addEventListener('click', () => this.showScreen('start-screen'));
        document.getElementById('hint-btn').addEventListener('click', () => this.useHint());
        document.getElementById('skip-btn').addEventListener('click', () => this.skipPuzzle());
        document.getElementById('submit-btn').addEventListener('click', () => this.checkAnswer());
        
        document.getElementById('player-name').addEventListener('input', (e) => {
            this.playerName = e.target.value;
        });
    }

    startGame() {
        this.score = 0;
        this.level = 1;
        this.hintsLeft = 3;
        this.showScreen('game-screen');
        this.startTimer();
        this.nextPuzzle();
        this.updateUI();
        soundManager.play('click');
    }

    startTimer() {
        this.clearTimer();
        const difficulty = this.difficultyLevels[Math.min(this.level - 1, 4)];
        this.timer = difficulty.time;
        
        this.timerInterval = setInterval(() => {
            this.timer--;
            document.getElementById('timer').textContent = this.timer;
            
            if (this.timer <= 10) {
                document.getElementById('timer').classList.add('timer-warning');
            }
            
            if (this.timer <= 0) {
                this.handleTimeUp();
            }
        }, 1000);
    }

    clearTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    handleTimeUp() {
        this.clearTimer();
        this.showMessage('⏰ انتهى الوقت!', 'wrong');
        soundManager.play('fail');
        setTimeout(() => this.nextPuzzle(), 2000);
    }

    nextPuzzle() {
        this.clearTimer();
        
        // اختيار لغز مناسب للمستوى الحالي
        const availablePuzzles = this.puzzles.filter(p => p.difficulty <= Math.ceil(this.level / 2));
        this.currentPuzzle = availablePuzzles[Math.floor(Math.random() * availablePuzzles.length)];
        
        this.displayPuzzle();
        this.startTimer();
        this.updateUI();
    }

    displayPuzzle() {
        const container = document.getElementById('puzzle-container');
        const difficulty = this.difficultyLevels[Math.min(this.level - 1, 4)];
        
        document.getElementById('puzzle-type').textContent = this.getPuzzleTypeName(this.currentPuzzle.type);
        document.getElementById('difficulty').textContent = difficulty.name;

        let puzzleHTML = '';
        
        switch(this.currentPuzzle.type) {
            case 'math':
            case 'logic':
            case 'pattern':
                puzzleHTML = this.createTextPuzzle();
                break;
            case 'sequence':
                puzzleHTML = this.createSequencePuzzle();
                break;
            case 'riddle':
                puzzleHTML = this.createRiddlePuzzle();
                break;
        }
        
        container.innerHTML = puzzleHTML;
    }

    createTextPuzzle() {
        return `
            <div class="puzzle ${this.currentPuzzle.type}-puzzle">
                <div class="question">${this.currentPuzzle.question}</div>
                <div class="options">
                    ${this.currentPuzzle.options.map(opt => `
                        <button class="option-btn" onclick="puzzleMaster.selectOption('${opt}')">${opt}</button>
                    `).join('')}
                </div>
                <div class="selected-answer" id="selected-answer"></div>
            </div>
        `;
    }

    createSequencePuzzle() {
        return `
            <div class="puzzle sequence-puzzle">
                <div class="question">أكمل المتتالية: ${this.currentPuzzle.sequence.join('، ')}، ؟</div>
                <div class="options">
                    ${this.currentPuzzle.options.map(opt => `
                        <button class="option-btn" onclick="puzzleMaster.selectOption('${opt}')">${opt}</button>
                    `).join('')}
                </div>
                <div class="selected-answer" id="selected-answer"></div>
            </div>
        `;
    }

    createRiddlePuzzle() {
        return `
            <div class="puzzle riddle-puzzle">
                <div class="question">${this.currentPuzzle.question}</div>
                <div class="options">
                    ${this.currentPuzzle.options.map(opt => `
                        <button class="option-btn" onclick="puzzleMaster.selectOption('${opt}')">${opt}</button>
                    `).join('')}
                </div>
                <div class="selected-answer" id="selected-answer"></div>
            </div>
        `;
    }

    selectOption(option) {
        document.getElementById('selected-answer').innerHTML = `
            <div>الإجابة المختارة: <strong>${option}</strong></div>
            <button onclick="puzzleMaster.checkAnswer('${option}')" class="btn-primary">تأكيد الإجابة</button>
        `;
        soundManager.play('click');
    }

    checkAnswer(selectedAnswer) {
        if (!selectedAnswer) {
            this.showMessage('⚠️ اختر إجابة أولاً', 'wrong');
            return;
        }

        this.clearTimer();
        
        if (selectedAnswer === this.currentPuzzle.answer) {
            this.handleCorrectAnswer();
        } else {
            this.handleWrongAnswer();
        }
    }

    handleCorrectAnswer() {
        const difficulty = this.difficultyLevels[Math.min(this.level - 1, 4)];
        const pointsEarned = difficulty.points * this.level;
        
        this.score += pointsEarned;
        this.level++;
        
        this.showMessage(`🎉 إجابة صحيحة! +${pointsEarned} نقطة`, 'correct');
        soundManager.play('correct');
        
        this.updateUI();
        this.updateProgress();
        
        setTimeout(() => {
            if (this.level <= 10) {
                this.nextPuzzle();
            } else {
                this.gameComplete();
            }
        }, 2000);
    }

    handleWrongAnswer() {
        this.score = Math.max(0, this.score - 10);
        this.showMessage('❌ إجابة خاطئة! -10 نقاط', 'wrong');
        soundManager.play('wrong');
        
        this.updateUI();
        
        setTimeout(() => {
            this.nextPuzzle();
        }, 2000);
    }

    useHint() {
        if (this.hintsLeft > 0) {
            this.hintsLeft--;
            this.showMessage(`💡 تلميح: ${this.currentPuzzle.hint}`, 'info');
            soundManager.play('click');
            this.updateUI();
        } else {
            this.showMessage('❌ لا توجد تلميحات متبقية', 'wrong');
        }
    }

    skipPuzzle() {
        if (this.score >= 5) {
            this.score -= 5;
            this.showMessage('⏭️ تم تخطي اللغز -5 نقاط', 'info');
            soundManager.play('click');
            this.nextPuzzle();
            this.updateUI();
        } else {
            this.showMessage('❌ نقاط غير كافية للتخطي', 'wrong');
        }
    }

    gameComplete() {
        this.clearTimer();
        
        leaderboard.addScore(this.playerName, this.score, this.level - 1);
        
        this.showMessage(`
            🏆 مبروك! أكملت جميع المستويات!<br>
            النقاط النهائية: <strong>${this.score}</strong><br>
            المستوى الأقصى: <strong>${this.level - 1}</strong>
        `, 'correct');
        
        soundManager.play('success');
        
        setTimeout(() => {
            this.showScreen('start-screen');
            leaderboard.displayLeaderboard();
        }, 5000);
    }

    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
        document.getElementById('hints-left').textContent = this.hintsLeft;
        
        // تحديث صعوبة المؤقت
        const difficulty = this.difficultyLevels[Math.min(this.level - 1, 4)];
        document.getElementById('timer').textContent = this.timer;
    }

    updateProgress() {
        const progress = (this.level - 1) / 10 * 100;
        document.getElementById('progress-fill').style.width = `${progress}%`;
        document.getElementById('progress-text').textContent = `${Math.round(progress)}%`;
    }

    showMessage(text, type) {
        const messageEl = document.createElement('div');
        messageEl.className = `message show ${type}`;
        messageEl.innerHTML = text;
        
        document.querySelector('.game-area').appendChild(messageEl);
        
        setTimeout(() => {
            messageEl.remove();
        }, 3000);
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
        
        if (screenId === 'leaderboard-screen') {
            leaderboard.displayLeaderboard();
        }
    }

    showLeaderboard() {
        this.showScreen('leaderboard-screen');
        soundManager.play('click');
    }

    getPuzzleTypeName(type) {
        const names = {
            'math': 'رياضي',
            'sequence': 'متتالية',
            'logic': 'منطقي',
            'pattern': 'نمط',
            'riddle': 'لغز كلمات'
        };
        return names[type] || type;
    }
}

// بدء اللعبة عندما يتم تحميل الصفحة
let puzzleMaster;
document.addEventListener('DOMContentLoaded', () => {
    puzzleMaster = new PuzzleMasterPro();
});
