import { ContainerProps } from '@mantine/core';
import { MasonryContainer } from '~/components/MasonryColumns/MasonryContainer';
import React from 'react';

export const HomeBlockWrapper = ({ children, ...props }: Props) => {
  return <MasonryContainer {...props}>{children}</MasonryContainer>;
};

type Props = ContainerProps;
