import React from 'react';
import { Link } from "react-router-dom";

import { CookieBanner, Game, LoadingScreen, ParticleSystem, PopUp } from '../../components';
import newsletterAgreement from '../../content/newsletter-agreement.md'

import styles from './styles.less';

interface IAppState {
  isLoading: boolean;
  hasInitTimePassed: boolean;
  showVideo: boolean;
  showEmailPopUp: boolean;
  isYoutubePlayerReady: boolean;
  email: string;
  showVideoButton: boolean;
  isSubmitting: boolean;
  status: Status;
};

enum Status {
  Default,
  Success,
  Error
};

class Home extends React.Component<any, IAppState> {
  private initTime: number = 200;
  // private videoID: string = '';
  private youtubePlayer: any = null;
  private validEmail: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  private message:  { [status in Status]: string } = {
    [Status.Default]: 'Subscribe to our Newsletter',
    [Status.Success]: 'Awesome, almost there! We have send you an email, please confirm it to finish the subscription process.',
    [Status.Error]: 'Unfortunately, an error occured.'
  };
  private emailButtons = [
    { 
      label: 'cancel',
      onClick: () => { this.hideEmailPopUp(); } 
    },
    { 
      label: 'ok',
      onClick: () => { this.hideEmailPopUp(); this.subscribeUser(); } 
     }
  ];

  constructor(props: any) {
    super(props);

    this.state = {
      isLoading: true,
      hasInitTimePassed: false,
      showVideoButton: true,
      showVideo: false,
      showEmailPopUp: false,
      isYoutubePlayerReady: false,
      email: '',
      isSubmitting: false,
      status: Status.Default
    }

    // this.initYoutubePlayer();

    // window.onYouTubeIframeAPIReady = () => {
    //   this.youtubePlayer = new window.YT.Player('youtubePlayer', {
    //     host: 'https://www.youtube-nocookie.com',
    //     videoId: this.videoID,
    //     playerVars: { 
    //       autoplay: 0,
    //       controls: 1, 
    //       rel : 0,
    //       showinfo: 0
    //     },
    //     events: {
    //       onReady: () => {
    //         this.setState({ isYoutubePlayerReady: true });
    //       }
    //     }}
    //   );     
    // };
  }

  public componentDidMount() {
    setTimeout(() => {
      this.setState({ hasInitTimePassed: true});
    }, this.initTime);
  }

  public render() {
    const { showEmailPopUp } = this.state;
    return (
      <div className={styles.app}>
        {this.renderLoadingScreen()}
        {this.renderContent()}
        {this.renderVideo()}
        {this.renderVideoButton()}
        {showEmailPopUp && <PopUp content={newsletterAgreement} buttons={this.emailButtons}/>}
        <Game onLoaded={this.hideLoadingScreen}/>
        <ParticleSystem />
      </div>
    );
  }

  // private initYoutubePlayer = () => {
  //   const tag = document.createElement('script');
  //   tag.src = 'https://www.youtube.com/iframe_api';
  //   const firstScriptTag = document.getElementsByTagName('script')[0];
  //   if(firstScriptTag.parentNode) {
  //     firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  //   }
  // }

  private renderLoadingScreen = () => {
    const { isLoading, hasInitTimePassed } = this.state;
    return <LoadingScreen className={`${!isLoading && hasInitTimePassed ? styles.hide : ''}`} />;
  }

  private renderContent = () => {  
    const { status } = this.state;
    return (
      <div className={styles.content}>
        <h1>Bonfire</h1>
        <h2>tells meaningful stories</h2>
        <form>
          <div className={styles.newsletterContainer}>
            <label htmlFor="newsletter">{this.message[status]}</label>
            <div className={styles.inputContainer}>
              <input type="email" onFocus={this.hideVideoButton} onBlur={this.showVideoButton} onChange={this.setEmail} className={styles.emailInput} name="newlsetter" id="newsletter" placeholder="your.email@address.com" autoCapitalize="off" autoCorrect="off" size={23} />
              {this.renderSubmitButton()}
            </div>
          </div>
        </form>
        <div className={styles.footer}>
          <span>coming <strong>2023</strong> for <i className={`${styles.icon} fa fa-apple`} /><i className={`${styles.icon} fa fa-android`}/> |  <Link to="/imprint">imprint & data privacy</Link> </span>
          <CookieBanner />
        </div>
      </div>
    );
  }

  private showVideoButton = () => {
    this.setState({ showVideoButton: true });
  } 

  private hideVideoButton = () => {
    this.setState({ showVideoButton: false });
  }

  private setEmail = (e: any) => {
    this.setState({ email: e.target.value, status: Status.Default });
  }

  private subscribeUser = () => {
    this.setState({ isSubmitting: true });
  
    fetch('/.netlify/functions/subscribe', { method: 'POST', body: this.state.email })
    .then(response => {
      if(response.ok) {
        return response.json()
      }
      return null;
    })
    .then(json => {      
      this.setState({ 
        isSubmitting: false, 
        status: json ? Status.Success : Status.Error 
      }); 
    });
  }

  private renderSubmitButton = () => {
    const { isSubmitting, status } = this.state;
    const isEmailVaild = this.validEmail.test(String(this.state.email.toLowerCase()));

    let icon = 'fa-arrow-right';
    if(isSubmitting) {
      icon = 'fa-spinner fa-pulse fa-fw';
    } else if(status === Status.Success) {
      icon = 'fa-check';
    } else if(status === Status.Error) {
      icon = 'fa-warning';
    }

    if(isEmailVaild) {
      return (
        <a className={styles.submitButton} onClick={this.showEmailPopUp}>
          <i className={`fa ${icon}`} />
        </a>
      );
    }

    return null;
  }

  private showEmailPopUp = () => {
    this.setState({ showEmailPopUp: true });
  }

  private hideEmailPopUp = () => {
    this.setState({ showEmailPopUp: false });
  }

  private renderVideoButton = () => {
    return null;
    const { showVideo, showVideoButton } = this.state;    

    if(!showVideo && showVideoButton) {
      return <i onClick={this.showVideo} className={`${styles.videoButton} fa fa-youtube-play`} />
    }

    return null;
  }

  private renderVideo = () => {
    const { showVideo } = this.state;    

    return (
      <div className={`${styles.videoContainer} ${!showVideo ? styles.hide : ''}`}>
        <i onClick={this.hideVideo} className={`${styles.closeButton} fa fa-times`} />
        <div id="youtubePlayer" />
      </div>
    );
  }
  
  private hideVideo = () => {
    const { isYoutubePlayerReady } = this.state;
    if(isYoutubePlayerReady){
      this.youtubePlayer.pauseVideo();
      this.setState({ showVideo: false });
    }
  }

  private showVideo = () => { 
    const { isYoutubePlayerReady } = this.state;    
    if(isYoutubePlayerReady){
      this.youtubePlayer.playVideo();
      this.setState({ showVideo: true });
    }
  }

  private hideLoadingScreen = () => {
    this.setState({isLoading: false});
  }
}

export default Home;
