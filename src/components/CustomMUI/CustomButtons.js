import React from 'react';
import './CustomMUI.css'
import { Button } from '@mui/material';

export function PrimaryButton(props) {
  const { className, children, ...otherProps } = props;
  return (
    <Button
      disableElevation variant='contained' fullWidth size={props.size || 'large'}
      className={className + ' primary-btn' || 'primary-btn'}
      {...otherProps}
    >
      {children}
    </Button>
  );
};

export function SecondaryButton(props) {
  const { className, children, ...otherProps } = props;
  return (
    <Button
      disableElevation variant='outlined' fullWidth size='large'
      className={className + ' primary-hollow-btn' || 'primary-hollow-btn'}
      {...otherProps}
    >
      {children}
    </Button>
  );
};

export function DeleteButton(props) {
  const { className, children, ...otherProps } = props;
  return (
    <Button
      disableElevation variant='contained' fullWidth size='large'
      className={className + ' delete-btn' || 'delete-btn'}
      {...otherProps}
    >
      {children}
    </Button>
  );
};

export function SmallBlueButton(props) {
  const { className, children, ...otherProps } = props;
  return (
    <Button
      disableElevation variant='contained' size='small'
      className={className + ' small-blue-btn' || 'small-blue-btn'}
      {...otherProps}
    >
      {children}
    </Button>
  );
}