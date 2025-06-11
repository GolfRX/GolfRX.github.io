import { useState, useEffect, useRef } from "react";

interface TrainingBlock {
  name: string;
  tip: string;
  time: number;
  emoji?: string;
  prepTime: number;
}

export default function App() {
  const [duration, setDuration] = useState("");
  const [atHome, setAtHome] = useState(false);
  const [plan, setPlan] = useState<TrainingBlock[]>([]);
  const [currentBlockIndex, setCurrentBlockIndex] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(300);
  const startTimeRef = useRef<number | null>(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [confirmStart, setConfirmStart] = useState(false);
  const [showPrep, setShowPrep] = useState(true);

  useEffect(() => {
    if (secondsLeft === 0 && currentBlockIndex !== null) {
      setPopupVisible(true);
      setTimeout(() => {
        setPopupVisible(false);
        setShowPrep(true);
        setCurrentBlockIndex((prev) =>
          prev !== null && prev + 1 < plan.length ? prev + 1 : null
        );
      }, 3000);
    }
  }, [secondsLeft]);

  useEffect(() => {
    if (currentBlockIndex !== null && plan[currentBlockIndex] && !showPrep) {
      const durationInSec = plan[currentBlockIndex].time * 60;
      startTimeRef.current = Date.now();

      const interval = setInterval(() => {
        if (startTimeRef.current !== null) {
          const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
          const remaining = durationInSec - elapsed;
          setSecondsLeft(remaining > 0 ? remaining : 0);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [currentBlockIndex, showPrep]);

  const formatTime = (sec: number): string => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const shuffleBlocks = (blocks: TrainingBlock[]) => {
    const pattern = ["Putten", "Chipping", "Long Game", "Bunker", "Fitness & Mobilität", "Mentaltraining"];
    const ordered = pattern.map(name => blocks.find(b => b.name.startsWith(name))).filter(Boolean) as TrainingBlock[];
    return ordered.sort(() => Math.random() - 0.5);
  };

  const generatePlan = () => {
    const totalTime = parseInt(duration);
    if (isNaN(totalTime) || totalTime < 10) {
      setPlan([{ name: "Hinweis", tip: "Bitte mindestens 10 Minuten eingeben.", time: 0, emoji: "⚠️", prepTime: 0 }]);
      return;
    }

    const blocks: TrainingBlock[] = atHome ? [
      { name: "Kraft (Home)", tip: "3x: 20 Kniebeugen, 15 Liegestütze (ggf. auf Knien), 30 Sek Plank. Ziel: saubere Ausführung, kurze Pausen.", time: 0.33, emoji: "💪", prepTime: 0.5 },
      { name: "Koordination", tip: "Stell dich auf ein Bein, schließe die Augen und balanciere 30 Sekunden. Dann: 10x auf Bein wechseln, dazu Ball prellen o.ä.", time: 0.33, emoji: "🦶", prepTime: 0.5 },
      { name: "Mentaltraining (Home)", tip: "Lege dich auf den Rücken, entspanne dich. 5 Minuten Visualisieren von erfolgreichen Golfschlägen. Fokus: Atmung + Details.", time: 0.34, emoji: "🧘", prepTime: 0.5 }
    ] : [
      { name: "Putten", tip: "Lege drei Tees in 3 Meter Entfernung auf eine gerade Linie. Putte 5 Bälle mit Fokus auf Tempo. Danach: Zieltraining mit 3 Bällen auf ein Tee, max. 2 Putts.", time: 0.25, emoji: "🏌️‍♂️", prepTime: 1 },
      { name: "Chipping", tip: "Lege ein Tuch in 1m Abstand auf das Grün. Chippe aus Fairway, Semi und Rough mit PW, SW und 9er Eisen. Ziel: 10 Chips in 1m Kreis.", time: 0.2, emoji: "🟢", prepTime: 1 },
      { name: "Bunker", tip: "Platziere 5 Bälle in unterschiedlichen Lagen (flach, tief, nass). Ziel: alle auf dem Grün landen, Fokus auf Konstanz. Nutze den gleichen Bunkerbereich für Wiederholbarkeit.", time: 0.15, emoji: "🏖️", prepTime: 1 },
      { name: "Long Game", tip: "Markiere ein Ziel mit einem Alignment-Stick. Schlage 10 Bälle mit Fokus auf Zielausrichtung. Danach: wechsel Schläger & Rhythmus. Notiere Streuung.", time: 0.2, emoji: "🎯", prepTime: 1 },
      { name: "Fitness & Mobilität", tip: "3 Runden: 30 Sek Core-Stabi (Plank), 30 Sek Ausfallschritte, 30 Sek Dehnen (Hüfte & Rücken). Ziel: Stabilität & Beweglichkeit verbessern.", time: 0.1, emoji: "💪", prepTime: 0.5 },
      { name: "Mentaltraining", tip: "Setz dich bequem hin. Augen zu. Visualisiere 5 perfekte Schwünge, mit Gefühl & Geräusch. Danach 5 tiefe Atemzüge, Fokus: locker & positiv.", time: 0.1, emoji: "🧠", prepTime: 0.5 }
    ];

    const totalPrepTime = blocks.reduce((sum, b) => sum + b.prepTime, 0);
    const effectiveTime = totalTime - totalPrepTime;

    const shuffled = shuffleBlocks(blocks).map(block => ({
      ...block,
      time: Math.round(effectiveTime * block.time)
    })).filter(b => b.time > 0);

    setPlan(shuffled);
    setConfirmStart(true);
  };

  const startPlan = () => {
    setConfirmStart(false);
    setCurrentBlockIndex(0);
    setShowPrep(true);
  };

  const beginExercise = () => {
    setShowPrep(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-200 to-green-100 p-4">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md animate-fadeIn text-center relative">
        <h1 className="text-2xl font-bold text-green-800 mb-4">⛳ Golf Trainingsplan</h1>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="Wie viele Minuten?"
          className="w-full p-3 border-2 border-gray-300 rounded-xl mb-2 text-center"
        />
        <div className="flex items-center mb-4">
          <input
            id="homeTraining"
            type="checkbox"
            checked={atHome}
            onChange={() => setAtHome(!atHome)}
            className="mr-2"
          />
          <label htmlFor="homeTraining" className="text-gray-700">Ich trainiere zu Hause</label>
        </div>
        <button
          onClick={generatePlan}
          className="w-full bg-green-700 hover:bg-green-600 text-white py-3 rounded-xl transition mb-4"
        >
          Plan erstellen
        </button>

        {confirmStart && (
          <div className="bg-yellow-100 p-4 rounded-xl mb-4">
            <p className="mb-2">Plan ist bereit – möchtest du starten?</p>
            <button
              onClick={startPlan}
              className="bg-green-600 text-white py-2 px-4 rounded-xl hover:bg-green-700"
            >
              Ja, los geht's!
            </button>
          </div>
        )}

        {popupVisible && currentBlockIndex !== null && plan[currentBlockIndex] && (
          <div className="absolute top-0 left-0 right-0 bg-green-700 text-white p-4 rounded-b-xl animate-slideDown z-10">
            <strong>{plan[currentBlockIndex].emoji} {plan[currentBlockIndex].name}</strong>: {plan[currentBlockIndex].tip} – {plan[currentBlockIndex].time} Minuten
          </div>
        )}

        {plan.length > 0 && currentBlockIndex !== null && (
          <div className="mt-6 text-left animate-slideUp">
            <div className="bg-green-50 border-l-4 border-green-700 p-4 mb-4 rounded-lg">
              <div className="flex justify-between items-center">
                <strong>{plan[currentBlockIndex].emoji} {plan[currentBlockIndex].name}</strong>
              </div>
              <div className="mt-2 text-sm text-gray-700">{plan[currentBlockIndex].tip}</div>
              {showPrep ? (
                <div className="mt-4">
                  <p className="text-sm text-gray-600">Vorbereitung: ca. {plan[currentBlockIndex].prepTime} Min</p>
                  <button
                    onClick={beginExercise}
                    className="mt-2 bg-green-600 text-white py-2 px-4 rounded-xl hover:bg-green-700"
                  >
                    Übung starten
                  </button>
                </div>
              ) : (
                <div className="mt-2 font-mono text-lg text-green-800">⏱️ {formatTime(secondsLeft)}</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}