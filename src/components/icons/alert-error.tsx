import React from 'react';
import { Icon } from '../typings';

const AlertError = ({
  color = 'currentColor',
  size = 24,
  ...restOfProps
}: Icon) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      stroke={color}
      strokeWidth="0"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...restOfProps}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.5563 1L23 7.44365V16.5563L16.5563 23H7.44365L1 16.5563V7.44365L7.44365 1H16.5563ZM15.7279 3H8.27208L3 8.27208V15.7279L8.27208 21H15.7279L21 15.7279V8.27208L15.7279 3ZM8.70711 16.7071L12 13.4142L15.2929 16.7071L16.7071 15.2929L13.4142 12L16.7071 8.70711L15.2929 7.29289L12 10.5858L8.70711 7.29289L7.29289 8.70711L10.5858 12L7.29289 15.2929L8.70711 16.7071Z"
      />
    </svg>
  );
};

export { AlertError };
