import styled from 'styled-components';

export const Title = styled.div`
    position: absolute;
    top: 7%;
    left: 3%;
    font-size: 24px;
    text-align: right;
    font-family: Breadley, serif;
    padding: 2em;

    @media (max-width: 400px) {
        left: unset;
        top: 13%;
        right: 5%;
        width: 60%;
        padding: 0;
    }

    h1 {
        position: relative;
        font-weight: bold;
        font-size: 3.2em;
        line-height: 0.85em;
        letter-spacing: 0.04em;
    }

    h2 {
        position: relative;
        font-family: Breadley, serif;
        font-weight: normal;
        font-size: 1em;
        letter-spacing: 0.04em;

        @media (max-width: 400px) {
            margin-top: 0.3em;
        }
    }

    .is-dark & {
        color: #a1377a;
    }
    
    &.is-back {
        * {
            transform: scale(1.15);
        }
        .is-dark & {
            filter: drop-shadow(5px 5px 5px #a1377a) invert(35%);

            .is-work-changing &, .is-route-changing &, .is-transitioning & {
                opacity: 0 !important;
            }
        }
    }

    & * {
        // transition: opacity 0.8s ease-in-out;
    }

    .is-route-changing & * {
        // opacity: 0;
    }
`;



