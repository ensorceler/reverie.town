

/*
BG #121313
Border  #242525
Border-2 #363737

healthbar color: #9b4233
healthbar 2 color: #c25645

mana: #6e949d
mana2: #78b0bb

circle corner bg color:  #1c1c1c
circle corner upper border color: #313030
panel bg: #1f1e1e
*/

import { ActionButton } from "./ActionButton"

/*
return (
    <div className="relative rounded-sm h-40 w-96 bg-[#1f1e1e] border-2 border-[#242525] ">
        <div className="absolute -top-1.5 -left-1.5 h-5 w-5 rounded-full bg-[#1c1c1c] shadow">
        </div>
        <div className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-[#1c1c1c] shadow">
        </div>
        <div className="absolute -bottom-1.5 -left-1.5 h-5 w-5 rounded-full bg-[#1c1c1c] shadow">
        </div>
        <div className="absolute -bottom-1.5 -right-1.5 h-5 w-5 rounded-full bg-[#1c1c1c] shadow">
        </div>

        <div className="absolute -top-2.5 w-full flex justify-center">
            <div className="w-20 h-5 rounded-l-lg rounded-r-lg bg-[#1c1c1c] border-t-2 border-t-[#313030]"></div>
        </div>

    </div>
)
    */
export const Panel = () => {
    return (
        <div className="relative rounded-sm h-40 w-96 bg-neutral-700 border-4 border-neutral-950 p-0.5">
            {/* Inner content area with original gradient background */}
            <div className="h-full w-full bg-gradient-to-r from-neutral-800 to-neutral-900 rounded-sm p-3">
                {/* Your content goes here */}
                <p className="font-pixel2P text-neutral-300 text-xs mb-2">
                    A quick brown fox jumps over the lazy dog
                </p>

                <ActionButton >
                    PLAY
                </ActionButton>
            </div>

            {/* Corner circles */}
            <div className="absolute -top-1.5 -left-1.5 h-5 w-5 rounded-full bg-[#1c1c1c] shadow">
            </div>
            <div className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-[#1c1c1c] shadow">
            </div>
            <div className="absolute -bottom-1.5 -left-1.5 h-5 w-5 rounded-full bg-[#1c1c1c] shadow">
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 h-5 w-5 rounded-full bg-[#1c1c1c] shadow">
            </div>

            {/* Header */}
            <div className="absolute -top-2.5 w-full flex justify-center">
                <div className="w-20 h-5 rounded-l-lg rounded-r-lg bg-[#1c1c1c] border-t-2 border-t-[#313030] border-b-2 border-l-2 border-r-2 border-[#333232]"></div>
            </div>
        </div>
    )
}