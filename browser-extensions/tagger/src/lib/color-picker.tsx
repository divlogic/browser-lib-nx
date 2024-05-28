import { FormControl, FormLabel, Switch, Text, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { TwitterPicker } from 'react-color';

/* eslint-disable-next-line */
export interface ColorPickerProps {
  label: string;
  startingColor: string;
  defaultPresets: boolean;
  defaultcolors: string[];
}

export function ColorPicker({
  label = 'Color Picker',
  startingColor = 'black',
  defaultPresets = true,
  defaultColors = [],
}: ColorPickerProps) {
  const [presets, setPresets] = useState(defaultPresets);
  const [value, setValue] = useState('');
  return (
    <FormControl>
      <VStack>
        <FormLabel>{label}</FormLabel>
        <TwitterPicker
          triangle="hide"
          onChangeComplete={(color) => {
            setValue(color.hex);
          }}
        ></TwitterPicker>
        <VStack>
          <Text>Manual | Presets</Text>
          <Switch
            isChecked={presets}
            onChange={(e) => {
              e.preventDefault();
              setPresets(!presets);
            }}
          ></Switch>
        </VStack>
      </VStack>
    </FormControl>
  );
}

export default ColorPicker;
