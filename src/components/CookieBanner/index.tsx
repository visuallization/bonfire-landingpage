import React from 'react';
import { Link } from "react-router-dom";

import Button from '../Button';

import styles from './styles.less';

interface ICookieBannerState {
  show: boolean;
}

class CookieBanner extends React.Component<{}, ICookieBannerState> {
  constructor (props: {}) {
    super(props);

    this.state = {
      show: false,
    };
  }

  public componentDidMount() {
    this.setState({ show: !(document.cookie.indexOf('bonfire-cookie-accepted') > -1) });
  }

  public render() {
    const { show } = this.state;

    if (show) {
      return (
        <div className={styles.cookieBanner}>
          This site uses cookies.
          By using this site you agree to the usage of cookies.
          &nbsp;
          <Link to="/imprint">more infos</Link>
          <Button className={styles.button} onClick={this.close} />
        </div>
      );
    }

    return null;
  }

  private close = () => {
    document.cookie = 'bonfire-cookie-accepted; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/';
    this.setState({ show: false });
  }
}

export default CookieBanner;
