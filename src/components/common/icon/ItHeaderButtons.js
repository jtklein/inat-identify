import * as React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { HeaderButtons, HeaderButton, Item } from 'react-navigation-header-buttons';

// define IconComponent, color, sizes and OverflowIcon in one place
const MaterialHeaderButton = props => (
  <HeaderButton
    {...props}
    IconComponent={MaterialIcons}
    iconSize={23}
    color="#FFFFFF"
  />
);

export const ItHeaderButtons = props => (
  <HeaderButtons
    HeaderButtonComponent={MaterialHeaderButton}
    OverflowIcon={<MaterialIcons name="more-vert" size={23} color="#FFFFFF" />}
    {...props}
  />
);
export const HeaderItem = Item;
