import { useTranslation } from "react-i18next";
import { useState } from "react";

export default function ChangeLanguage(){
    const { t, i18n } = useTranslation();
    const [currentLanguage, setCurrentLanguage] = useState(i18n.language)

    const changeLanguage = () => {
        const lang = currentLanguage == 'en-US' ? 'es-US' : 'en-US'
        i18n.changeLanguage(lang);
        setCurrentLanguage(i18n.language)
    };

    return (
        <div>
        <button onClick={() => changeLanguage()}>{t('translate')}</button>
        </div>
    );
}