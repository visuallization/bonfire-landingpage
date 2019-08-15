import * as React from 'react';
import { Link } from "react-router-dom";
import ReactMarkdown from 'react-markdown';

import content from '../../content/imprint.md'

import * as styles from './styles.less';

class Imprint extends React.Component {
  public render() {
    return (
      <div className={styles.imprint}>
        <div className={styles.container}>
          <Link className={styles.homeLink} to="/"><i className="fa fa-arrow-left" /></Link>
          <ReactMarkdown source={content} escapeHtml={false}/>
        </div>
      </div>
    );
  }
}

export default Imprint;
