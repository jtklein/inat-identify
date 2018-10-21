import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';

import { colors } from '../../../styles';

/**
 * The primary styled component to use a MaterialIcon from Expo.
 */
const ItMaterial = (props) => {
  const { primaryColor } = colors;
  const { size, color } = props;
  return (
    <MaterialIcons {...props} size={size || 24} color={color || primaryColor} />
  );
};

export { ItMaterial };
