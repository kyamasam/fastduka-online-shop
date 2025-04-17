import Styled from 'vue3-styled-components';

const Content = Styled.div`
    background: ${({ theme }) => theme[theme.mainContent]['main-background']};
    box-shadow: 0px 10px 15px #22222210 !important;
    a i, a svg, a img {
        ${({ theme }) => (theme.rtl ? 'margin-left' : 'margin-right')}: 8px;
    }
    a svg{
        fill: #888;
    }
    a {
        display: flex;
        align-items: center;
        color: #888;
        padding: 6px 12px;
        .unicon{
            line-height: 0;
			margin-top: -3px;
        }
    }
    a:hover {
        background: ${({ theme }) => theme['primary-color']};
        color: #fff;
        svg{
            fill: #fff;
        }
    }
    .dropdown-theme-2{
        a:hover{
            background: ${({ theme }) => theme.pink}10;
            color: ${({ theme }) => theme.pink}
        }
    }
`;

export { Content };
