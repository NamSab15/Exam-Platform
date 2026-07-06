"use client";

import React from "react";

export default function Team1Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @font-face {
          font-family: 'Material Symbols Outlined';
          font-style: normal;
          font-weight: 400;
          font-display: block;
          src: url(https://fonts.gstatic.com/s/materialsymbolsoutlined/v355/kJF1BvYX7BgnkSrUwT8OhrdQw4oELdPIeeII9v6oDMzByHX9rA6RzaxHMPdY43zj-jCxv3fzvRNU22ZXGJpEpjC_1v-p_4MrImHCIJIZrDCvHOem.ttf) format('truetype');
        }
        .material-symbols-outlined {
          font-family: 'Material Symbols Outlined';
          font-weight: normal;
          font-style: normal;
          font-size: 24px;
          line-height: 1;
          letter-spacing: normal;
          text-transform: none;
          display: inline-block;
          white-space: nowrap;
          word-wrap: normal;
          direction: ltr;
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}} />
      {children}
    </>
  );
}
