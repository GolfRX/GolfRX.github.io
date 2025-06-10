function generatePlan() {
  const duration = parseInt(document.getElementById("duration").value);
  const planDiv = document.getElementById("plan");
  if (isNaN(duration) || duration < 10) {
    planDiv.innerHTML = "<p>Bitte mindestens 10 Minuten eingeben.</p>";
    planDiv.classList.remove("hidden");
    return;
  }

  let plan = [];
  let timeLeft = duration;

  const blocks = [
    { name: "Putten", tip: "3-Putt-Drills & Speedkontrolle", time: 0.3 },
    { name: "Chipping", tip: "3 Lagen, 3 Schläger-Übung", time: 0.25 },
    { name: "Long Game", tip: "Zielschläge & Richtungskontrolle", time: 0.25 },
    { name: "Mentaltraining", tip: "Visualisieren & Atmung", time: 0.2 }
  ];

  blocks.forEach(block => {
    const blockTime = Math.round(duration * block.time);
    if (blockTime > 0) {
      plan.push(`<div><strong>${blockTime} Min ${block.name}</strong><br>${block.tip}</div>`);
    }
  });

  planDiv.innerHTML = plan.join("");
  planDiv.classList.remove("hidden");
}
