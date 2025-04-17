import Styled from 'vue3-styled-components';
import { PageHeader } from 'ant-design-vue';

const PageHeaderStyle = Styled(PageHeader)`

  &.ant-page-header {
    background-color: ${({ theme }) => theme[theme.mainContent]['main-background']} !important;
  }
  .page-header-actions button.ant-btn-white svg {
    width: 12px;
    height: 12px;
    ${({ theme }) => (theme.rtl ? 'margin-left' : 'margin-right')}: 2px;
    fill: ${({ theme }) => theme['primary-color']};
    position: relative;
    top: -1px;
  }
  i +span, svg +span, img +span {
      ${({ theme }) => (!theme.rtl ? 'margin-left' : 'margin-right')}: 6px;
  }
  .ant-page-header-heading-title{
      color: ${({ theme }) => theme[theme.mainContent]['gray-text']};
  }
  /* Main Page Header Style */
  &.ninjadash-pageheader-with-back{
    &.ninjadash-page-header-main{
      padding: 34px 30px 18px;
    }
    .ant-page-header-heading-title{

      .back-link{
        display: inline-block;
        margin-top: 10px;
        font-size: 14px;
        font-weight: 500;
        a{
          color: ${({ theme }) => theme[theme.mainContent]['gray-text']};
          display: flex;
          align-items: center;
          .unicon {
            transform: ${({ theme }) => (!theme.rtl ? 'rotate(0deg)' : 'rotate(180deg)')};
          }
          &:hover{
            color: ${({ theme }) => theme['primary-color']};
          }
        }
      }
    }
  }
  &.ninjadash-page-header-main{
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 34px 30px 24px;
    @media only screen and (max-width: 991px){
      padding: 34px 15px 24px;
    }
    @media only screen and (max-width: 767px){
      flex-direction: column;
      align-items: center;
    }
    .ant-page-header-heading-left{
      @media only screen and (max-width: 575px){
        flex-wrap: wrap;
      }
    }
    .ant-page-header-heading-title{
      @media only screen and (max-width: 767px){
        margin-right: 0;
        ${({ theme }) => (theme.rtl ? 'margin-left' : 'margin-right')}: 0;
      }
      @media only screen and (max-width: 575px){
        flex: 0 0 100%;
      }
    }
    .ant-page-header-heading-sub-title{
      @media only screen and (max-width: 575px){
        flex: 0 0 100%;
        margin-right: 0;
        text-align: center;
      }
    }
    .ant-breadcrumb{
      order: 2;
      position: relative;
      top: 10px;
      display: flex;
      align-items: center;
			@media only screen and (max-width: 575px){
				padding-bottom: 10px;
			}
      >span{
        position: relative;
        ${({ theme }) => (theme.rtl ? 'padding-right' : 'padding-left')}: 10px;
        color: ${({ theme }) => theme[theme.mainContent]['gray-text']};
        display: inline-flex;
        &:first-child{
          ${({ theme }) => (theme.rtl ? 'padding-right' : 'padding-left')}: 20px;
          .ant-breadcrumb-link{
            svg{
              width: 18px;
              fill: ${({ theme }) => theme[theme.mainContent]['light-text']};
              margin-right: 4px;
              height: 18px;
            }
            &:hover{
              &:before{
                color: ${({ theme }) => theme['primary-color']};
              }
              a{
                color: ${({ theme }) => theme['primary-color']};
              }
            }
            a{
              color: ${({ theme }) => theme[theme.mainContent]['gray-text']};
            }
            &:after{
              display: none;
            }
          }
        }

        &:last-child{
          display: inline-block;
          .ant-breadcrumb-link{
            color: ${({ theme }) => theme[theme.mainContent]['light-text']};
            &:hover{
              &:after{
                background-color: ${({ theme }) => theme[theme.mainContent]['light-text']};
              }
            }
          }
        }

        .ant-breadcrumb-link{
          display: inline-flex;
          align-items: center;
          &:after{
            position: absolute;
            ${({ theme }) => (theme.rtl ? 'right' : 'left')}: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 4px;
            height: 4px;
            content: '';
            background-color: ${({ theme }) => theme[theme.mainContent]['light-text']};
            border-radius: 50%;
          }
        }

        .ant-breadcrumb-separator{
          display: none;
        }
      }
      span + span{
        ${({ theme }) => (theme.rtl ? 'margin-right' : 'margin-left')}: 8px;
      }
      .ant-breadcrumb-link{
        &:hover{
          &:after{
            background-color: ${({ theme }) => theme['primary-color']};
          }
          a{
              color: ${({ theme }) => theme['primary-color']};
          }
        }
        a,
        span{
          font-size: 14px;
          color: ${({ theme }) => theme[theme.mainContent]['light-text']};
        }
      }
      &+.ant-page-header-heading {
        margin-top: 4px;
        margin-bottom: 4px;
        @media only screen and (max-width: 767px){
          margin-bottom: 0;
        }
      }
    }

    .ant-page-header-heading{
      .ant-page-header-heading-left{
        margin: 0;
      }
      .ant-page-header-heading-title{
        font-size: 22px;
        font-weight: 600;
        color: ${({ theme }) => theme[theme.mainContent]['dark-text']} !important;
        h1,
        h2,
        h3,
        h4,
        h5,
        h6{
          font-weight: 600;
          margin-bottom: 0;
        }
      }
    }
  }

  &.ninjadash-page-header-main .ant-select-selector .ant-select-selection-search .ant-input-affix-wrapper {
    background-color: ${({ theme }) => theme[theme.mainContent]['white-background']} !important;
    .ant-input{
      background-color: ${({ theme }) => theme[theme.mainContent]['white-background']} !important;
    }
  }

  .ant-input-suffix {
    svg {
      fill: ${({ theme }) => theme[theme.mainContent]['dark-text']}
    }
  }
`;

const HeaderWrapper = Styled.div`
  background: ${({ theme, bgColor }) => bgColor || theme[theme.mainContent]['main-background']}};
`;

export { PageHeaderStyle, HeaderWrapper };
