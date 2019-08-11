import * as React from 'react';

import * as styles from './styles.less';

interface Button {
  label: string;
  onClick?(): void;
}
interface Props {
  buttons?: Button[];
  content?: string;
}

class PopUp extends React.Component<Props, {}> {
  public static defaultProps = {
    content: 'This is some PopUp Text.',
  };

  public render() {
    const { buttons, content } = this.props;
    return (
      <div className={styles.popUpContainer}>
        <div className={styles.popUp}>
          <p>{content}</p>
          <div className={styles.buttonsContainer}>
            {buttons && buttons.map((button, i) => <button key={i} onClick={button.onClick}>{button.label}</button>)}
          </div>
        </div>
      </div>
    );
  }
}

export default PopUp;