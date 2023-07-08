import styled from 'styled-components';

export const CanvasContainer = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
`;

export const InfoContainer = styled.div`
    position: absolute;
    top: 10%;
    left: 3%;
    padding-bottom: 0.5em;
    font-size: 20px;
    max-height: 90%;
    overflow-y: auto;
    width: 450px;
    max-width: 95%;
    mask-image: linear-gradient(to left, black 99%, transparent 100%);
    --offset: 30px;

    p {
        display: inline-block;
    }

    @media (max-width: 400px) {
        --offset: 20px;
    }
`;

export const InfoTopContainer = styled.div`
    color: black;
    overflow: visible;
    padding: var(--offset);

    .is-dark & {
        color: var(--infoColor);
    }

    &.is-back {
        position: absolute;
        top: 0;
        * {
            transform: scale(1.15);
        }
        .is-dark & {
            filter: drop-shadow(5px 5px 5px var(--infoColor)) invert(35%);

            .is-work-changing &, .is-route-changing &, .is-mode-changing & {
                opacity: 0 !important;
            }
        }
    }
`

export const InfoTitle = styled.p`
    font-family: Breadley, serif;
    font-weight: bold;
    font-size: 3em;
    letter-spacing: 0.04em;
    line-height: 1.1;
`

export const InfoType = styled.p`
    font-family: Breadley, serif;
    font-weight: bold;
    font-size: 1em;
    letter-spacing: 0.04em;
    transition-delay: 0.2s;
`

export const InfoContent = styled.p`
    font-family: Breadley, serif;
    font-size: 1em;
    letter-spacing: 0.04em;
    margin-top: 1em;
    transition-delay: 0.35s;
    white-space: pre-line;

    .is-dark & {
        filter: saturate(60%);
    }
`

export const InfoBottom = styled.div`
    display: flex;
    font-family: CocoSharp, sans-serif;
    font-weight: 100;
    font-style: italic;
    font-size: 0.7em;
    width: 80%;
    margin-left: calc(var(--offset) - 1.5em);
    transition: all 0.5s ease-in-out;

    div:last-child {
        margin-left: 3em;
    }
`   

export const VisitSite = styled.a`
    position: absolute;
    top: 7%;
    left: var(--offset);
    font-family: Breadley, serif;
    font-weight: bold;
    font-size: 0.8em;
    display: inline-block;
    z-index: 999;

    @media (max-width: 400px) {
        top: 4%;
    }

    .is-dark & {
        color: var(--infoColor);
        filter: saturate(60%);
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
          background-color: var(--infoColor);
        }
      }
  
      &:hover {
        ::after {
            width: 100%;
        }
      }
`   





