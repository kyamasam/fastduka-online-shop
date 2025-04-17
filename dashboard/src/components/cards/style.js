import Styled from "vue3-styled-components";

const CourseCardWrap = Styled.div`
    &.ninjadash-course-card-single{
        margin-bottom: 25px;
        .ant-card{
            background-color: ${({ theme }) => theme[theme.mainContent]['white-background']};
        }
        .ant-card-body{
            padding: 20px !important;
        }
        .ninjadash-course-card-thumbnail{
            border-radius: 10px;
            margin-bottom: 15px;
            img{
                max-width: 100%;
                width: 100%;
            }
        }
        .ninjadash-course-card-title{
            font-size: 20px;
            margin-bottom: 12px;
            font-weight: 600;
            a{
                color: ${({ theme }) => theme[theme.mainContent]['dark-text']};
                &:hover{
                    color: ${({ theme }) => theme['primary-color']};
                }
            }
        }
        .ninjadash-course-card-author{
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            img{
                max-width: 30px;
                ${({ theme }) => (!theme.rtl ? 'margin-right' : 'margin-left')}: 10px;
            }
            .ninjadash-course-card-author__name{
                font-size: 15px;
                color: ${({ theme }) => theme[theme.mainContent]['gray-light-text']};
            }
            @media only screen and (max-width: 1599px){
                margin-bottom: 15px;
            }
        }
        .ninjadash-course-card-meta{
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            margin-top: -10px;
            margin-bottom: -10px;
            .ninjadash-course-card-meta__pricing{
                font-size: 20px;
                font-weight: 600;
                color: ${({ theme }) => theme['success-color']};
            }
        }
        .ninjadash-course-card-meta__left{
            margin: 10px 0;
        }
        .ninjadash-course-card-meta__right{
            display: flex;
            align-items: center;
            margin: 5px -5px 5px;
            li{
                display: inline-flex;
                align-items: center;
                min-height: 32px;
                border-radius: 20px;
                padding: 0 15px;
                margin: 5px;
                &.bg-secondary{
                    color: ${({ theme }) => theme[theme.mainContent]['secondary-white']};
                    background-color: rgba(88,64,255,.15);
                    svg{
                        fill: ${({ theme }) => theme[theme.mainContent]['secondary-white']};
                        top: 0;
                    }
                }
                &.bg-primary{
                    color: ${({ theme }) => theme[theme.mainContent]['primary-white']};
                    background-color: rgba(251,53,134,.15);
                    svg{
                        fill: ${({ theme }) => theme[theme.mainContent]['primary-white']};;
                        top: 0;
                    }
                }
                span{
                    font-size: 13px;
                    line-height: 1;
                    font-weight: 500;
                }
                svg{
                    width: 14px;
                    ${({ theme }) => (!theme.rtl ? 'margin-right' : 'margin-left')}: 3px;
                }
            }
        }
    }
`;
const OverviewCard = Styled.div `
    margin-bottom: 25px;
    .ant-card {
        background-color: ${({ theme }) => theme[theme.mainContent]['white-background']};
        &.ninjadash-overview-halfCircle-card{
            overflow: hidden;
            .ant-card-body {
                padding: 24px 25px 12px !important;
                .ninjadash-overview-card {
                    .ninjadash-overview-card__bottom {
                        margin-top: 0;
                        .ninjadash-overview-status{
                            background-color: transparent;
                            padding: 0;
                        }
                    }
                    .ninjadash-overview-card__top--icon{
                        position: absolute;
                        top: -9px;
                        right: -38%;
                        width: 230px;
                        height: 168px;
                        border-radius: 100%;
                        padding: 0 30px;
                        justify-content: flex-start;
                        @media only screen and (max-width: 1699px){
                            right: -48%;
                        }
                        @media only screen and (max-width: 1599px){
                            right: -20%;
                            top: -12px;
                        }
                        @media only screen and (max-width: 1399px){
                            right: -24%;
                            top: -15px;
                        }
                        @media only screen and (max-width: 991px){
                            right: -35%;
                        }
                        @media only screen and (max-width: 767px){
                            right: -46%;
                            padding: 0 18px;
                        }
                        @media only screen and (max-width: 650px){
                            right: -56%;
                        }
                        @media only screen and (max-width: 575px){
                            right: -30%;
                        }
                        @media only screen and (max-width: 475px){
                            right: -44%;
                            top: -17px;
                        }
                        @media only screen and (max-width: 375px){
                            right: -48%;
                        }
                        svg{
                            width: 40px;
                            @media only screen and (max-width: 767px){
                                width: 30px;
                            }
                        }
                    }
                    .ninjadash-overview-card__top--content{
                        .ninjadahs-overview-label{
                            display: block;
                            margin-bottom: 4px;
                            font-size: 15px;
                        }
                    }
                }
            }
        }
    }
    .ant-card-body{
        padding: 25px 25px !important;
        @media only screen and (max-width: 767px){
            padding: 20px !important;
        }
        @media only screen and (max-width: 575px){
            padding: 15px !important;
        }
        .ninjadash-overview-total {
            color: ${({ theme }) => theme[theme.mainContent]['gray-text']};
        }
        .ninjadash-overview-card{
            .ninjadash-overview-card__top{
                .ninjadash-overview-card__top--icon{
                    width: 60px;
                    height: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 10px;
                    @media only screen and (max-width: 767px){
                        width: 48px;
                        height: 48px;
                    }
                    div{
                        line-height: 1;
                    }
                    svg,
                    img{
                        width: 32px;
                        height: 32px;
                    }
                    &.ninjadash-primary{
                        background-color: ${({ theme }) => theme['primary-color']}15;
                        svg path,
                        i{
                            fill: ${({ theme }) => theme['primary-color']};
                        }
                    }
                    &.ninjadash-secondary{
                        background-color: ${({ theme }) => theme['secondary-color']}15;
                        svg path,
                        i{
                            fill: ${({ theme }) => theme['secondary-color']};
                        }
                    }
                    &.ninjadash-success{
                        background-color: ${({ theme }) => theme['success-color']}15;
                        svg path,
                        i{
                            fill: ${({ theme }) => theme['success-color']};
                        }
                    }
                    &.ninjadash-warning{
                        background-color: ${({ theme }) => theme['warning-color']}15;
                        svg path,
                        i{
                            fill: ${({ theme }) => theme['warning-color']};
                        }
                    }
                    &.ninjadash-info{
                        background-color: ${({ theme }) => theme['info-color']}15;
                        svg path,
                        i{
                            fill: ${({ theme }) => theme['info-color']};
                        }
                    }
                }
                .ninjadash-overview-card__top--content{
                    .ninjadash-overview-total{
                        font-size: 30px;
                        line-height: 1.45;
                        font-weight: 600;
                        margin-bottom: 0;
                        color: ${({ theme }) => theme[theme.mainContent]['dark-text']};
                        @media only screen and (max-width: 991px){
                            font-size: 24px;
                        }
                        @media only screen and (max-width: 767px){
                            font-size: 20px;
                        }
                    }
                    .ninjadahs-overview-label{
                        font-size: 16px;
                        font-weight: 400;
                        color: ${({ theme }) => theme[theme.mainContent]['gray-text']};
                        @media only screen and (max-width: 767px){
                            font-size: 15px;
                        }
                    }
                }
                &.ninjadash-overview-card-theme-2{
                    @media only screen and (min-width: 1200px) and (max-width: 1299px){
                        flex-wrap: wrap;
                        flex-direction: column;
                        .ninjadash-overview-card__top--icon{
                            order: 1 !important;
                            margin-bottom: 10px;
                        }
                        .ninjadash-overview-card__top--content{
                            order: 2;
                        }
                    }
                    .ninjadash-overview-card__top--icon{
                        order: 2;
                    }
                }
            }
            .ninjadash-overview-card__bottom{
                margin-top: 12px;
                .ninjadash-overview-status{
                    display: inline-flex;
                    align-items: center;
                    width: 100%;
                    padding: 0 10px;
                    min-height: 46px;
                    border-radius: 8px;
                    background-color: ${({ theme }) => theme[theme.mainContent]['status-background']};
                    @media only screen and (max-width: 1399px){
                        flex-wrap: wrap;
                        padding-top: 5px;
                        padding-bottom: 8px;
                    }
                    span{
                        font-size: 14px;
                    }
                    .ninjadash-status-label{
                        ${({ theme }) => (!theme.rtl ? 'margin-left' : 'margin-right')}: 10px;
                        color: ${({ theme }) => theme[theme.mainContent]['gray-light-text']};
                    }
                    .ninjadash-status-rate{
                        display: flex;
                        align-items: center;
                        font-weight: 500;
                        svg,
                        img{
                            width: 20px;
                            ${({ theme }) => (!theme.rtl ? 'margin-right' : 'margin-left')}: -1px;
                        }
                        .unicon{
                            line-height: 0;
                        }
                    }
                    &.ninjadash-status-upward{
                        .ninjadash-status-rate{
                            color: ${({ theme }) => theme['success-color']};
                            svg{
                                fill: ${({ theme }) => theme['success-color']};
                            }
                        }
                    }
                    &.ninjadash-status-downward{
                        .ninjadash-status-rate{
                            color: ${({ theme }) => theme['danger-color']};
                            svg{
                                fill: ${({ theme }) => theme['danger-color']};
                            }
                        }
                    }
                }
            }
        }
    }
    &.ninjadash-overview-card-support{
        .ant-card-body{
            padding: 40.5px 25px !important;
        }
    }
`;
const BlogCardStyleWrap = Styled.figure `
    .ninjadash-blog{
        padding: 25px;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(173,181,217,.05);
        margin-bottom: 25px;
        background-color: ${({ theme }) => theme[theme.mainContent]['white-background']};
        &:hover{
            .ninjadash-blog-thumb{
                &:after{
                    height: 100%;
                }
            }
        }
        .ninjadash-blog-thumb{
            position: relative;
            &:after{
                position:  absolute;
                ${({ theme }) => (!theme.rtl ? 'left' : 'right')}: 0;
                top: 0;
                width: 100%;
                height: 0%;
                content: '';
                border-radius: 10px;
                transition: .35s;
                background-color: ${({ theme }) => theme['dark-color']}15;
            }
        }
        &.ninjadash-blog-style-3,
        &.ninjadash-blog-style-2{
            padding: 0px;
            .ninjadash-blog__title{
                margin: 15px 0 12px;
            }
            figcaption{
                padding: 0 25px 25px;
            }
            .ninjadash-blog-thumb{
                &:after{
                    border-radius: 10px 10px 0 0;
                }
            }
            .ninjadash-blog__image{
                border-radius: 10px 10px 0 0;
            }
        }
        .ninjadash-blog__image{
            width: 100%;
            border-radius: 10px;
        }
        .ninjadash-blog-meta{
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 10px;
            &.ninjadash-blog-meta-theme-3{
                justify-content: flex-start;
                margin: 7px -3px -3px;
                @media only screen and (max-width: 575px){
                    flex-wrap: wrap;

                }
                .ninjadash-blog-meta__single{
                    position: relative;
                    margin: 3px;
                    &:before{
                        position: absolute;
                        ${({ theme }) => (!theme.rtl ? 'left' : 'right')}: 0;
                        top: calc(50% - 4px);
                        width: 4px;
                        height: 4px;
                        border-radius: 50%;
                        background-color: ${({ theme }) => theme[theme.mainContent]['light-text']};
                    }
                    &:not(:first-child){
                        ${({ theme }) => (!theme.rtl ? 'padding-left' : 'padding-right')}: 10px;
                        &:before{
                            content: '';
                        }
                    }
                }
            }
        }
        .ninjadash-blog-meta__single{
            display: inline-block;
            font-size: 15px;
            color: ${({ theme }) => theme[theme.mainContent]['gray-text']};
        }
        .ninjadash-blog__title{
            font-size: 20px;
            font-weight: 600;
            margin: 10px 0 5px;
            a{
                color: ${({ theme }) => theme[theme.mainContent]['dark-text']};
                &:hover{
                    color: ${({ theme }) => theme['primary-color']};
                }
            }
        }
        .ninjadash-blog__text{
            font-size: 16px;
            margin-bottom: 15px;
            color: ${({ theme }) => theme[theme.mainContent]['gray-text']};
        }
        .ninjadash-blog__bottom{
            display: flex;
            justify-content: space-between;
        }
        .ninjadash-blog__author{
            .ninjadash-blog__author-img{
                max-width: 32px;
                border-radius: 50%;
            }
            .ninjadash-blog__author-name{
                font-size: 15px;
                ${({ theme }) => (theme.rtl ? 'margin-right' : 'margin-left')}: 10px;
                color: ${({ theme }) => theme[theme.mainContent]['gray-text']};
            }
        }
        .ninjadash-blog__meta{
            margin: 0;
            padding: 0;
            display: flex;
            align-items: center;
            margin: -9px;
            .ninjadash-blog__meta--item{
                margin: 9px;
                span{
                    font-size: 13px;
                    display: flex;
                    align-items: center;
                    line-height: 1;
                    color: ${({ theme }) => theme[theme.mainContent]['gray-text']};
                    svg{
                        width: 12px;
                        height: 12px;
                        ${({ theme }) => (!theme.rtl ? 'margin-right' : 'margin-left')}: 4px;
                        fill: ${({ theme }) => theme[theme.mainContent]['gray-text']};
                    }
                }
            }
        }
    }
`;

