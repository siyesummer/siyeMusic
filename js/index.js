import * as Helper from './helper';
import AudList from './audioList';
import AudioPlay from './audioPlay';
import Progress from './progress';
import AudioLyric from './audioLyric';

class SiyeMusic extends Helper.mix(AudList, AudioPlay, Progress, AudioLyric) {
  constructor(...arg) {
    super(arg);

    this.setParams(this.audioListParams, arg[0]);
    this.setParams(this.audioPlayParams, arg[1]);
    this.setParams(this.progressParams, arg[2]);
    this.setParams(this.audioLyricParams, arg[3]);

    this.getAudioList('get_mus'); //初始化音频文件列表
    this.addAudioListEvent(); //音频列表相关事件监听
    this.addAudioPlayEvent(); //添加音频点击播放相关事件监听
    this.addProgessEvent(); //进度条相关事件监听
  }

  addProgessEvent() {
    let $this = this;
    this.horizontalClick(function(value) {
      $this.progressJumpTo(value);
    });

    this.horizontalMove(function(value) {
      $this.progressJumpTo(value);
    });

    this.longitudinalClick(function(value) {
      $this.volJumpTo(value);
    });

    this.longitudinalMove(function(value) {
      $this.volJumpTo(value);
    });
  }
}

let $audioListParams = {
  $audioList: $('#mus_list table'),
  $audioListTr: '#mus_list tr',
  $audioPage: $('.music_page span').eq(0),
  $audioTitle: $('.musiclist h3'),
  $audioDescription: $('.musiclist span').eq(0),
  $audioStatusHit: $('#mus_time'),
  $preAudioPage: $('.music_page input').eq(0),
  $nxtAudioPage: $('.music_page input').eq(1),
  $audioType: $('.topmenulist a'),
};

let $audioPlayParams = {
  $playBtn: $('.btns a').eq(1),
  $playNextBtn: $('.btns a').eq(2),
  $playPreBtn: $('.btns a').eq(0),
  $lycAlbum: $('.lyc_album ul').eq(0),
  $currentPlayTime: $('.curtime span'),
  $lycText: $('.lyric ul'),
  $audioName: $('#siyemus_name'),
  $radioRadyProcess: $('.rdy'),
  $btnI: $('.btn i'),
  $playModel: $('.control a').eq(1),
  $countDown: $('.Countdown'),
  $countSet: $('.countset'),
  $setTime: $('.counttext'),
  $countDownArea: $('.Countdown span').eq(0),
  $volControl: $('.control a').eq(0),
  $volBar: $('.control .barbg'),
};


let $progressParams = {
  $horizontalPro: $('.progressbar .myBar'),
  $horizontalCur: $('.cur'),
  $horizontalBtn: $('.progressbar .btn'),
  $longitudinalPro: $('.curr_bg'),
  $longitudinalCur: $('.curr'),
  $longitudinalBtn: $('.curr .btn_vol')
};

let $audioLyricParams = {
  lyricPath: './source/lyric/',
  $lyric: $('.lyric ul'),
  lyricItem: '.lyric ul li',
}

new SiyeMusic($audioListParams, $audioPlayParams, $progressParams, $audioLyricParams);
