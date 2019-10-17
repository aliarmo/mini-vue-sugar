import { isWifi } from "../../module/network-promise";
// import pageScrollTo from "../../module/pageScrollTo";
let sysInfo = require("../../module/system-info");
import genReportParam from "../../module/player-report-param";
import recreport from "../../module/recreport";
import Boss from "../../module/boss";
import message from "../../module/message";
import { platformCode } from "../../module/platform";
import serverHistory from "../../module/dataset/history/index.js"; // 上报到服务器端的历史观看记录
var Tvp = requirePlugin("tencentvideo");
let app = getApp();
let boss = Boss({
  page_url: "index"
});

let isLeftAddSapce = true;
const CHANNEL_ID = "100101";
Component({
  // 2.6的组件库才支持。。。。
  // options: {
  //   styleIsolation: 'apply-shared'
  // }
  properties: {
    shortVideo: {
      type: Object,
      value: {}
    },
    modIndex: {
      type: Number
    }
  },
  data: {
    vid: "",
    title: "",
    videoInfo: "",
    extraParam: "",
    top: 0,
    left: 0,
    isShowPlayer: true,
    shortVideoMap: {}
  },
  methods: {
    getCurr(index) {
      if (typeof index == "undefined") {
        index = this.currIndex;
      }
      return this.data.shortVideo.list[index];
    },
    getAddedPath(key) {
      return `shortVideoMap[${this.currIndex}].${key}`;
    },
    getValByKey() {
      let shortVideoMap = this.data.shortVideoMap;
      let index = this.currIndex;
      return shortVideoMap[index] && shortVideoMap[index].animationStart;
    },
    setExtraData(key, value, extra) {
      let map = this.data.shortVideoMap[this.currIndex];
      let target;
      if (map) {
        target = Object.assign(
          {
            [this.getAddedPath(key)]: value
          },
          extra
        );
      } else {
        target = Object.assign(
          {
            [`shortVideoMap[${this.currIndex}]`]: { [key]: value }
          },
          extra
        );
      }
      this.setData(target);
    },
    onNavigate(e) {
      let index = e.currentTarget.dataset.index;
      let curr = this.getCurr(index);
      let params;
      try {
        params = this.clickRecReport(index);
      } catch (error) {
        params = "";
      }
      let parentParams = `&parentParams=${encodeURIComponent(params)}`;
      wx.navigateTo({
        url: `/pages/play/index?cid=${curr.itemSubId}${parentParams}`
      });
    },
    onReplay(e) {
      let dataset = e.detail;
      this.onStartPlay({
        index: dataset.index
      });
    },
    onStartPlay(e) {
      this.currIndex =
        typeof e.index != "undefined" ? e.index : e.currentTarget.dataset.index;
      console.log("onStartPlay", this.currIndex);
      this.videoContext && this.videoContext.pause();
      // 没有进入全屏切换才需要隐藏播放器
      if (!this.isEnterFullscreen) {
        this.setData({
          isShowPlayer: false
        });
      }
      // pageScrollTo(this, {
      //   targetClass: this.getTargetClass(),
      //   success: () => {
      //     this.execAnimation();
      //   }
      // });
      this.getScrollTop({
        success: () => {
          this.execAnimation();
        }
      });
      this.historySaveGap = 0; // 初始化观看时间
      // 切换视频，上报一次播放记录吧
      setTimeout(() => {
        // console.log('history.sync')
        serverHistory.sync();
      }, 300);
    },
    getScrollTop(options = {}) {
      let query = this.createSelectorQuery();
      query.select(this.getTargetClass()).boundingClientRect();
      query.exec(res => {
        let rect = res[0];
        let top = rect.top - (sysInfo.windowHeight - rect.height) / 2;
        // console.log("res",res,top)
        message.emit("featureScroll", top);
        setTimeout(() => {
          options.success && options.success();
        }, 0);
      });
    },
    getTargetClass() {
      return `.short-video-feed-item-${this.data.modIndex}-${this.currIndex}`;
    },
    execAnimation() {
      if (this.getValByKey("animationStart")) {
        this.onAnimationEnd();
      } else {
        // this.setData({
        //   [this.getAddedPath("animationStart")]: true
        // });
        this.setExtraData("animationStart", true);
      }
    },
    onAnimationEnd() {
      let curr = this.getCurr();
      // TODO  推荐上报 rmd
      let rmd;
      try {
        rmd = this.clickRecReport(this.currIndex);
      } catch (error) {
        rmd = "";
      }
      isLeftAddSapce = !isLeftAddSapce;
      let vid = curr.itemId;
      if (this.data.vid == curr.itemId) {
        vid = isLeftAddSapce ? " " + vid : vid + " ";
      }
      this.setData({
        vid,
        title: curr.title,
        videoInfo: curr.videoInfo,
        extraParam: {
          scene: 1, // 告知插件是短视频场景
          qwer: 1, // 不能用getAccountInfoSync鉴权的靠这个参数
          from: "v4138",
          getReportParam: genReportParam({
            rmd,
            additional: "index-short-video"
          })
        }
      });
      this.setPlayerPosition();
    },
    setPlayerPosition(cb) {
      let selQuery = this.createSelectorQuery();
      selQuery.select(`.pic-cont-${this.currIndex}`).boundingClientRect();
      selQuery.select("._short_video").boundingClientRect();
      selQuery.exec(res => {
        this.setData({
          top: res[0].top - res[1].top,
          isShowPlayer: true
        });
        cb && cb();
      });
    },
    clickRecReport(index) {
      let curr = this.getCurr(index);
      let video = this.data.shortVideo;
      let extraRecReportMap = app.global.extraRecReportMap || {};
      let currMod =
        (extraRecReportMap[CHANNEL_ID] || [])[this.data.modIndex] || {};
      if (!currMod || !currMod.list) return;
      // console.log("hhahha",currMod,extraRecReportMap,this.data.modIndex)
      var rdata = recreport.fieldPick(
        currMod.list[index].report,
        currMod.meta.seq_num
      );
      rdata.ztid = CHANNEL_ID;
      let that = {
        $core: {
          boss
        }
      };
      let params = recreport.report.call(
        that,
        "click",
        {
          recReportData: rdata
        },
        index,
        "channel_recommend"
      );
      return params;
    },
    onContentChange(e) {
      this.videoContext = Tvp.getTxvContext(this.data.vid);
      message.emit("videoContext", this.videoContext);
    },
    onPlay(e) {},
    onPause(e) {},
    onEnded(e) {
      // this.setData({
      //   [this.getAddedPath("isShow")]: true,
      //   isShowPlayer: false
      // });
      this.setExtraData(
        "isShow",
        true,
        this.isEnterFullscreen
          ? ""
          : {
              isShowPlayer: false
            }
      );
      isWifi().then(isTrue => {
        let currIndex = this.currIndex + 1;
        let list = this.data.shortVideo.list || [];
        if (isTrue && currIndex <= list.length - 1) {
          this.onStartPlay({
            index: currIndex
          });
        } else {
          this.videoContext && this.videoContext.exitFullScreen();
          this.setData({
            isShowPlayer: false
          });
        }
      });
    },
    onError(e) {},
    onStateChanage(e) {},
    onTimeupdate(e) {
      let currTime = e.detail.currentTime;
      let video = this.getCurr();
      // 上报本地缓存历史观看记录
      if (this.historySaveGap++ == 20) {
        // 20跳存一次history，大约5s左右
        this.historySaveGap = 0;
        this.historyReport(currTime, video.itemId);
      }
    },
    onFullScreenChange(e) {
      this.isEnterFullscreen = !!e.detail.fullScreen;
      if (!this.isEnterFullscreen) {
        this.setPlayerPosition();
        this.getScrollTop();
      }
    },
    historyReport(currentTime, vid) {
      serverHistory.add({
        cid: "",
        vid: vid || "",
        lid: "",
        poster: null,
        strTime: Math.floor(currentTime),
        uiDate: Math.floor(Date.now() / 1000),
        iHD: 0,
        playFrom: platformCode, // 3 aphone 4 ipad 5 iphone ,
        seriesText: "",
        reportParam: "",
        isAutoPlay: true,
        recordType: 0,
        fromCtx: "",
        totalTime: "",
        totalWatchTime: 0,
        showLocation: 1
      });
    }
  }
});