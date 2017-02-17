declare var AdMob: any;

export class AdsHelper {

  private admobId: any;

  constructor() {
    this.admobId = {
      banner: 'ca-app-pub-3186934136515262/9216522436',
      interstitial: 'ca-app-pub-3186934136515262/3309589632'
    };
  }

  createBanner() {
    if(window['AdMob']) {
      AdMob.createBanner({
        adId: this.admobId.banner,
        autoShow: true
      });
    }
  }

  showInterstitial() {
    if(window['AdMob']) {
      AdMob.prepareInterstitial({
        adId: this.admobId.interstitial,
        autoShow: true
      });
    }
  }

  showBanner(position) {
    if(window['AdMob']) {
      var positionMap = {
        "bottom": AdMob.AD_POSITION.BOTTOM_CENTER,
        "top": AdMob.AD_POSITION.TOP_CENTER
      };
      AdMob.showBanner(positionMap[position.toLowerCase()]);
    }
  }

  hideBanner(position) {
      if(window['AdMob']) {
        AdMob.hideBanner();
      }
  }

}
