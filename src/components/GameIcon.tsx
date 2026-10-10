import React from 'react';

interface GameIconProps {
  type: string;
  className?: string;
}

export const GameIcon: React.FC<GameIconProps> = ({ type, className = 'w-12 h-12' }) => {
  switch (type) {
    case 'mlbb':
      return (
        <div className={`${className} rounded-xl bg-gradient-to-br from-amber-500 via-orange-600 to-indigo-900 flex items-center justify-center p-2 shadow-lg text-white font-black tracking-tighter`}>
          <div className="relative flex flex-col items-center">
            <span className="text-[10px] leading-tight font-extrabold uppercase text-amber-200">MLBB</span>
            <div className="w-5 h-5 flex items-center justify-center text-amber-300">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l-10-5v9l10 5 10-5v-9l-10 5z" />
              </svg>
            </div>
          </div>
        </div>
      );

    case 'freefire':
      return (
        <div className={`${className} rounded-xl bg-gradient-to-br from-orange-500 via-amber-600 to-red-900 flex items-center justify-center p-2 shadow-lg text-white font-black`}>
          <div className="relative flex flex-col items-center">
            <span className="text-[10px] leading-tight font-extrabold uppercase text-yellow-200">FF</span>
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-amber-300">
              <path d="M12 2c1.5 3 4 5 7 6-2 3-2 7-1 9 1 2 2 3 2 4-2 0-5-1-8-3-3 2-6 3-8 3 0-1 1-2 2-4 1-2 1-6-1-9 3-1 5.5-3 7-6z" />
            </svg>
          </div>
        </div>
      );

    case 'pubgm':
      return (
        <div className={`${className} rounded-xl bg-gradient-to-br from-yellow-500 via-neutral-800 to-amber-950 flex items-center justify-center p-2 shadow-lg text-white font-black`}>
          <div className="relative flex flex-col items-center">
            <span className="text-[9px] leading-tight font-extrabold tracking-wider text-yellow-300">PUBG</span>
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-400">
              <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm0 4.5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5-2.5-1.12-2.5-2.5 1.12-2.5 2.5-2.5z" />
            </svg>
          </div>
        </div>
      );

    case 'valorant':
      return (
        <div className={`${className} rounded-xl bg-gradient-to-br from-rose-600 via-red-700 to-neutral-900 flex items-center justify-center p-2 shadow-lg text-white font-black`}>
          <div className="relative flex flex-col items-center">
            <span className="text-[9px] leading-tight font-extrabold tracking-wider text-rose-200">VAL</span>
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white">
              <path d="M2.5 4l7 14.5L12 18.5 5 4H2.5zm19 0l-9.5 16h3L21.5 4z" />
            </svg>
          </div>
        </div>
      );

    case 'genshin':
      return (
        <div className={`${className} rounded-xl bg-gradient-to-br from-teal-500 via-cyan-700 to-indigo-950 flex items-center justify-center p-2 shadow-lg text-white font-black`}>
          <div className="relative flex flex-col items-center">
            <span className="text-[9px] leading-tight font-extrabold text-cyan-200">GI</span>
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-cyan-300">
              <path d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6z" />
            </svg>
          </div>
        </div>
      );

    case 'hok':
    case 'honorofkings':
      return (
        <div className={`${className} rounded-xl bg-gradient-to-br from-amber-500 via-yellow-600 to-red-950 flex items-center justify-center p-2 shadow-lg text-white font-black border border-amber-500/30`}>
          <div className="relative flex flex-col items-center">
            <span className="text-[9px] leading-tight font-extrabold uppercase text-amber-200">HOK</span>
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-amber-300">
              <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
            </svg>
          </div>
        </div>
      );

    case 'hsr':
      return (
        <div className={`${className} rounded-xl bg-gradient-to-br from-indigo-500 via-purple-700 to-neutral-900 flex items-center justify-center p-2 shadow-lg text-white font-black`}>
          <div className="relative flex flex-col items-center">
            <span className="text-[9px] leading-tight font-extrabold text-indigo-200">HSR</span>
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-amber-300">
              <path d="M12 2L15 9l7 3-7 3-3 7-3-7-7-3 7-3z" />
            </svg>
          </div>
        </div>
      );

    case 'zzz':
      return (
        <div className={`${className} rounded-xl bg-gradient-to-br from-amber-400 via-neutral-900 to-black flex items-center justify-center p-2 shadow-lg text-white font-black border border-amber-500/30`}>
          <span className="text-sm font-black text-amber-400 tracking-tighter">ZZZ</span>
        </div>
      );

    case 'roblox':
      return (
        <div className={`${className} rounded-xl bg-gradient-to-br from-red-600 via-neutral-800 to-neutral-950 flex items-center justify-center p-2 shadow-lg text-white font-black`}>
          <div className="w-5 h-5 border-2 border-white rotate-12 flex items-center justify-center">
            <div className="w-2 h-2 bg-white"></div>
          </div>
        </div>
      );

    case 'codm':
      return (
        <div className={`${className} rounded-xl bg-gradient-to-br from-amber-600 via-stone-800 to-black flex items-center justify-center p-2 shadow-lg text-white font-black`}>
          <span className="text-[10px] font-black text-amber-400">CODM</span>
        </div>
      );

    case 'farlight84':
      return (
        <div className={`${className} rounded-xl bg-gradient-to-br from-cyan-500 via-blue-700 to-neutral-950 flex items-center justify-center p-2 shadow-lg text-white font-black`}>
          <span className="text-[9px] font-black text-cyan-200">FARLIGHT</span>
        </div>
      );

    case 'bloodstrike':
      return (
        <div className={`${className} rounded-xl bg-gradient-to-br from-red-700 via-rose-900 to-black flex items-center justify-center p-2 shadow-lg text-white font-black`}>
          <span className="text-[8px] font-black text-red-300 tracking-tight">STRIKE</span>
        </div>
      );

    case 'deltaforce':
      return (
        <div className={`${className} rounded-xl bg-gradient-to-br from-emerald-600 via-teal-800 to-neutral-950 flex items-center justify-center p-2 shadow-lg text-white font-black`}>
          <span className="text-[9px] font-black text-emerald-200">DELTA</span>
        </div>
      );

    case 'supersus':
      return (
        <div className={`${className} rounded-xl bg-gradient-to-br from-blue-500 via-indigo-700 to-neutral-900 flex items-center justify-center p-2 shadow-lg text-white font-black`}>
          <span className="text-[8px] font-black text-blue-200">SUPERSUS</span>
        </div>
      );

    case 'higgsdomino':
      return (
        <div className={`${className} rounded-xl bg-gradient-to-br from-yellow-500 via-amber-600 to-orange-950 flex items-center justify-center p-2 shadow-lg text-white font-black`}>
          <span className="text-[9px] font-black text-amber-200">DOMINO</span>
        </div>
      );

    case 'ragnarokorigin':
      return (
        <div className={`${className} rounded-xl bg-gradient-to-br from-amber-500 via-orange-600 to-indigo-900 flex items-center justify-center p-2 shadow-lg text-white font-black`}>
          <span className="text-[9px] font-black text-yellow-200">RAGNAROK</span>
        </div>
      );

    case 'toweroffantasy':
      return (
        <div className={`${className} rounded-xl bg-gradient-to-br from-sky-500 via-blue-700 to-neutral-900 flex items-center justify-center p-2 shadow-lg text-white font-black`}>
          <span className="text-[10px] font-black text-sky-200">TOF</span>
        </div>
      );

    case 'cookierun':
      return (
        <div className={`${className} rounded-xl bg-gradient-to-br from-pink-500 via-rose-600 to-amber-900 flex items-center justify-center p-2 shadow-lg text-white font-black`}>
          <span className="text-[9px] font-black text-pink-200">CRK</span>
        </div>
      );

    // PULSA
    case 'telkomsel':
      return (
        <div className={`${className} rounded-xl bg-gradient-to-br from-red-600 via-red-800 to-neutral-950 flex items-center justify-center p-2 shadow-lg text-white font-black`}>
          <span className="text-[9px] font-black text-white">T-SEL</span>
        </div>
      );

    case 'xl':
      return (
        <div className={`${className} rounded-xl bg-gradient-to-br from-blue-600 via-indigo-800 to-neutral-950 flex items-center justify-center p-2 shadow-lg text-white font-black`}>
          <span className="text-[10px] font-black text-white">XL/AXIS</span>
        </div>
      );

    case 'indosat':
      return (
        <div className={`${className} rounded-xl bg-gradient-to-br from-yellow-500 via-amber-600 to-neutral-950 flex items-center justify-center p-2 shadow-lg text-white font-black`}>
          <span className="text-[10px] font-black text-neutral-950">IM3</span>
        </div>
      );

    case 'tri':
      return (
        <div className={`${className} rounded-xl bg-gradient-to-br from-rose-500 via-orange-600 to-neutral-950 flex items-center justify-center p-2 shadow-lg text-white font-black`}>
          <span className="text-xs font-black text-white">3</span>
        </div>
      );

    case 'smartfren':
      return (
        <div className={`${className} rounded-xl bg-gradient-to-br from-pink-600 via-rose-800 to-neutral-950 flex items-center justify-center p-2 shadow-lg text-white font-black`}>
          <span className="text-[8px] font-black text-white">SMART</span>
        </div>
      );

    // E-WALLET
    case 'dana':
      return (
        <div className={`${className} rounded-xl bg-gradient-to-br from-sky-500 via-blue-600 to-neutral-950 flex items-center justify-center p-2 shadow-lg text-white font-black`}>
          <span className="text-[10px] font-black text-white">DANA</span>
        </div>
      );

    case 'ovo':
      return (
        <div className={`${className} rounded-xl bg-gradient-to-br from-purple-600 via-indigo-800 to-neutral-950 flex items-center justify-center p-2 shadow-lg text-white font-black`}>
          <span className="text-[10px] font-black text-white">OVO</span>
        </div>
      );

    case 'gopay':
      return (
        <div className={`${className} rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-neutral-950 flex items-center justify-center p-2 shadow-lg text-white font-black`}>
          <span className="text-[9px] font-black text-white">GOPAY</span>
        </div>
      );

    case 'shopeepay':
      return (
        <div className={`${className} rounded-xl bg-gradient-to-br from-orange-500 via-amber-600 to-neutral-950 flex items-center justify-center p-2 shadow-lg text-white font-black`}>
          <span className="text-[8px] font-black text-white">SHOPEE</span>
        </div>
      );

    case 'linkaja':
      return (
        <div className={`${className} rounded-xl bg-gradient-to-br from-red-600 via-rose-700 to-neutral-950 flex items-center justify-center p-2 shadow-lg text-white font-black`}>
          <span className="text-[8px] font-black text-white">LINKAJA</span>
        </div>
      );

    case 'googleplay':
      return (
        <div className={`${className} rounded-xl bg-gradient-to-br from-emerald-500 via-teal-700 to-neutral-950 flex items-center justify-center p-2 shadow-lg text-white font-black`}>
          <span className="text-[8px] font-black text-white">G-PLAY</span>
        </div>
      );

    case 'apple':
      return (
        <div className={`${className} rounded-xl bg-gradient-to-br from-neutral-600 via-neutral-800 to-neutral-950 flex items-center justify-center p-2 shadow-lg text-white font-black`}>
          <span className="text-[10px] font-black text-white">APPLE</span>
        </div>
      );

    // TAGIHAN & PLN
    case 'pln':
    case 'pln_bill':
      return (
        <div className={`${className} rounded-xl bg-gradient-to-br from-amber-400 via-yellow-500 to-blue-900 flex items-center justify-center p-2 shadow-lg text-neutral-950 font-black`}>
          <div className="flex flex-col items-center">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-amber-950">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            <span className="text-[8px] font-black text-amber-950">PLN</span>
          </div>
        </div>
      );

    case 'voucher':
      return (
        <div className={`${className} rounded-xl bg-gradient-to-br from-blue-600 via-indigo-800 to-purple-950 flex items-center justify-center p-2 shadow-lg text-white font-black`}>
          <span className="text-[9px] font-black text-white">VOUCHER</span>
        </div>
      );

    default:
      return (
        <div className={`${className} rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center p-2 shadow-lg text-white font-bold`}>
          <span className="text-xs font-mono">TG</span>
        </div>
      );
  }
};
