"use client"
import React, { useEffect } from 'react';

const LanguageButton = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = `
      function googleTranslateElementInit() {
        new google.translate.TranslateElement(
          {pageLanguage: 'en,es', includedLanguages: 'es,en', layout: google.translate.TranslateElement.InlineLayout}, 
          'google_translate_element');
          const gadgets = document.getElementsByClassName('goog-te-gadget');
        for (let i = 0; i < gadgets.length; i++) {
          // Loop through child nodes of each element
          const children = gadgets[i].childNodes;
          for (let j = 0; j < children.length; j++) {
            // Check if the child node is a text node
            if (children[j].nodeType === Node.TEXT_NODE) {
              // Remove the text content from the text node
              children[j].nodeValue = '';
            }
          }
        }
      }
    `;

    const script2 = document.createElement('script');
    script2.type = 'text/javascript';
    script2.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';

    document.body.appendChild(script);
    document.body.appendChild(script2);

    return () => {
      document.body.removeChild(script);
      document.body.removeChild(script2);
    };
  }, []);

  return (
    <div id="google_translate_element"></div>
  );
};

export default LanguageButton;
