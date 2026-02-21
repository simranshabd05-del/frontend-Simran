let currentUser = {
    xp: 450,
    level: 4
};

let weeklyGoal = 7;

function init(){
    loadWeeklyData();
    updateXPBar();
    setupBadges();
}

function updateXPBar(){
    let xpNeeded = currentUser.level * 100;

    document.getElementById("level").innerText = currentUser.level;
    document.getElementById("xpText").innerText = currentUser.xp;
    document.getElementById("xpNeeded").innerText = xpNeeded;

    let percentage = (currentUser.xp / xpNeeded) * 100;
    document.getElementById("xpFill").style.width = percentage + "%";

    if(currentUser.xp >= xpNeeded){
        levelUp();
    }
}

function levelUp(){
    currentUser.level++;
    currentUser.xp = 0;

    confetti({
        particleCount: 150,
        spread: 80
    });

    updateXPBar();
}

/* ---------------------- */
/* WEEKLY CONSISTENCY     */
/* ---------------------- */

function loadWeeklyData(){
    let weeklyDays = localStorage.getItem("weeklyDays");
    if(!weeklyDays) {
        weeklyDays = 0;
        localStorage.setItem("weeklyDays", 0);
    }

    document.getElementById("weeklyProgress").innerText =
        `(${weeklyDays} / 7 days)`;

    if(weeklyDays >= weeklyGoal){
        unlockWeeklyBadge();
    }
}

function addDailyActivity(){
    let weeklyDays = parseInt(localStorage.getItem("weeklyDays")) || 0;

    if(weeklyDays < weeklyGoal){
        weeklyDays++;
        localStorage.setItem("weeklyDays", weeklyDays);
        loadWeeklyData();
    }
}

function unlockWeeklyBadge(){
    let badge = document.getElementById("weeklyBadge");

    if(badge.classList.contains("locked")){
        badge.classList.remove("locked");
        badge.classList.add("unlocked","unlocking");

        currentUser.xp += parseInt(badge.dataset.xp);

        confetti({
            particleCount: 200,
            spread: 100
        });

        updateXPBar();

        setTimeout(()=>{
            badge.classList.remove("unlocking");
        },500);
    }
}
// Animate Overview Progress Bars

function animateOverview() {
  document.getElementById("weeklyBar").style.width = "80%";
  document.getElementById("extremeBar").style.width = "60%";
  document.getElementById("totalBar").style.width = "95%";
}

window.addEventListener("load", animateOverview);
/* ---------------------- */
/* OTHER BADGES           */
/* ---------------------- */

function setupBadges(){
    document.querySelectorAll(".badge").forEach(badge => {

        badge.addEventListener("click", () => {

            if(badge.id === "weeklyBadge"){
                addDailyActivity();
                return;
            }

            if(badge.classList.contains("locked")){
                badge.classList.remove("locked");
                badge.classList.add("unlocking","unlocked");

                let reward = parseInt(badge.dataset.xp);
                currentUser.xp += reward;

                confetti({
                    particleCount: 120,
                    spread: 70
                });

                updateXPBar();

                setTimeout(()=>{
                    badge.classList.remove("unlocking");
                },500);
            }
        });
    });
}

init();