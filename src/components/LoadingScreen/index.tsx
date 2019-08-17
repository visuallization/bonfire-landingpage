import React from 'react';

import styles from './styles.less';

interface ILoadingScreenProps {
  className: string
}

class LoadingScreen extends React.Component<ILoadingScreenProps, any> {
  public static defaultProps = {
    className: ''
  }

  public render() {
    const { className } = this.props;
    return (
      <div className={`${styles.loadingScreen} ${className}`}>
        <div className="sk-folding-cube">
          <div className="sk-cube1 sk-cube" />
          <div className="sk-cube2 sk-cube" />
          <div className="sk-cube4 sk-cube" />
          <div className="sk-cube3 sk-cube" />
        </div>
      </div>
    );
  }
}

export default LoadingScreen;
