import React from 'react';
import cx from 'classnames';
import { CardContext } from '../../card-context';
import styles from './footer.module.scss';

interface Footer extends React.HTMLAttributes<HTMLDivElement> {
  children: string | React.ReactNode;
  className?: string;
}

const Footer = ({ children, className, ...restOfProps }: Footer) => {
  return (
    <CardContext.Consumer>
      {() => {
        const footerClasses = cx(styles.footer, {}, className);

        return (
          <div className={footerClasses} {...restOfProps}>
            {children}
          </div>
        );
      }}
    </CardContext.Consumer>
  );
};

export { Footer };