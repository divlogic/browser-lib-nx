import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  FormControl,
  FormLabel,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Text,
} from '@chakra-ui/react';
import Color from 'colorjs.io';
import { Dispatch, useEffect, useState } from 'react';
import { Action } from './color-generator-container';

export function ColorGenerator({
  onChange,
  defaults,
  title,
}: {
  onChange: ([number, number, number]) => void;
  defaults: { hue: number; saturation: number; lightness: number };
  title: string;
}) {
  const [hue, setHue] = useState(defaults?.hue ?? 180);
  const [saturation, setSaturation] = useState(defaults?.saturation ?? 50);
  const [lightness, setLightness] = useState(defaults?.lightness ?? 50);
  const color = new Color('hsl', [hue, saturation, lightness]);
  const colorHex = color.to('srgb').toString({ format: 'hex' });
  useEffect(() => {
    onChange([hue, saturation, lightness]);
  }, [hue, saturation, lightness]);
  return (
    <Card variant="outline" maxWidth="sm" width="100%">
      <CardHeader borderTopRadius={'inherit'}>
        <Text>{title}</Text>
        <Text backgroundColor={'white'}>Hex: {colorHex}</Text>
      </CardHeader>
      <CardBody>
        <FormControl>
          <FormLabel marginBottom={'2em'}>Hue</FormLabel>
          <Slider
            defaultValue={hue}
            min={0}
            max={360}
            onChange={(val) => {
              setHue(val);
            }}
          >
            <SliderMark value={hue} textAlign={'center'} mt="-10" ml="-5">
              {hue}
            </SliderMark>
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb></SliderThumb>
          </Slider>
        </FormControl>
        <FormControl>
          <FormLabel marginBottom={'2em'}>Saturation</FormLabel>
          <Slider
            defaultValue={saturation}
            min={0}
            max={100}
            onChange={(val) => {
              setSaturation(val);
            }}
          >
            <SliderMark
              value={saturation}
              textAlign={'center'}
              mt="-10"
              ml="-5"
            >
              {saturation}
            </SliderMark>
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb></SliderThumb>
          </Slider>
        </FormControl>
        <FormControl>
          <FormLabel marginBottom={'2em'}>Lightness</FormLabel>
          <Slider
            defaultValue={lightness}
            min={0}
            max={100}
            onChange={(val) => {
              setLightness(val);
            }}
          >
            <SliderMark value={lightness} textAlign={'center'} mt="-10" ml="-5">
              {lightness}
            </SliderMark>
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb></SliderThumb>
          </Slider>
        </FormControl>
      </CardBody>
      <CardFooter
        backgroundColor={colorHex}
        borderBottomRadius={'inherit'}
        height={'4rem'}
      ></CardFooter>
    </Card>
  );
}
