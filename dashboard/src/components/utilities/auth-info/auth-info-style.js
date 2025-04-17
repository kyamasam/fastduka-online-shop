import Styled from 'vue3-styled-components';
const props = ['darkMode'];

const InfoWraper = Styled('div', props)`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .ninjadash-nav-action-link{
        text-decoration: none;
        color: ${({ theme }) => theme[theme.mainContent].secondary};
        box-shadow: none;
        padding: 0px 8px;
        img{
            vertical-align: unset;
        }
    }
    .ninjadash-nav-actions__searchbar{
        display: flex;
        align-items: center;
        @media only screen and (max-width: 767px){
            display: none;
        }
        svg,
        img{
            width: 16px;
            height: 16px;
					}
				svg{
					fill: ${({ theme }) => theme[theme.mainContent]['light-text']};
				}
        .ninjadash-searchbar{
            opacity: 0;
            visibility: visible;
            transition: .35s;
            position: relative;
            top: 3px;
            input{
                user-select: none;
                pointer-events: none;
            }
        }
        &.show{
            .ninjadash-searchbar{
                opacity: 1;
                visibility: visible;
                input{
                    user-select: all;
                    pointer-events: all;
                }
            }
            .ninjadash-search-icon{
                display: none;
            }
            .ninjadash-close-icon{
                display: block;
            }
        }
        .ninjadash-search-icon{
            svg{
                fill: ${({theme}) => theme['gray-color']};
            }
        }
        .ninjadash-close-icon{
            display: none;
        }
        a{
            line-height: .8;
            position: relative;
            top: 4px;
        }
    }
    .ninjadash-searchbar{
        .ant-form-item{
            margin-bottom: 0;
            .ant-form-item-control-input{
                min-height: 30px;
                .ant-input{
                    padding: 5px;
                    border: 0 none;
                    &:focus{
                        outline: none;
                        box-shadow: 0 0;
                    }
                }
            }
        }
    }
    .ninjadash-nav-actions__item{
        .ant-badge{
            .ant-badge-dot{
                top: 4px;
                ${({ theme }) => (theme.rtl ? 'left' : 'right')}: 11px !important;
            }
        }
        &.ninjadash-nav-actions__message{
            .ant-badge{
                .ant-badge-dot{
                    background: ${({ theme }) => theme[theme.mainContent].success};
                }
            }
        }
        svg{
            fill: ${({ theme }) => theme[theme.mainContent]['gray-text']};
        }
    }
    .ninjadash-nav-actions__message,
    .ninjadash-nav-actions__notification,
    .ninjadash-nav-actions__settings,
    .ninjadash-nav-actions__support,
    .ninjadash-nav-actions__flag-select,
    .ninjadash-nav-actions__language,
    .ninjadash-nav-actions__searchbar,
    .ninjadash-nav-actions__nav-author{
        display: flex;
        margin: 0 5px;
        span, a{
            display: block;
            line-height: normal;
        }
    }
    .ninjadash-nav-actions__nav-author{
        a.ant-dropdown-trigger{
            img{
                max-width: 20px;
            }
        }
    }

    .flag-select{
        padding-bottom: 0;
        .flag-select__option{
            margin: 0;
            img{
                top: 0;
            }
        }
        .flag-select__btn{
            line-height: 0;
            padding-right: 0;
            cursor: pointer;
        }
        .flag-select__btn:after{
            content: none;
        }
        .flag-select__options{
            width: 120px;
            padding-top: 0;
            margin: 0;
            right: 0;
            top: 30px;
            display: block;
            .flag-select__option{
                line-height: normal;
                display: block;
                padding: 5px 10px;
                span{
                    width: auto !important;
                    height: auto !important;
                    display: block;
                }
            }
        }
    }

    .flag-select {
        ul{
            width: 170px !important;
            padding: 12px 0;
            background: #fff;
            border: 0 none;
            box-shadow: 0 5px 30px ${({ theme }) => theme['gray-solid']}15;
            li{
                &:first-child{
                    margin-top: 12px;
                }
                &:hover{
                    background: ${({ theme }) => theme['primary-color']}05;
                }
                span{
                    display: flex !important;
                    align-items: center;
                    padding: 2px 10px;
                    img{
                        border-radius: 50%;
                    }
                    span{
                        font-weight: 500;
                        color: ${({ theme }) => theme['gray-color']};
                        padding: 0;
                        margin-left: 10px;
                    }
                }
            }
        }
    }
`;

const SettingDropdown = Styled.div`
    .setting-dropdown{
        max-width: 700px;
        padding: 4px 0;
        .setting-dropdown__single{
            align-items: flex-start;
            padding: 16px 20px;
            margin-bottom: 0;
            position: relative;
            &:after{
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                box-shadow: 0 5px 20px ${({ theme }) => theme['gray-solid']}15;
                z-index: 1;
                content: '';
                opacity: 0;
                visibility: hidden;
            }
            &:hover{
                &:after{
                    opacity: 1;
                    visibility: visible;
                }
            }
            h1{
                font-size: 15px;
                font-weight: 500;
                margin: -4px 0 2px;
				color: ${({ theme }) => theme[theme.mainContent]['dark-text']};
            }
            p{
                margin-bottom: 0;
                color: ${({ theme }) => theme['gray-solid']};
            }
            img{
                ${({ theme }) => (theme.rtl ? 'margin-left' : 'margin-right')}: 16px;
                transform: ${({ theme }) => (theme.rtl ? 'rotatey(180deg)' : 'rotatey(0deg)')};
            }
            figcaption{
                text-align: ${({ theme }) => (!theme.rtl ? 'left' : 'right')}
            }
        }
    }
`;

