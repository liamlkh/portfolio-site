import styled from 'styled-components';

export const DarkButtonWrapper = styled.div`
    position: absolute;
    bottom: 4%;
    right: 3%;
    padding: 8px;

    @media (max-width: 400px) {
        bottom: 2%;
    }

    .is-mode-changing & {
        pointer-events: none;
    }

    svg {
        width: 30px;
        height: 30px;
        opacity: 0.2;
        transition: opacity 0.4s ease-in-out;

        .is-mode-changing & {
            opacity: 0;
        }
    }

    div {
        width: 7em;
        font-family: CocoSharp, sans-serif;
        font-weight: 100;
        position: absolute;
        top: 0;
        left: 50%;
        transform: translate(-50%, 0%);
        opacity: 0;
        transition: all 0.6s ease-in-out;
        pointer-events: none;
        color: black;

        .is-dark & {
            color: #898989;
        }
    }

    &:hover:not(.is-mode-changing *) {
        svg {
            opacity: 1;
        }

        div {
            opacity: 1;
            transform: translate(-50%, -80%);
        }
    }
`


