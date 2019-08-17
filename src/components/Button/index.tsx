import React from 'react';

import styles from './styles.less';

interface IButtonProps {
  className?: string;
  label?: string;
  onClick?(): void;
}

class Button extends React.Component<IButtonProps, {}> {
  public static defaultProps = {
    className: '',
    label: 'ok',
    onClick: () => { console.log("Button clicked"); },
  };

  public render() {
    const { className, label, onClick } = this.props;
    return (
      <div className={`${styles.button} ${className}`} onClick={onClick}>
        {label}
      </div>
    );
  }
}

export default Button;