const NestedDropdown = Styled.div`
    .support-dropdown{
        padding: 10px 15px;
        text-align: ${({ theme }) => (!theme.rtl ? 'left' : 'right')};
        ul{
            &:not(:last-child){
                margin-bottom: 16px;
            }
            h1{
                font-size: 14px;
                font-weight: 400;
                color: ${({ theme }) => theme[theme.mainContent]['light-text']};
            }
            li{
                a{
                    font-weight: 500;
                    padding: 4px 16px;
                    color: ${({ theme }) => theme[theme.mainContent]['dark-text']};
                    &:hover{
                        background: #fff;
                        color: ${({ theme }) => theme['primary-color']};
                    }
                }
            }
        }
    }
`;

const UserDropDown = Styled.div`
    .user-dropdown{
        max-width: 280px;
        .user-dropdown__info{
            display: flex;
            align-items: flex-start;
            padding: 20px 25px;
            border-radius: 8px;
            margin-bottom: 12px;
            background: ${({ theme }) => theme[theme.mainContent]['general-background']};
            img{
                ${({ theme }) => (theme.rtl ? 'margin-left' : 'margin-right')}: 15px;
            }
            figcaption{
                h1{
                    font-size: 14px;
                    margin-bottom: 2px;
                    color:  ${({ theme }) => theme[theme.mainContent]['dark-text']};
                }
                p{
                    margin-bottom: 0px;
                    font-size: 13px;
                    color: ${({ theme }) => theme[theme.mainContent]['gray-text']};
                }
            }
        }
        .user-dropdown__links{
            a{
                width: calc(100% + 30px);
                left: -15px;
                right: -15px;
                display: inline-flex;
                align-items: center;
                padding: 10px 12px;
                font-size: 14px;
                transition: .3s;
                color: ${({ theme }) => theme[theme.mainContent]['gray-light-text']};
                &:hover{
                    background: ${({ theme }) => theme['primary-color']}05;
                    color: ${({ theme }) => theme[theme.mainContent]['menu-active']};
                    ${({ theme }) => (theme.rtl ? 'padding-right' : 'padding-left')}: 22px;
                    svg{
                        fill: ${({ theme }) => theme['primary-color']};
                    }
                }
                svg{
                    width: 16px;
                    transform: ${({ theme }) => (theme.rtl ? 'rotateY(180deg)' : 'rotateY(0deg)')};
                    ${({ theme }) => (theme.rtl ? 'margin-left' : 'margin-right')}: 14px;
					fill: ${({ theme }) => theme[theme.mainContent]['light-text']};
                }
            }
        }
        .user-dropdown__bottomAction{
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 13px;
            font-weight: 500;
            text-align: center;
            position: relative;
            width: calc(100% + 30px);
            left: -15px;
            right: -15px;
            height: calc(100% + 15px);
            bottom: -15px;
            border-radius: 0 0 6px 6px;
            padding: 15px 0;
            background: ${({ theme }) => theme[theme.mainContent]['general-background']};
            color: ${({ theme }) => theme[theme.mainContent]['light-text']};
            svg{
                width: 15px;
                height: 15px;
                ${({ theme }) => (theme.rtl ? 'margin-left' : 'margin-right')}: 8px;
            }
        }
    }
`;

const NinjadashTopDropdown = Styled.div`
    .ninjadash-top-dropdown__title .title-text {
        ${({ theme }) => (!theme.rtl ? 'margin-right' : 'margin-left')}: 10px;
		color: ${({ theme }) => theme[theme.mainContent]['dark-color']};
    }
    .ninjadash-top-dropdown__content {
        figcaption{
            h1{
                color: ${({ theme }) => theme[theme.mainContent]['dark-color']};
            }
            .ninjadash-top-dropdownText{
                min-width: 216px;
                ${({ theme }) => (!theme.rtl ? 'margin-right' : 'margin-left')}: 15px;
            }
            span{
                ${({ theme }) => (theme.rtl ? 'padding-right' : 'padding-left')}: 0;
            }
        }
        .notification-icon{
            width: 39.2px;
            height: 32px;
            ${({ theme }) => (!theme.rtl ? 'margin-right' : 'margin-left')}: 15px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            &.bg-primary{
                background: ${({ theme }) => theme['primary-color']}15;
                svg{
                    fill: ${({ theme }) => theme['primary-color']};
                }
            }
            &.bg-secondary{
                background: ${({ theme }) => theme['secondary-color']}15;
                svg{
                    fill: ${({ theme }) => theme['secondary-color']};
                }
            }
            svg{
                width: 18px;
                height: 18px;
            }
        }
        .notification-content{
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
    }

    .notification-text h1 {
        font-size: 14px;
        font-weight: 400;
        color: #5A5F7D;
        margin-bottom: 4px;
    }

    .notification-text h1 span {
        color: #5F63F2;
        font-weight: 500;
        ${({ theme }) => (theme.rtl ? 'padding-right' : 'padding-left')}: 0;
    }

    .notification-text p {
        font-size: 12px;
        color: #ADB4D2;
        margin-bottom: 0;
        text-align: ${({ theme }) => (!theme.rtl ? 'left' : 'right')}
    }
`;

const NavAuth = Styled.span`
    i, svg, img {
        ${({ theme }) => (theme.rtl ? 'margin-left' : 'margin-right')}: 8px;
    }
`;

export { InfoWraper, SettingDropdown, NestedDropdown, UserDropDown, NinjadashTopDropdown, NavAuth };
