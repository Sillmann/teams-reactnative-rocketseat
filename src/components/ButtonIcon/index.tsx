import { TouchableOpacityProps } from 'react-native';

import { Container, Icon, ButtonIconTypeStylesProps } from './styles';

import { MaterialIcons } from '@expo/vector-icons';

type Props = TouchableOpacityProps & {
  icon: keyof typeof MaterialIcons.glyphMap;
  type?: ButtonIconTypeStylesProps;
}

export function ButtonIcon({icon, type = 'PRIMARY', ...rest}: Props){
  return (
    <Container>
      <Icon 
        name={icon}
        type="PRIMARY"
      />
    </Container>
  )
}