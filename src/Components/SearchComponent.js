import React from 'react';
import { DebounceInput } from 'react-debounce-input';
import { CiSearch } from "react-icons/ci";

const SearchComponent = ({ cssStyle, inlineStyle, placeholder, onChangeSearch, minLength = 2, debounceTimeout = 300, divStyle, iconStyle }) => {

    const handleSearchChange = (searchValue) => {
        onChangeSearch && onChangeSearch(searchValue);
    };

    return (
        <div className={`rounded-lg border-2 border-defaultDarkColor ${inlineStyle} min-h-[30px] smMin:w-[220px] pl-[5px] flex items-center searchField smMin:my-2`}>
            <CiSearch className={`text-defaultDarkColor  min-w-[17px] size-8 ${iconStyle}`}/>
            <DebounceInput
                className={`${cssStyle} w-100 text-lg md:text-base smMin:text-sm`}
                minLength={minLength}
                placeholder={placeholder}
                debounceTimeout={debounceTimeout}
                onChange={event => handleSearchChange(event.target.value)}
            />
        </div>
    )
}

export default SearchComponent