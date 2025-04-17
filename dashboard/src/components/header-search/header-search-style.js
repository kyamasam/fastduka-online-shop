import Styled from 'vue3-styled-components';
const props = ['darkMode'];
const Div = Styled('div', props)`
    .ant-input{
        border: none;
    }
    .ant-input:focus{
        border: none;
        outline: 0;
        box-shadow: none;
    }
    .certain-category-icon{
        font-size: 16px;
        position: relative;
        bottom: -2px;
        color: ${({ theme, darkMode }) => (darkMode ? `#A8AAB3;` : theme['gray-color'])};
        @media only screen and (max-width: 767px){
            bottom: 0;
        }
        svg{
            margin-top: 4px;
            @media only screen and (max-width: 767px){
                width: 12px;
            }
        }
    }
`;

export { Div };