const OverviewCardMeshWrap = Styled.div`
    &.ninjadash-overview-card-single{
        position: relative;
        margin-bottom: 25px;
        &:not(:last-child){
            &:after{
                position: absolute;
                width: 1px;
                height: 70px;
                ${({ theme }) => (!theme.rtl ? 'right' : 'left')}: -60px;
                top: 50%;
                transform: translateY(-50%);
                content: '';
                background-color: ${({ theme }) => theme[theme.mainContent]['light-border']};
            }
        }
				@media only screen and (max-width: 1399px){
					flex: 0 0 50% !important;
					&:not(:last-child){
            &:after{
							content: none;
						}
					}
				}
				@media only screen and (max-width: 575px){
					flex: 0 0 100% !important;
				}
        .ant-card{
            border-radius: 0px;
            background-color: unset;
        }
        &:first-child{
            .ant-card{
                border-radius: 10px 0 0 10px;
            }
        }
        &:last-child{
            .ant-card{
                border-radius: 0 10px 10px 0;
            }
        }
        &:not(:last-child){
            .ninjadash-overview-card{
                position: relative;
                &:after{
                    position: absolute;
                    ${({ theme }) => (!theme.rtl ? 'right' : 'left')}: 0;
                    top: 0;
                    width: 1px;
                    height: 100%;
                    content: '';
                    background-color: ${({ theme }) => theme[theme.mainContent].borderLight};
                }
            }
        }
    }

    .ninjadash-overview-card{
        display: flex;
        .ninjadash-overview-card__left{
            .ninjadash-overview-card__left--icon{
                display: flex;
                align-items: center;
                justify-content: center;
                width: 70px;
                height: 70px;
                border-radius: 14px;
                ${({ theme }) => (!theme.rtl ? 'margin-right' : 'margin-left')}: 25px;
                >div{
                    line-height: 1;
                }
                svg{
                    width: 28px;
                    height: auto;
                }
                &.ninjadash-primary{
                    background-color: ${({ theme }) => theme['primary-color']}15;
                    svg path,
                    i{
                        fill: ${({ theme }) => theme['primary-color']};
                        color: ${({ theme }) => theme['primary-color']};
                    }
                }
                &.ninjadash-secondary{
                    background-color: ${({ theme }) => theme['secondary-color']}15;
                    svg path,
                    i{
                        fill: ${({ theme }) => theme['secondary-color']};
                        color: ${({ theme }) => theme['secondary-color']};
                    }
                }
                &.ninjadash-success{
                    background-color: ${({ theme }) => theme['success-color']}15;
                    svg path,
                    i{
                        fill: ${({ theme }) => theme['success-color']};
                        color: ${({ theme }) => theme['success-color']};
                    }
                }
                &.ninjadash-warning{
                    background-color: ${({ theme }) => theme['warning-color']}15;
                    svg path,
                    i{
                        fill: ${({ theme }) => theme['warning-color']};
                        color: ${({ theme }) => theme['warning-color']};
                    }
                }
                &.ninjadash-info{
                    background-color: ${({ theme }) => theme['warning-color']}15;
                    svg path,
                    i{
                        fill: ${({ theme }) => theme['info-color']};
                        color: ${({ theme }) => theme['info-color']};
                    }
                }
                &.ninjadash-danger{
                    background-color: ${({ theme }) => theme['danger-color']}15;
                    svg path,
                    i{
                        fill: ${({ theme }) => theme['danger-color']};
                        color: ${({ theme }) => theme['danger-color']};
                    }
                }
            }
        }
        .ninjadash-overview-card__right{
            display: flex;
            .ninjadash-overview-card__right--content{
                ${({ theme }) => (!theme.rtl ? 'margin-right' : 'margin-left')}: 25px;
                .ninjadash-overview-total{
                    font-size: 30px;
                    line-height: 1.2;
                    font-weight: 600;
                    margin-bottom: 0;
                    color: ${({ theme }) => theme[theme.mainContent]['dark-text']};
                    @media only screen and (max-width: 480px){
                        font-size: 20px;
                    }
                }
                .ninjadahs-overview-label{
                    font-size: 16px;
                    color: ${({ theme }) => theme[theme.mainContent]['gray-text']}
                }
            }
            .ninjadash-overview-status{
                margin-top: 6px;
                &.ninjadash-status-growth{
                    .ninjadash-status-rate{
                        color: ${({ theme }) => theme['success-color']};
                        svg{
													fill: ${({ theme }) => theme['success-color']};
												}
                    }
                }
                &.ninjadash-status-down{
                    .ninjadash-status-rate{
                        color: ${({ theme }) => theme['danger-color']};
                        svg{
													fill: ${({ theme }) => theme['danger-color']};
												}
                    }
                }
                .ninjadash-status-rate{
                    display: flex;
                    align-items: center;
                    font-size: 14px;
                    font-weight: 500;
                    svg{
                        width: 20px;
                        height: 18px;
                    }
                }
            }
        }
    }
`;
const InfoCardStyle = Styled.article `
    ${({ theme, type }) => `
        background-color: ${theme[theme.mainContent]['white-background']};
        padding: 14px 15px;
        text-align: center;
        border-radius: 10px;
        margin-bottom: 25px;
        box-shadow: 0px 5px 20px ${theme['extra-light-color']}05;

        .ninjadash-infocard-icon {
            width: 60px;
            height: 60px;
            background-color: ${theme[`${type}-color`]}20;
            color: ${theme[`${type}-color`]};
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            margin: 2px auto 10px;
            border-radius: 8px;
            svg{
                width: 34px;
                height: 32px;
                fill: ${theme[`${type}-color`]};
            }

        }

        .ninjadash-infocard-text {
            font-size: 16px;
            margin-bottom: 0;
            color: ${theme[theme.mainContent]['gray-text']};
        }
        .ninjadash-infocard-label {
            font-size: 30px;
            font-weight: 500;
            margin-bottom: 4px;
            color: ${theme[theme.mainContent]['dark-text']};
        }
    `}
`;
const NewsletterStyle = Styled.figure `
    ${({ theme }) => `
        background-color: ${theme[theme.mainContent]['white-background']};
        padding: 0;
        text-align: ${!theme.rtl ? 'left' : 'right'};
        border-radius: 10px;
        box-shadow: 0px 5px 20px ${theme['extra-light-color']}05;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        margin-bottom: 25px;
        min-height: 160px;
        @media only screen and (max-width: 1299px){
            flex-wrap: wrap;
            figcaption{
                margin: 15px 0 0 0;
            }
        }
        @media only screen and (max-width: 480px){
            flex-wrap: wrap;
            justify-content: center;
            text-align:center;
            figcaption{
                margin: 20px 0 0 0 !important;
            }
        }
        .newsletter-shape{
            width: 150px;
            height: 150px;
            ${theme.rtl ? 'padding-left' : 'padding-right'} : 15px;
            img{
                max-width: 100%;
            }
        }
        .newsletter-content{
            padding: 25px;
            h4 {
                font-size: 20px;
                font-weight: 600;
                line-height: 1;
                margin: 0 0 10px;
                color: ${theme[theme.mainContent]['dark-text']};
            }
            p {
                font-size: 15px;
                margin-bottom: 15px;
                color: ${theme[theme.mainContent]['gray-text']}
            }
        }
    `}
`;
const ProfileCardWrapper = Styled.figure `
  ${({ theme }) => `
    width: 100%;
    min-height: 390px;
    background-color: ${theme[theme.mainContent]['white-background']};
    text-align: center;
    border-radius: 10px;
    box-shadow: 0px 5px 20px ${theme['extra-light-color']}05;
    position: relative;
    @media only screen and (max-width: 991px){
        min-height: auto;
        margin-bottom: 25px;
    }

    figcaption {
        .ninjadash-profile-top-img {
            position: static;
            width: 100%;
        }
    }

    .ninjadash-profile-content{
        padding: 0 0 54px;
        margin-top: -75px;
        .ninjadash-profile-content__img{
            margin-bottom: 10px;
            img{
                padding: 5px;
                border-radius: 50%;
                background-color: #fff;
            }
        }
        .ninjadash-profile-name{
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 2px;
            color: ${theme[theme.mainContent]['dark-text']};
        }
        .ninjadash-profile-text{
            margin-bottom: 18px;
            color: ${theme[theme.mainContent]['gray-text']};
        }
    }
    .ninjadash-profile-socials{
        display: flex;
        align-items: center;
        justify-content: center !important;
        margin: -5px;
        li{
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            border-radius: 6px;
            margin: 5px;
            span.fa,
            svg{
                fill: #fff;
								color: #fff;
            }
            &.ninjadash-facebook{
                background-color: #3B5998;
            }
            &.ninjadash-twitter{
                background-color: #209AE9;
            }
            &.ninjadash-dribble{
                background-color: #8231D3;
            }
            a{
                line-height: 1;
            }
        }
    }

  `}
`;
export { OverviewCard, ProfileCardWrapper, CourseCardWrap, BlogCardStyleWrap, OverviewCardMeshWrap, InfoCardStyle, NewsletterStyle };
