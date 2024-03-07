import { AppDispatch } from '@/libs/create-store.ts';
import {
  Avatar,
  Button,
  Flex,
  FormControl,
  Stack,
  Text,
  Textarea,
  TextProps,
} from '@chakra-ui/react';
import { nanoid } from '@reduxjs/toolkit';
import { ChangeEvent, FormEvent, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { createAddPostFormViewModel } from '@/components/AddPostForm/add-post-form.viewmodel.ts';

interface AddPostFormElements extends HTMLFormControlsCollection {
  text: HTMLTextAreaElement;
}

interface AddPostField extends HTMLFormElement {
  readonly elements: AddPostFormElements;
}

export const AddPostForm = ({
  placeholder,
  timelineId,
}: {
  placeholder: string;
  timelineId: string;
}) => {
  const [charactersCount, setCharactersCount] = useState(0);
  const dispatch = useDispatch<AppDispatch>();
  const {
    postMessage,
    handleTextChange,
    canSubmit,
    remaining,
    inputBackgroundColor,
    charCounterColor,
  } = createAddPostFormViewModel({
    dispatch,
    messageId: nanoid(5),
    timelineId,
    maxCharacters: 100,
    charactersCount,
    setCharactersCount,
  });
  const textRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (event: FormEvent<AddPostField>) => {
    event.preventDefault();

    postMessage(event.currentTarget.elements.text.value);

    if (textRef.current) {
      textRef.current.value = '';
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack direction="row" spacing="4">
        <Link to={`/`}>
          <Avatar src="https://picsum.photos/200?random=pierre" boxSize="12" />
        </Link>
        <FormControl id="text">
          <Textarea
            ref={textRef}
            rows={3}
            resize="none"
            placeholder={placeholder}
            bgColor={inputBackgroundColor}
            name="text"
            required
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
              handleTextChange(event.target.value)
            }
          />
        </FormControl>
      </Stack>
      <Flex direction="row-reverse" py="4" px={{ base: '4', md: '6' }}>
        <Button
          isDisabled={!canSubmit}
          colorScheme="twitter"
          type="submit"
          variant="solid"
        >
          Post message
        </Button>
        <MaxCharCounter
          alignSelf={'center'}
          mr={5}
          remaining={remaining}
          color={charCounterColor}
        />
      </Flex>
    </form>
  );
};

const MaxCharCounter = ({
  remaining,
  ...textProps
}: {
  remaining: number;
} & TextProps) => <Text {...textProps}>{remaining}</Text>;
