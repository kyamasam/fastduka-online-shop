import Styled from 'vue3-styled-components';

const H1 = Styled.h1`
  font-size: 30px;
  font-weight: 600;
  line-height: 38px;
  color: ${({theme}) => theme[theme.mainContent]['dark-text']};
`;

const H2 = Styled.h1`
  font-size: 24px;
  font-weight: 600;
  line-height: 30px;
  color: ${({theme}) => theme[theme.mainContent]['dark-text']};
`;

const H3 = Styled.h1`
  font-size: 22px;
  font-weight: 600;
  line-height: 27px;
  color: ${({theme}) => theme[theme.mainContent]['dark-text']};
`;

const H4 = Styled.h1`
  font-size: 20px;
  font-weight: 600;
  line-height: 24px;
  color: ${({theme}) => theme[theme.mainContent]['dark-text']};
`;

const H5 = Styled.h1`
  font-size: 18px;
  font-weight: 600;
  line-height: 22px;
  color: ${({theme}) => theme[theme.mainContent]['dark-text']};
`;

const H6 = Styled.h1`
  font-size: 16px;
  font-weight: 600;
  line-height: 20px;
  color: ${({theme}) => theme[theme.mainContent]['dark-text']};
`;

export { H1, H2, H3, H4, H5, H6 };
