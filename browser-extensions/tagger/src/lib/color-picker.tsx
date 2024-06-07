import {
  Alert,
  AlertIcon,
  Box,
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
  Switch,
  Text,
  UseRadioProps,
  VStack,
  useRadio,
  useRadioGroup,
} from '@chakra-ui/react';
import React, { useMemo, useState } from 'react';
import { generateAccessibleColor } from '../color-utils';

/* eslint-disable-next-line */
export interface ColorPickerProps {
  label: string;
  name: string;
  startingColor?: string;
  defaultPresets?: boolean;
  defaultColors?: string[];
}

export function ColorPicker({
  label = 'Color Picker',
  name = 'name',
  startingColor = 'black',
  defaultPresets = true,
}: ColorPickerProps) {
  const [presets, setPresets] = useState(defaultPresets);
  const [value, setValue] = useState('');
  const defaultColors: string[] = useMemo((): string[] => {
    const colors = [0, 30, 45, 60, 100, 210, 270, 320];
    return colors
      .map((hue) => {
        const bgColor = generateAccessibleColor(startingColor, hue);
        if (bgColor === null) {
          return null;
        }
        const bgColorString = bgColor.to('srgb').toString({ format: 'hex' });
        return bgColorString;
      })
      .filter((color): color is string => {
        return typeof color === 'string';
      });
  }, [startingColor]);
  return (
    <FormControl>
      <VStack>
        <FormLabel>{label}</FormLabel>
        <Text>Current value: {value}</Text>
        {presets ? (
          defaultColors.length > 1 ? (
            <ColorRadioGroup
              colors={defaultColors}
              name={name}
              onChange={setValue}
            ></ColorRadioGroup>
          ) : (
            <Alert status="warning">
              <AlertIcon /> Could not generate presets. Trying a darker or
              lighter color should give better results.
            </Alert>
          )
        ) : (
          <Input
            onChange={(e) => {
              e.preventDefault();
              setValue(e.target.value);
            }}
          ></Input>
        )}
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

type RadioColorProps = UseRadioProps & {
  children: React.ReactElement | string;
};
// 1. Create a component that consumes the `useRadio` hook
function RadioColor(props: RadioColorProps) {
  const { getInputProps, getRadioProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getRadioProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        backgroundColor={props.value}
        _checked={{
          borderColor: 'teal.600',
        }}
        _focus={{
          boxShadow: 'outline',
        }}
        px={5}
        py={3}
      >
        {props.children}
      </Box>
    </Box>
  );
}

type ColorRadioGroupProps = {
  colors: string[];
  name: string;
  defaultValue?: string;
  onChange: (value: string) => void;
};
function ColorRadioGroup({ colors, name, onChange }: ColorRadioGroupProps) {
  const { getRootProps, getRadioProps } = useRadioGroup({
    name,
    onChange,
  });

  const group = getRootProps();

  return (
    <SimpleGrid columns={4} gap={'.5em'} {...group}>
      {colors.map((color) => {
        const radio = getRadioProps({ color });
        return (
          <RadioColor key={color} value={color} {...radio}>
            {color}
          </RadioColor>
        );
      })}
    </SimpleGrid>
  );
}
