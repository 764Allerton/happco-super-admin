import React, { useState } from 'react'
import { Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { languageData } from 'Constants/StaticData';
import { IoLanguage } from 'react-icons/io5';

const LanguageSelect = () => {
    const { i18n } = useTranslation();
    const defaultLanguage = i18n.language == 'en-GB' || i18n.language == 'en-US' || i18n.language == 'en-IN' ? 'en' : i18n.language
    const [language] = useState(defaultLanguage);

    const handleLanguageSelector = (value) => {
        i18n.changeLanguage(value);
        window.location.reload();
    }

    return (
        <Select
            suffixIcon={<IoLanguage  size={20}/>}
            className='w-[10rem] h-[3rem]'
            value={language}
            options={languageData}
            onChange={(value) => { handleLanguageSelector(value) }}
        />
    )
}

export default LanguageSelect