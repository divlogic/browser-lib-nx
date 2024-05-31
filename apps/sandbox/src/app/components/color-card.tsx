import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  HStack,
  Tag,
  Text,
  VStack,
  keyframes,
} from '@chakra-ui/react';

interface ColorCardProps {
  textColor: string;
  backgroundColor: string;
  constrastRatio: number;
  colorContrastAPCA: number;
}

export function ColorCard(props: ColorCardProps) {
  let rating;
  if (props.constrastRatio > 7) {
    rating = 'green';
  } else if (props.constrastRatio > 4.5) {
    rating = 'yellow';
  } else {
    rating = 'red';
  }

  const shine = keyframes({
    '0%': {
      left: '0%',
    },
    '100%': {
      left: '180%',
    },
  });
  const before = {
    content: '""',
    display: 'block',
    position: 'absolute',
    background: 'rgba(255, 255, 255, 0.5)',
    width: '60px',
    height: '100%',
    top: 0,
    filter: 'blur(30px)',
    transform: 'translateX(-100px) skewX(-15deg)',
    animation: `${shine} 1s`,
    left: '180%',
  };

  const after = {
    content: '""',
    display: 'block',
    position: 'absolute',
    background: 'rgba(255, 255, 255, 0.2)',
    width: '30px',
    height: '100%',
    top: '0',
    filter: 'blur(5px)',
    transform: 'translateX(-100px) skewX(-15deg)',
    left: '180%',
    animation: `${shine} 1s`,
  };
  return (
    <Card
      position={'relative'}
      overflow={'hidden'}
      transition={'0.6s'}
      backgroundSize={'400% 400%'}
      backgroundColor={rating}
      align={'center'}
      flexDirection={'column'}
      justify={'center'}
      variant="elevated"
      borderColor={rating}
      borderWidth={'3px'}
      size="sm"
      width={'max-content'}
      maxW={'250px'}
      bgClip={'padding-box'}
      boxShadow={`${rating} 0px 1px 3px 3px, grey 0px 1px 8px 3px`}
      _before={before}
      _after={after}
    >
      <CardHeader
        borderBlockStartStyle={'groove'}
        borderBlockEndStyle={'groove'}
        borderTopRadius={'inherit'}
        width="100%"
        backgroundColor={'white'}
      >
        <VStack>
          <Text align={'start'} backgroundColor={'white'}>
            WCAG 2.1 contrast Contrast Ratio: {props.constrastRatio}
          </Text>
          <Text
            align={'start'}
            backgroundColor={
              Math.abs(props.colorContrastAPCA) > 90 ? 'greenyellow' : 'white'
            }
          >
            APCA Contrast Ratio: {Math.abs(props.colorContrastAPCA)}
          </Text>
        </VStack>
      </CardHeader>
      <CardBody
        backgroundColor={props.backgroundColor}
        width="100%"
        textColor={props.textColor}
      >
        <VStack>
          <Text>{props.textColor} text </Text>
          <Text>on</Text>
          <Text>{props.backgroundColor} background</Text>
        </VStack>
      </CardBody>
      <CardFooter
        width="100%"
        backgroundColor={'white'}
        borderBottomRadius={'inherit'}
      >
        <HStack>
          <VStack align="start">
            <Text>Foreground</Text>
            <Text>{props.textColor}</Text>
            <Tag backgroundColor={props.textColor}></Tag>
          </VStack>
          <Divider orientation="vertical" />
          <VStack align={'start'}>
            <Text>Background</Text>
            <Text>{props.backgroundColor}</Text>
            <Tag backgroundColor={props.backgroundColor}></Tag>
          </VStack>
        </HStack>
      </CardFooter>
    </Card>
  );
}
