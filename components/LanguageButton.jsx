import React, { useEffect } from 'react';

const LanguageButton = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = `
      function googleTranslateElementInit() {
        new google.translate.TranslateElement(
          {pageLanguage: 'en', includedLanguages: 'es,en', layout: google.translate.TranslateElement.InlineLayout}, 
          'google_translate_element');
          // document.querySelector('.goog-te-banner-frame').style.display = 'none';
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
