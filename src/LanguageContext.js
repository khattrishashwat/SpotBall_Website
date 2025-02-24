// import React, { createContext, useState, useEffect } from "react";
// import i18n from "./i18n"; // Import i18n here to handle language switching

// export const LanguageContext = createContext();

// export const LanguageProvider = ({ children }) => {
//   const [selectedLanguage, setSelectedLanguage] = useState(
//     localStorage.getItem("selectedLanguage") || "en"
//   );

//   useEffect(() => {
//     // If the selected language changes, update i18n and localStorage
//     if (selectedLanguage !== i18n.language) {
//       i18n.changeLanguage(selectedLanguage);
//       // console.log("selectedLanguage", selectedLanguage);
//     }
//     localStorage.setItem("selectedLanguage", selectedLanguage);
//   }, [selectedLanguage]);

//   return (
//     <LanguageContext.Provider value={{ selectedLanguage, setSelectedLanguage }}>
//       {children}
//     </LanguageContext.Provider>
//   );
// };
