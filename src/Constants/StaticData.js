import { Image } from "antd";
import { MediaEndpoints } from "Utils/MediaEndpoints";


export const languageData = [
    {
        "label": <div className="flex items-center gap-2">
            <div className="flex items-center">
                <Image src={MediaEndpoints.flags.engFlag} preview={false} className="imgStyle" height={20} style={{ borderRadius: 5 }} />
            </div>
            <p className={`m-0 p-0`} style={{ fontSize: 14 }} >English</p>
        </div>,
        "value": "en"
    },
    {
        "label": <div className="flex items-center gap-2">
            <div className="flex items-center">
                <Image src={MediaEndpoints.flags.indiaFlag} preview={false} className="imgStyle" height={20} style={{ borderRadius: 5 }} />
            </div>
            <p className={`m-0 p-0`} style={{ fontSize: 14 }} >Hindi</p>
        </div>,
        "value": "hi"
    }
]
