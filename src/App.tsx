import * as React from 'react';
import { Game, LoadingScreen, ParticleSystem } from './components';

import * as styles from './styles/styles.less';

interface IAppState {
  isLoading: boolean;
  hasInitTimePassed: boolean;
  showVideo: boolean;
  isYoutubePlayerReady: boolean;
}

class App extends React.Component<any, IAppState> {
  private initTime: number = 200;
  private videoID: string = 'Uysknk34ETE';
  private youtubePlayer: any = null;

  constructor(props: any) {
    super(props);

    this.state = {
      isLoading: true,
      hasInitTimePassed: false,
      showVideo: false,
      isYoutubePlayerReady: false
    }

    this.initYoutubePlayer();

    window.onYouTubeIframeAPIReady = () => {
      this.youtubePlayer = new window.YT.Player('youtubePlayer', {
        videoId: this.videoID,
        playerVars: { 
          autoplay: 0,
          controls: 1, 
          rel : 0,
          showinfo: 0
        },
        events: {
          onReady: () => {
            this.setState({ isYoutubePlayerReady: true });
          }
        }}
      );     
    };
  }

  public componentDidMount() {
    setTimeout(() => {
      this.setState({ hasInitTimePassed: true});
    }, this.initTime);
  }

  public render() {
    return (
      <div className={styles.app}>
        {this.renderLoadingScreen()}
        {this.renderContent()}
        {this.renderVideo()}
        {this.renderVideoButton()}
        <Game onLoaded={this.hideLoadingScreen}/>
        <ParticleSystem />
      </div>
    );
  }

  private initYoutubePlayer = () => {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    if(firstScriptTag.parentNode) {
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
  }

  private renderLoadingScreen = () => {
    const { isLoading, hasInitTimePassed } = this.state;
    return <LoadingScreen className={`${!isLoading && hasInitTimePassed ? styles.hide : ''}`} />;
  }

  private renderContent = () => {
    return (
      <div className={styles.content}>
        <h1>Bonfire</h1>
        <h2>A Storytelling Game</h2>
        <span>coming <strong>2019</strong> for <i className={`${styles.icon} fa fa-apple`} /><i className={`${styles.icon} fa fa-android`}/></span>
      </div>
    );
  }

  private renderVideoButton = () => {
    const { showVideo } = this.state;    

    if(!showVideo) {
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

export default App;
