import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const Container = styled(SafeAreaView)`
  flex: 1;
  align-items: center;
  background-color: ${({ theme }) => theme.COLORS.GRAY_600};
  /* justify-content: center; */
`;

export const Title = styled.Text`
  color: #fff;
  font-size: 32px;
`
