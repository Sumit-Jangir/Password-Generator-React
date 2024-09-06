import copy from './assets/copy.svg';
import React, { useState, useEffect } from "react";
import "./App.css"; // Your styles can go here

const symbols = `!@#$%^&*](}[){;:'"/?+~<.>,|\\-`;

const App = () => {
  const [passwordLength, setPasswordLength] = useState(10);
  const [password, setPassword] = useState("");
  const [checkCount, setCheckCount] = useState(0);
  const [strength, setStrength] = useState("#ccc");
  const [copied, setCopied] = useState(false);

  const [includeUppercase, setIncludeUppercase] = useState(false);
  const [includeLowercase, setIncludeLowercase] = useState(false);
  const [includeNumbers, setIncludeNumbers] = useState(false);
  const [includeSymbols, setIncludeSymbols] = useState(false);

  useEffect(() => {
    calcStrength();
  }, [passwordLength, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  useEffect(() => {
    handleCheckboxChange();
  }, [includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  const handleSliderChange = (e) => {
    setPasswordLength(e.target.value);
  };

  const handleCheckboxChange = () => {
    let count = 0;
    if (includeUppercase) count++;
    if (includeLowercase) count++;
    if (includeNumbers) count++;
    if (includeSymbols) count++;
    setCheckCount(count); // Set checkCount based on selected options
  };

  const getRndInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
  };

  const generateRandomNumber = () => getRndInteger(0, 9);
  const generateLowerCase = () => String.fromCharCode(getRndInteger(97, 123));
  const generateUpperCase = () => String.fromCharCode(getRndInteger(65, 91));
  const generateSymbol = () => symbols.charAt(getRndInteger(0, symbols.length));

  const calcStrength = () => {
    let hasUpper = includeUppercase;
    let hasLower = includeLowercase;
    let hasNum = includeNumbers;
    let hasSym = includeSymbols;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setStrength("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setStrength("#ff0");
    } else {
      setStrength("#f00");
    }
  };

  const shufflePassword = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join("");
  };

  const generatePassword = () => {
    if (checkCount === 0) return; // Check if at least one checkbox is selected

    let generatedPassword = "";
    let funcArr = [];

    if (includeUppercase) funcArr.push(generateUpperCase);
    if (includeLowercase) funcArr.push(generateLowerCase);
    if (includeNumbers) funcArr.push(generateRandomNumber);
    if (includeSymbols) funcArr.push(generateSymbol);

    // Generate characters from selected categories
    for (let i = 0; i < funcArr.length; i++) {
      generatedPassword += funcArr[i]();
    }

    // Fill the remaining length of the password
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
      const randIndex = getRndInteger(0, funcArr.length);
      generatedPassword += funcArr[randIndex]();
    }

    setPassword(shufflePassword([...generatedPassword]));
  };

  const copyPassword = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      setCopied(false);
    }
  };

  return (
    <div className="container">
      <h1>Password Generator</h1>

      <div className="display-container">
        <input
          type="text"
          readOnly
          placeholder="Password"
          value={password}
          className="display"
        />
        <button className="copyBtn" onClick={copyPassword}>
          <span className={`tooltip ${copied ? "active" : ""}`}>
            {copied ? "Copied" : ""}
          </span>
          <img src={copy} alt="copy" width="23" height="23" />
        </button>
      </div>

      <div className="input-container">
        <div className="length-container">
          <p>Password Length</p>
          <p>{passwordLength}</p>
        </div>

        <input
          type="range"
          min="1"
          max="20"
          value={passwordLength}
          onChange={handleSliderChange}
          className="slider"
        />

        <div className="check">
          <input
            type="checkbox"
            id="uppercase"
            checked={includeUppercase}
            onChange={(e) => {
              setIncludeUppercase(e.target.checked);
            }}
          />
          <label htmlFor="uppercase">Includes Uppercase Letters</label>
        </div>

        <div className="check">
          <input
            type="checkbox"
            id="lowercase"
            checked={includeLowercase}
            onChange={(e) => {
              setIncludeLowercase(e.target.checked);
            }}
          />
          <label htmlFor="lowercase">Includes Lowercase Letters</label>
        </div>

        <div className="check">
          <input
            type="checkbox"
            id="numbers"
            checked={includeNumbers}
            onChange={(e) => {
              setIncludeNumbers(e.target.checked);
            }}
          />
          <label htmlFor="numbers">Includes Numbers</label>
        </div>

        <div className="check">
          <input
            type="checkbox"
            id="symbols"
            checked={includeSymbols}
            onChange={(e) => {
              setIncludeSymbols(e.target.checked);
            }}
          />
          <label htmlFor="symbols">Includes Symbols</label>
        </div>

        <div className="strength-container">
          <p>Strength</p>
          <div className="indicator" style={{ backgroundColor: strength }}></div>
        </div>

        <button className="generateButton" onClick={generatePassword}>
          Generate Password
        </button>
      </div>
    </div>
  );
};

export default App;
