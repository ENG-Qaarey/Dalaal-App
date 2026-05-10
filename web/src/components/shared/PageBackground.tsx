'use client';

import React from 'react';

const PageBackground: React.FC = () => {
  return (
    <>
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-[#070b14] dark:via-[#0a0f18] dark:to-[#071612]" />

      <div className="fixed inset-0 -z-10 pointer-events-none bg-gradient-to-br from-blue-400/12 via-cyan-300/6 to-emerald-400/10 dark:from-blue-500/22 dark:via-transparent dark:to-emerald-500/18" />

      <div
        className="fixed inset-0 -z-10 pointer-events-none opacity-[0.07] dark:opacity-[0.28]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.72) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />

      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-24 w-[520px] h-[520px] bg-blue-300/18 rounded-full blur-[150px] dark:bg-blue-500/30" />
        <div className="absolute top-24 right-0 w-[420px] h-[420px] bg-cyan-300/16 rounded-full blur-[130px] dark:bg-cyan-500/22" />
        <div className="absolute top-[35%] left-1/3 w-[360px] h-[360px] bg-emerald-300/14 rounded-full blur-[110px] dark:bg-emerald-500/20" />
        <div className="absolute bottom-[-120px] left-1/4 w-[460px] h-[460px] bg-teal-300/10 rounded-full blur-[140px] dark:bg-amber-500/16" />
        <div className="absolute bottom-[-80px] right-[-40px] w-[520px] h-[520px] bg-gradient-to-tr from-blue-300/12 via-cyan-200/8 to-emerald-300/10 rounded-full blur-[150px] dark:from-blue-600/22 dark:via-emerald-500/16 dark:to-cyan-500/12" />
        <div className="absolute top-1/2 left-1/2 h-[760px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-300/10 via-transparent to-cyan-300/10 blur-[180px] dark:from-blue-500/16 dark:to-emerald-500/16" />
      </div>
    </>
  );
};

export default PageBackground;