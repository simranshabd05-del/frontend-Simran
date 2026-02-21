const content = {
    Easy: [
        { q: "Which keyword is for <code>block-scoped</code> constants?", options: ["var", "let", "const"], correct: 2, hint: "It cannot be reassigned after initialization.", expl: "Correct! 'const' ensures the reference remains immutable." }
    ],
    Medium: [
        { q: "Result of <code>typeof NaN</code>?", options: ["'number'", "'undefined'", "'NaN'"], correct: 0, hint: "It's a special numeric value.", expl: "Success. Despite being 'Not-a-Number', its type is 'number'." }
    ],
    Hard: [
        { q: "Which queue handles <code>Promise</code> callbacks?", options: ["Macrotask", "Microtask", "Render Queue"], correct: 1, hint: "These have higher priority than setTimeout.", expl: "Perfect. Promises are processed in the Microtask Queue." }
    ]
};

let stats = { level: 'Easy', streak: 0, mastery: 0 };

function initNode() {
    // State Reset
    document.querySelectorAll('.feedback-panel, .hint-panel, #next-btn').forEach(el => el.classList.add('hidden'));
    document.getElementById('submit-btn').classList.remove('hidden');
    document.getElementById('main-card').scrollIntoView({ behavior: 'smooth', block: 'center' });

    const q = content[stats.level][0];
    document.getElementById('question-text').innerHTML = q.q;
    document.getElementById('difficulty-level').innerText = stats.level;
    
    const grid = document.getElementById('options-grid');
    grid.innerHTML = '';
    q.options.forEach((opt, i) => {
        const b = document.createElement('button');
        b.className = 'option-btn';
        b.innerHTML = opt;
        b.onclick = () => {
            document.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected'));
            b.classList.add('selected');
        };
        grid.appendChild(b);
    });
    window.activeNode = q;
}

document.getElementById('submit-btn').onclick = () => {
    const sel = document.querySelector('.option-btn.selected');
    if (!sel) return;

    const isCorrect = sel.innerHTML === window.activeNode.options[window.activeNode.correct];
    const feedback = document.getElementById('feedback-area');
    
    feedback.classList.remove('hidden');
    document.getElementById('submit-btn').classList.add('hidden');
    document.getElementById('next-btn').classList.remove('hidden');

    if (isCorrect) {
        feedback.className = "feedback-panel feedback-success";
        document.getElementById('feedback-message').innerText = "✓ NODE SYNC COMPLETE";
        document.getElementById('explanation-text').innerText = window.activeNode.expl;
        
        stats.streak++;
        stats.mastery = Math.min(100, stats.mastery + 15);
        if (stats.mastery >= 100) triggerReward("ARCHITECT");

        // Adaptive: Level Up [cite: 34]
        if (stats.streak >= 2 && stats.level === 'Easy') stats.level = 'Medium';
        else if (stats.streak >= 4 && stats.level === 'Medium') stats.level = 'Hard';
    } else {
        feedback.className = "feedback-panel feedback-error";
        document.getElementById('feedback-message').innerText = "× LOGIC FRAGMENTATION";
        document.getElementById('explanation-text').innerText = "Review the hint and attempt a lower-tier node.";
        
        stats.streak = 0;
        stats.mastery = Math.max(0, stats.mastery - 10);
        // Adaptive: Level Down [cite: 35]
        stats.level = stats.level === 'Hard' ? 'Medium' : 'Easy';
    }
    updateUI();
};

function triggerReward(rank) {
    const overlay = document.getElementById('reward-overlay');
    document.getElementById('reward-desc').innerText = `NEW CLEARANCE: ${rank}`;
    overlay.classList.remove('hidden');
    setTimeout(() => overlay.classList.add('hidden'), 2500);
}

function updateUI() {
    document.getElementById('streak-count').innerText = stats.streak;
    document.getElementById('progress-fill').style.width = stats.mastery + "%";
    document.getElementById('progress-text').innerText = stats.mastery + "%";
    document.getElementById('rank-name').innerText = stats.mastery > 60 ? "SENIOR" : stats.mastery > 30 ? "CODER" : "NOVICE";
}

document.getElementById('hint-btn').onclick = () => {
    document.getElementById('hint-text').innerText = window.activeNode.hint;
    document.getElementById('hint-box').classList.remove('hidden');
};

document.getElementById('next-btn').onclick = initNode;
document.getElementById('skip-btn').onclick = initNode;

// Start First Node
initNode();