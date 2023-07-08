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
    width: 400px;
    height: 400px;
    font-family: CocoSharp;
    font-weight: 100;

    @media (max-width: 400px) {
        width: 320px;
        height: 320px;
    }

    .is-dark & {
        color: #a1377a;
        filter: drop-shadow(5px 5px 5px red) invert(35%);
    }

    div:nth-child(1) {
        float: left;
        height: 100%;
        width: 50%;
        shape-outside: polygon(
            0 0,
            100% 1%,
            20% 22%,
            0% 65%,
            54% 99%,
            0 100%
        );
        shape-margin: 1%;
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
    }

    svg {
        position: absolute;
        top: 0;
        left: 0;
        pointer-events: none;
    }

    & > p {
        position: relative;
        padding-top: 23%;
        user-select: text;
        z-index: 10;
        text-align: center;
        user-select: none;

        @media (max-width: 400px) {
            font-size: 0.8rem;
        }

        p {
            font-size: 0.9em;
            margin: 10px 0;
        }

        a {
            text-decoration: underline;
        }
    }
`



