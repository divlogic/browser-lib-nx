import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';

interface ColorCardProps {
  textColor: string;
  backgroundColor: string;
  constrastRatio: number;
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

  return (
    <Card color={props.textColor} variant="outline">
      <CardHeader borderTopRadius={'inherit'} backgroundColor={rating}>
        <VStack>
          <Text backgroundColor={'white'}>
            Contrast Ratio: {props.constrastRatio}
          </Text>
        </VStack>
      </CardHeader>
      <CardBody backgroundColor={props.backgroundColor}>
        <VStack>
          <Text>{props.textColor} </Text>
          <Text>on</Text>
          <Text>{props.backgroundColor}</Text>
        </VStack>
      </CardBody>
      <CardFooter>
        <HStack>
          <VStack>
            <Text>Foreground Color: </Text>
            <Text>{props.textColor}</Text>
          </VStack>
          <VStack>
            <Text>Background Color: </Text>
            <Text>{props.backgroundColor}</Text>
          </VStack>
        </HStack>
      </CardFooter>
    </Card>
  );
}
