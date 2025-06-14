import styled from 'styled-components';

export const Wrapper = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: opacity 0.6s ease-in-out, transform 0.3s ease-in;
    opacity: 1;

    .is-route-changing &, .is-mode-changing & {
        // transform: translate(-50%, 100%);
        opacity: 0;
    }
`;
    
export const Container = styled.div`
    width: 650px;
    height: 650px;
    font-family: CocoSharp;
    font-weight: 100;
    display: flex;
    align-items: center;
    justify-content: center;

    @media (max-width: 450px) {
        width: 320px;
        height: 320px;
    }

    .is-dark & {
        color: #a1377a;
        filter: drop-shadow(5px 5px 5px red) invert(35%);
    }

    div:last-child {
        width: 80%;
        line-height: 2;
    }

    &::before {
        content: '';
        float: right;
        height: 100%;
        width: 50%;
        shape-outside: polygon(
            100% 0,
            0% 1%,
            80% 22%,
            100% 65%,
            46% 99%,
            100% 100%
        );
        shape-margin: 1%;
        position: absolute;
    }

    svg {
        position: absolute;
        top: 0;
        left: 0;
        pointer-events: none;
    }

    p {
        position: relative;
        user-select: text;
        z-index: 10;
        font-size: 1em;

        @media (max-width: 450px) {
            font-size: 0.6rem;
        }

        a {
            text-decoration: underline;
        }
    }
`



