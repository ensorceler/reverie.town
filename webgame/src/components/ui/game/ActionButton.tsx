/*
button bg color #404140
*/

import { cn } from "@/lib/utils"

export const ActionButton = ({ className, children, ...props }: React.ComponentProps<any>) => {
    /*
        return (
            <button className="relative z-0 rounded-sm px-4 py-2 border-b-4  border-b-[#242525] border-2 border-[#121313] cursor-pointer active:scale-95">
                <div className="relative inset-0 z-10">
                    <p className="font-pixel2P text-sm">PLAY</p>
                </div>
            </button>
        )
            */
    return (
        <button className="relative group cursor-pointer active:translate-y-1 transition-transform duration-75">
            {/* Main button body */}
            <div className={cn(`relative bg-gradient-to-b from-gray-300 to-gray-400 border-2 border-black px-4 py-2 
                          shadow-[4px_4px_0px_0px_#000000] group-hover:shadow-[2px_2px_0px_0px_#000000]
                          group-active:shadow-[1px_1px_0px_0px_#000000] transition-all duration-75`, className)}>

                {/* Top highlight for 3D effect */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-white opacity-60"></div>

                {/* Left highlight for 3D effect */}
                <div className="absolute top-0 left-0 bottom-0 w-1 bg-white opacity-40"></div>

                {/* Bottom shadow for 3D effect */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black opacity-30"></div>

                {/* Right shadow for 3D effect */}
                <div className="absolute top-0 right-0 bottom-0 w-1 bg-black opacity-20"></div>

                {/* Button text */}
                <p className="relative z-10 font-pixel2P font-bold text-black text-xs tracking-wider">
                    {children}
                </p>
            </div>

            {/* Pixelated corner decorations */}
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-black"></div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-black"></div>
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-black"></div>
            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-black"></div>
        </button>
    )
}


export const SecondaryButton = ({ className, children, ...props }: React.ComponentProps<any>) => {

    return (
        <button className="relative group cursor-pointer active:translate-y-1 transition-transform duration-75" >

            <div className={cn(`relative bg-gradient-to-b from-gray-300 to-gray-400 border-2 border-black px-4 py-2 
                          shadow-[4px_4px_0px_0px_#000000] group-hover:shadow-[2px_2px_0px_0px_#000000]
                          group-active:shadow-[1px_1px_0px_0px_#000000] transition-all duration-75`, className)}>
                <div className="absolute top-0 left-0 right-0 h-1 bg-white opacity-60"></div>

                {/* Left highlight for 3D effect */}
                <div className="absolute top-0 left-0 bottom-0 w-1 bg-white opacity-40"></div>

                {/* Bottom shadow for 3D effect */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black opacity-30"></div>

                {/* Right shadow for 3D effect */}
                <div className="absolute top-0 right-0 bottom-0 w-1 bg-black opacity-20"></div>
                <p className="font-pixel2P text-[8px] text-white">
                    {children}
                </p>
            </div>

        </button>
    )
}