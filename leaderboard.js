class Leaderboard {
    constructor() {
        this.key = 'puzzleMaster_leaderboard';
        this.leaderboard = this.loadLeaderboard();
    }

    loadLeaderboard() {
        try {
            const stored = localStorage.getItem(this.key);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            return [];
        }
    }

    saveLeaderboard() {
        try {
            localStorage.setItem(this.key, JSON.stringify(this.leaderboard));
        } catch (e) {
            console.warn('Could not save leaderboard');
        }
    }

    addScore(name, score, level) {
        const entry = {
            name: name || 'لاعب',
            score: score,
            level: level,
            date: new Date().toLocaleDateString('ar-SA'),
            timestamp: Date.now()
        };

        this.leaderboard.push(entry);
        this.leaderboard.sort((a, b) => b.score - a.score);
        this.leaderboard = this.leaderboard.slice(0, 10); // أفضل 10 فقط
        this.saveLeaderboard();
    }

    getTopScores(limit = 10) {
        return this.leaderboard.slice(0, limit);
    }

    displayLeaderboard() {
        const listElement = document.getElementById('leaderboard-list');
        const scores = this.getTopScores(10);
        
        if (scores.length === 0) {
            listElement.innerHTML = '<div class="leaderboard-item">لا توجد نتائج حتى الآن!</div>';
            return;
        }

        listElement.innerHTML = scores.map((score, index) => `
            <div class="leaderboard-item">
                <span class="rank">${index + 1}</span>
                <span class="name">${score.name}</span>
                <span class="score">${score.score} نقطة</span>
                <span class="level">المستوى ${score.level}</span>
                <span class="date">${score.date}</span>
            </div>
        `).join('');
    }
}

const leaderboard = new Leaderboard();
