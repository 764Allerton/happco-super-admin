import { Breadcrumb } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function BreadCrumbComponent({ mainTitle, title, subtitle, subtitle2 }) {
    const navigate = useNavigate();
    const cssStyle = 'text-lg font-bold bg-transparent border-none cursor-pointer smMin:text-sm'

    const handleClick = () => {
        navigate(-1);
    };

    const items = [
        {
            title: mainTitle && (
                <button className={`mb-0 ${cssStyle}`} onClick={handleClick}>
                    <p className={"text-[1rem] smMin:text-sm"}>{mainTitle} </p>
                </button>
            ),
        },
        {
            title: subtitle && (
                <button className={`mb-0 ${cssStyle}  `} onClick={handleClick}>
                    <p className={"text-[1rem]  smMin:text-sm"}>{subtitle}</p>
                </button>
            ),
        },
        {
            title: subtitle2 && (
                <button className={`mb-0 ${cssStyle} `} onClick={handleClick}>
                    <p className={"text-[1rem]   smMin:text-sm"}>{subtitle2}</p>
                </button>
            ),
        },
        {
            title: (
                <button className="mb-0 cssStyle">
                    <p className={`text-[1rem] font-700 textStyle !text-defaultDarkColor smMin:text-sm`}>{title}</p>
                </button>
            ),
        },
    ];

    return (
        <Breadcrumb items={items} className="" />
    )
}
