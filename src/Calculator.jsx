// File: src/Calculator.jsx
import { useState, useEffect } from "react";

export default function Calculator() {
  const [input, setInput] = useState("0");
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("calc-history");
    return saved ? JSON.parse(saved) : [];
  });
  const [memory, setMemory] = useState(() => {
    const saved = localStorage.getItem("calc-memory");
    return saved ? parseFloat(saved) : 0;
  });
  const [overwrite, setOverwrite] = useState(false);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    localStorage.setItem("calc-history", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem("calc-memory", memory.toString());
  }, [memory]);

  useEffect(() => {
    try {
      if (input && !/[+\-*/]$/.test(input)) {
        const result = eval(input);
        setPreview("= " + result);
      } else {
        setPreview("");
      }
    } catch {
      setPreview("");
    }
  }, [input]);

  const handleClick = (value) => {
    if (!isNaN(value) || value === ".") {
      if (overwrite) {
        setInput(value === "." ? "0." : value);
        setOverwrite(false);
      } else {
        if (value === "." && input.includes(".")) return;
        setInput(input === "0" && value !== "." ? value : input + value);
      }
      return;
    }

    switch (value) {
      case "C":
        setInput("0");
        break;
      case "DEL":
        setInput(input.length === 1 ? "0" : input.slice(0, -1));
        break;
      case "±":
        setInput((parseFloat(input) * -1).toString());
        break;
      case "%":
        setInput((parseFloat(input) / 100).toString());
        break;
      case "+":
      case "-":
      case "*":
      case "/":
        if (/[+\-*/]$/.test(input)) {
          setInput(input.slice(0, -1) + value);
        } else {
          setInput(input + value);
        }
        setOverwrite(false);
        break;
      case "=":
        try {
          const result = eval(input).toString();
          setHistory([...history, `${input} = ${result}`]);
          setInput(result);
          setOverwrite(true);
        } catch {
          setInput("Error");
          setOverwrite(true);
        }
        break;
      case "MC":
        setMemory(0);
        break;
      case "MR":
        setInput(overwrite || input === "0" ? memory.toString() : input + memory.toString());
        setOverwrite(false);
        break;
      case "M+":
        try {
          const result = eval(input);
          setMemory((prev) => prev + result);
          setOverwrite(true);
        } catch {
          setInput("Error");
        }
        break;
      case "M-":
        try {
          const result = eval(input);
          setMemory((prev) => prev - result);
          setOverwrite(true);
        } catch {
          setInput("Error");
        }
        break;
      default:
        break;
    }
  };

  const buttons = [
    "MC", "MR", "M+", "M-",
    "C", "DEL", "%", "/",
    "7", "8", "9", "*",
    "4", "5", "6", "-",
    "1", "2", "3", "+",
    "±", "0", ".", "="
  ];

  const isSignButton = (btn) => ["MC", "MR", "M+", "M-", "C", "DEL", "%", "/", "*", "-", "+", "±", "="].includes(btn);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="bg-black text-white text-right text-3xl px-4 pt-2 pb-0 rounded-t-xl min-h-[48px] shadow-inner truncate">
          {input}
        </div>
        <div className="bg-black text-green-400 text-right text-md px-4 pb-2 pt-0 rounded-b-xl min-h-[24px] truncate">
          {preview}
        </div>
        <div className="text-gray-400 text-xs mb-2 h-16 overflow-auto">
          {history.slice(-3).map((entry, i) => (
            <div key={i} className="text-right">{entry}</div>
          ))}
        </div>
        <div className="text-right text-sm text-green-400 mb-2">
          Memory: {memory}
        </div>
        <div className="grid grid-cols-4 gap-3">
          {buttons.map((btn, idx) => (
            <button
              key={idx}
              onClick={() => handleClick(btn)}
              className={`${
                isSignButton(btn)
                  ? 'bg-[#ffbf00] text-black hover:bg-yellow-400 shadow-md hover:shadow-lg'
                  : 'bg-gray-700 text-white hover:bg-gray-600 shadow-md hover:shadow-lg'
              } text-xl py-3 rounded-lg transition duration-200`}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
