import Styled from 'vue3-styled-components';

const Content = Styled.div`  
  a, .span {
      display: block;
      color: #888;
      padding: 6px 12px;
      text-align: ${({ theme }) => (theme.rtl ? 'right' : 'left')};
      span {
        ${({ theme }) => (theme.rtl ? 'padding-right' : 'padding-left')}: 12px;
      }
  }
  a:hover {
    background: ${({ theme }) => theme['primary-color']}10;
    color: ${({ theme }) => theme['primary-color']}
  }
  
`;
const Title = Styled.p`
  text-align: ${({ theme }) => (theme.rtl ? 'right' : 'left')};
  margin: 0;
`;

export { Content, Title };
