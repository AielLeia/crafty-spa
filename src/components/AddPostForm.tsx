import { AppDispatch } from '@/libs/create-store.ts';
import { postMessage } from '@/libs/timeline/usecases/post-message.usecase.ts';
import {
  Avatar,
  Button,
  Flex,
  FormControl,
  Stack,
  Textarea,
} from '@chakra-ui/react';
import { nanoid } from '@reduxjs/toolkit';
import { FormEvent, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

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
  const textRef = useRef<HTMLTextAreaElement>(null);
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = (event: FormEvent<AddPostField>) => {
    event.preventDefault();

    const messageId = nanoid(5);
    const text = event.currentTarget.elements.text.value;

    dispatch(postMessage({ messageId, timelineId, text }));

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
            name="text"
            required
          />
        </FormControl>
      </Stack>
      <Flex direction="row-reverse" py="4" px={{ base: '4', md: '6' }}>
        <Button colorScheme="twitter" type="submit" variant="solid">
          Post message
        </Button>
      </Flex>
    </form>
  );
};
