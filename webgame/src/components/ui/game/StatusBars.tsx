import React from 'react';

export interface StatusBarProps {
  health: number;
  maxHealth?: number;
  mana: number;
  maxMana?: number;
  experience: number;
  maxExperience?: number;
  gold?: number;
}
/*
BG #121313
Border  #242525
Border-2 #363737

healthbar color: #9b4233
healthbar 2 color: #c25645

mana: #6e949d
mana2: #78b0bb
*/
export const StatusBar = ({
}) => {
  return (
    <div className="absolute top-2 left-2 w-80 z-10 max-w-md max-h-[320px] bg-black/20  backdrop-blur-sm rounded-lg p-2 border border-white/10 ">
      <div className="flex flex-row items-center h-full">
        <div className="h-16 w-16 bg-[#121313] border-4 border-[#242525]">
        </div>
        <div className="flex flex-col h-16 border-l-4 border-l-[#363737]">


          {/** healthbar */}
          <div className="flex-1 w-52 py-1 pr-2 bg-[#121313] border-y-2 border-r-2 border-[#242525] flex flex-col justify-center">
            <div className="h-full w-full bg-[#9b4233] relative">
              <div className="absolute h-1/2 inset-0 bg-[#c25645]"></div>
            </div>
          </div>
          {/** healthbar */}

          {/** mana */}
          <div className="flex-1 w-52 py-1 pr-2 bg-[#121313] border-y-2 border-r-2 border-[#242525] flex flex-col justify-center">
            <div className="h-full w-20 bg-[#6e949d] relative">
              <div className="absolute h-1/2 inset-0 bg-[#78b0bb]"></div>
            </div>
          </div>
          {/** mana */}

          <div className="flex-2 w-20 bg-[#121313] border-t-2 border-b-2 border-r-2 border-[#363737] flex flex-col justify-center">
            <p className="font-pixel2P text-white text-xs">2893</p>
          </div>

        </div>

      </div>
    </div>
  );
};

