import Styled from 'vue3-styled-components';
import { Button } from 'ant-design-vue';

const ButtonGroup = Button.Group;
const props = [
  'type',
  'shape',
  'icon',
  'size',
  'outlined',
  'ghost',
  'transparent',
  'raised',
  'squared',
  'color',
  'social',
  'loading',
];
const outline = (theme, type) => {
  return `
        background: transparent;
        border: 1px ${type !== 'dash' ? 'solid' : 'dashed'} ${type !== 'light' ? theme[`${type}-color`] : theme[theme.mainContent]['border-color-default']} !important;
        color: ${type !== 'default' && theme[`${type}-color`]};

        &:hover, &:focus {
          background: transparent;
          border: 1px ${type !== 'dash' ? 'solid' : 'dashed'} ${type !== 'default' && theme[`${type}-hover`]};
          color: ${type !== 'default' && theme[`${type}-hover`]};
        }
				svg{
					fill: ${type !== 'default' && theme[`${type}-color`]} !important;
				}
    `;
};

const ghosts = (theme) => {
  return `
          background: transparent;
          border: 1px solid ${theme[theme.mainContent]['border-color-default']} !important;
          color: ${theme[theme.mainContent]['border-color-default']} !important;

          &:hover, &:focus {
              background: #ffffff50 !important;
              border: 1px solid transparent !important;
              color: ${theme[theme.mainContent]['border-color-default']} !important;
          }
					svg{
						fill: ${theme[theme.mainContent]['border-color-default']} !important;
					}
      `;
};

const transparents = (theme, type) => {
  return `
        background: ${type !== 'default' && theme[`${type}-color`]}15;
        border-width: 0px;
        color: ${type !== 'default' && theme[`${type}-color`]};
        &:hover, &:focus {
            background: ${type !== 'default' && theme[`${type}-hover`]}15;
            border-width: 0px;
            color: ${type !== 'default' && theme[`${type}-hover`]};
        }
				svg {
					fill: ${type !== 'default' && theme[`${type}-color`]} !important;
				}
    `;
};

const raise = (theme, type) => {
  return `
        box-shadow: 0 10px 15px ${type !== 'white' ? theme[`${type}-color`] : '#9299B8'}20;
    `;
};

const square = (theme, type) => `
      background: ${type !== 'default' && theme[`${type}-color`]};
      border: 1px solid ${type !== 'default' ? theme[`${type}-color`] : theme['disabled-color']};
      color: ${type !== 'default' && '#ffffff'};
      border-radius: 0px;
      padding: 0px 15px;

      &:hover, &:focus {
          background: ${type !== 'default' && theme[`${type}-hover`]};
          border: 1px solid ${type !== 'default' && theme[`${type}-hover`]};
          color: ${type !== 'default' && '#ffffff'};
      }
			svg{
				fill: ${type !== 'default' && '#ffffff'} !important;
			}
  `;

const squareOutline = (theme, type) => `
      background: transparent;
      border: 1px ${type !== 'dash' ? 'solid' : 'dashed'} ${
  type !== 'default' ? theme[`${type}-color`] : theme['disabled-color']
};
      color: ${type !== 'default' && theme[`${type}-color`]};
      border-radius: 0px;
      padding: 0px 15px;
      &:hover, &:focus {
          background: ${type !== 'default' && theme[`${type}-hover`]};
          border: 1px solid ${type !== 'default' && theme[`${type}-hover`]};
          color: ${type !== 'default' && '#ffffff'};
      }
			svg{
				fill: ${type !== 'default' && theme[`${type}-color`]} !important;
			}
  `;

const socialButton = (color, shape) => `
      background: ${color};
      background: ${color};
      border: 1px solid ${color};
      color: #ffffff;
      border-radius: ${!shape ? '4px' : '40px'};
      padding: 0px 12px;
      display: inline-flex;
      align-items: center;
      span {
          padding-left: 5px;
      }
      &:hover, &:focus {
          background: ${color}90;
          border: 1px solid ${color}90;
          color: #ffffff;
      }
			svg{
				fill:  #fff !important;
			}
  `;

const ButtonStyled = Styled('button', props)`
		font-size: 14px;
    background: ${({ type, theme }) => type !== 'default' && theme[`${type}-color`] + ''};
    border-width: 0px;
    border-style: ${({ type }) => (type !== 'dashed' ? 'solid' : 'dashed')};
    color: ${({ type }) => (type !== 'default' && type !== 'white' ? '#ffffff' : '#5A5F7D')};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: ${({ shape }) => (!shape ? '4px' : '40px')};
    padding: 0px 20.5px;
    height: ${({ size, theme }) => (size !== 'default' ? theme[`btn-height-${size}`] : '44px')};
    font-weight: 600;
    box-shadow: 0 0;
    &:hover, &:focus {
        background: ${({ type, theme }) => type !== 'default' && type !== 'white' && theme[`${type}-hover`] + ''};
        color: ${({ type }) => (type !== 'default' && type !== 'white' ? '#ffffff' : '#5A5F7D')};
    }
    i,
    svg,
    img{
        width: 16px;
        height: 16px;
    }
		svg{
			fill: ${({ type }) => (type !== 'default' && type !== 'white' ? '#ffffff' : '#5A5F7D')} !important;
		}
    span{
        ${({ theme }) => (theme.rtl ? 'margin-right' : 'margin-left')}: 6px
    }

    ${({ transparent, theme, type }) => transparent && transparents(theme, type)};
    ${({ outlined, theme, type }) => outlined && outline(theme, type)};
    ${({ ghost, theme }) => ghost && ghosts(theme)};
    ${({ raised, theme, type }) => raised && raise(theme, type)};
    ${({ squared, theme, type }) => squared && square(theme, type)};
    ${({ squared, outlined, theme, type }) => squared && outlined && squareOutline(theme, type)};
    ${({ social, color, shape }) => social && socialButton(color, shape)};
`;

const ButtonStyledGroup = Styled(ButtonGroup)`
    >.ant-btn:first-child{
        border-top-left-radius: 3px !important;
        border-bottom-left-radius: 3px !important;
    }
    button {
        margin: 0px;
        padding: 0 10.75px;
        height: 30px;
        font-size: 12px;
        font-weight: 500;
    }
    .ant-btn-light:hover{
        background: #F4F5F7;
    }
`;

const CustomDropDown = Styled('div')`
    position: relative;
    .ninjadash-range-calendar{
        position: absolute;
        padding: 10px 10px 0 10px;
        z-index: 22 !important;
        top: 50px;
        right: 0;
        margin-right: -50%;
        background-color: #fff;
    }
`;

export { ButtonStyled, ButtonStyledGroup, CustomDropDown };
