import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  /* Default */

  * {
    box-sizing: border-box;
    margin: 0;
    outline: 0;
    padding: 0;
  }

  body {
    position: fixed;
    overflow: hidden;
    overscroll-behavior-y: none;
    text-rendering: optimizeLegibility !important;
    -webkit-font-smoothing: antialiased !important;
    cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 50 50" overflow="visible" stroke="black" stroke-width="1.5" stroke-linecap="round"><line x1="25" x2="25" y1="50" /><line x1="50" y1="25" y2="25" /></svg>') 7 7, auto !important;

    background-color: white;
    transition: background-color 0.5s ease-in-out;

    &.is-dark {
      background-color: black;
      cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 50 50" overflow="visible" stroke="#BBBBBB" stroke-width="1.5" stroke-linecap="round"><line x1="25" x2="25" y1="50" /><line x1="50" y1="25" y2="25" /></svg>') 7 7, auto !important;
    }
  }
  
  a, button {
    outline: none;
    color: unset;
    text-decoration: unset;
    cursor: unset;
  }

  html, body, #root {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    overflow: hidden;
  }

  .button {
    position: relative;
    display: flex;
    justify-content: center;
    font-family: CocoSharp, sans-serif;
    font-weight: 100;
    margin: 0 0px;
    text-decoration: none;
    width: 7em;
    height: 1.4em;
    text-align: center;
    color: black!important;
    overflow: hidden;

    .is-dark & {
        color: #898989 !important;
    }

    .is-mode-changing & {
        overflow: hidden;
    }

    span {
      letter-spacing: 0.2em;
      transition: all 0.5s ease-in-out;
      position: relative;
  
      .is-route-changing &:not(nav *), .is-mode-changing &, .not-ready & {
        transform: translateY(100%);
      }
  
      ::after {
        content: "";
        position: absolute;
        left: 0;
        bottom: 0;
        width: 0%;
        height: 1px;
        background-color: black;
        transition: all 0.5s ease-in-out;

        .is-dark & {
          background-color: #999999;
        }
      }
  
      &:hover {
        letter-spacing: 0.4em;
        ::after {
            width: 90%;
        }
      }
    }
  }

  .reveal-text {
    transition: all 0.8s ease-in-out, color 0s;
    mask-image: linear-gradient(to right, black 0%, black 33.33%, transparent 66.66%);
    mask-size: 300% 200%;
    mask-position: 0% 0%;
    
    .is-work-changing &, .is-route-changing &, .is-mode-changing &, .not-ready & {
      mask-position: 100% 0%;
      transform: translateX(-20%);
    }
  }

  .canvas-wrapper {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;

    canvas {
      transition: opacity 0.5s ease-in-out;
      .not-ready &, .is-three-loading &, .is-hiding& {
        opacity: 0;
      }
    }
  }

  .mask {
    mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><polygon fill="black" points="52.7 2.77 12.61 22.08 2.71 65.47 30.45 100.27 74.96 100.27 102.7 65.47 92.8 22.08 52.7 2.77"/></svg>');
    mask-repeat: no-repeat;
  }

  .inverted-mask {
    // mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><polygon fill="black" points="52.7 2.77 12.61 22.08 2.71 65.47 30.45 100.27 74.96 100.27 102.7 65.47 92.8 22.08 52.7 2.77"/></svg>'), linear-gradient(#fff,#fff);
    mask-repeat: no-repeat, no-repeat;
    -webkit-mask-composite: destination-out !important;
    mask-composite: exclude !important; 
    // mask-position: -60px -60px, 0 0; 
  }

  * {
    box-sizing: border-box;
  }

`;

export default GlobalStyle
