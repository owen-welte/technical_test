import React, { useState } from "react";

const HoroscopeButton = () => {
  const [horoscope, setHoroscope] = useState("");
  const [selectedSign, setSelectedSign] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const astroSigns = [
    "Signe astro",
    "Bélier", "Taureau", "Gémeaux", "Cancer", "Lion", "Vierge",
    "Balance", "Scorpion", "Sagittaire", "Capricorne", "Verseau", "Poissons"
  ];

  const handleFetchHoroscope = async () => {
    setIsLoading(true);
    setHoroscope("");

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/horoscope/?sign=${selectedSign}`);
      const data = await response.json();
      setHoroscope(data.horoscope || "Erreur lors de la génération.");
    } catch (error) {
      setHoroscope("Erreur de connexion au serveur.");
    }

    setIsLoading(false);
  };

  return (
    <div className="horoscope-container">
      <div className="field is-grouped">
        <div className="control">
          <div className="select">
            <select value={selectedSign} onChange={(e) => setSelectedSign(e.target.value)}>
              {astroSigns.map((sign, index) => (
                <option key={index} value={sign === "Signe astro" ? "" : sign}>
                  {sign}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="control">
          <button 
            className={`button is-primary ${isLoading ? "is-loading" : ""}`} 
            onClick={handleFetchHoroscope}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span> Chargement...
              </>
            ) : (
              "Demander un conseil"
            )}
          </button>
        </div>
      </div>

      {horoscope && <div className="horoscope-text">{horoscope}</div>}
    </div>
  );
};

export default HoroscopeButton;
