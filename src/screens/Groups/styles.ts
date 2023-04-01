import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  align-items: center;
  background-color: ${({ theme }) => theme.COLORS.GRAY_600};
  /* justify-content: center; */
`;

export const Title = styled.Text`
  color: #fff;
  font-size: 32px;
`
