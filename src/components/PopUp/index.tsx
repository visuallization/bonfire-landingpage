import React from 'react';
import ReactMarkdown from 'react-markdown';

import Button from '../Button';

import styles from './styles.less';

interface IButton {
  label: string;
  onClick?(): void;
}

interface IPopUpProps {
  buttons?: IButton[];
  content?: string;
}

class PopUp extends React.Component<IPopUpProps, {}> {
  public static defaultProps = {
    content: 'This is some PopUp Text.',
  };

  public render() {
    const { buttons, content } = this.props;
    return (
      <div className={styles.popUpContainer}>
        <div className={styles.popUp}>
          <ReactMarkdown source={content} escapeHtml={false}/>
          <div className={styles.buttonsContainer}>
            {buttons && buttons.map((button, i) => <Button key={i} className={styles.button} onClick={button.onClick} label={button.label} />)}
          </div>
        </div>
      </div>
    );
  }
}

export default PopUp;