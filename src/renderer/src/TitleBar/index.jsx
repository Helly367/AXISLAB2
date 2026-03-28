import React from 'react'
import "../assets/titlebar.css";
import { Remove, Close, CropSquare } from "@mui/icons-material"
import axis from "../../../../resources/axis.png"

const TitleBar = () => {
    return (

        <div className="titlebar bg-white ">
            <img src={axis} className='w-10 ml-3' />
            <div className="window-controls flex items-center gap-4 text-primary font-bold ">

                <button onClick={() => window.api.minimize()}>
                    <Remove fontSize='small' />
                </button>

                <button onClick={() => window.api.maximize()}> <CropSquare fontSize='small' /> </button>
                <button onClick={() => window.api.close()}><Close fontSize='small' /></button>
            </div>
        </div>

    )
}

export default TitleBar
