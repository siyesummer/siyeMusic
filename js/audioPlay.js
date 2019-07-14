// JavaScript Document
//音乐播放相关处理
export default class AudioPlay {

  constructor($audioPlayParams) {
    this.$audio = $('audio');
    this.audio = this.$audio.get(0);

    this.currentPlayIndex = -1; //当前播放音乐索引
    this.isSelectedAudio = false; //是否选中了音频
    this.playModel = 'loop'; //播放模式
    this.isCountdown = false; //是否定时
    this.lastSecond = 0; //定时倒计时
    this.countDownstop = ''; //定时计时器
    this.loadTimeinterval = '';
    this.currentPlayAudioType = 'music';
    this.lyrMessage = '';

    this.audioPlayParams = ['$playBtn', '$playNextBtn', '$playPreBtn', '$lycAlbum', '$currentPlayTime', '$lycText', '$audioName', '$radioRadyProcess', '$btnI', '$playModel',
      '$countDown', '$countSet', '$setTime', '$countDownArea', '$volControl', '$volBar', 'musicPath', 'radioPath'
    ];
    this.setParams(this.audioListParams, $audioPlayParams);
  }

  setParams(params, datas) {
    if (!datas) {
      return;
    }
    params.forEach((ele) => {
      if (datas[ele]) {
        this[ele] = datas[ele]
      }
    });
  }
  addAudioPlayEvent() {
    let $this = this;
    this.$audioList.delegate('tr', 'click', function() {
      $(this).find('span').css({
        color: 'black'
      });
      $(this).siblings().find('span').css({
        color: 'silver'
      });
      $this.$playBtn.addClass('pause');
      $this.$lycAlbum.removeClass('album_pause');
      $this.$currentPlayTime.css('opacity', 1);

      let index = $(this).get(0).index;
      let message = $(this).get(0).mus_mes;
      $this.lyrMessage = message.lyric;
      $this.$lycText.empty();
      //切换歌曲时必须停止动画，否则歌词无法立即同步
      $this.$lycText.stop().animate({
        marginTop: 0
      }, 10);
      if ($this.lyrMessage == 'not_file') {
        $this.$lycText.html('<li>暂无歌词</li>');

      } else if ($this.audioType == 'radio') {
        $this.$lycText.html($this.lyrMessage);
      } else {
        console.log('滚动歌词');
      }

      $this.playAudio(index, message);
      $this.audioLoadingStatus();
    });

    //播放暂停事件监听
    this.$playBtn.click(function() {
      $this.playToggle();
    });

    //下一首
    this.$playNextBtn.click(function() {
      $($this.$audioListTr).eq($this.nextIndex()).trigger('click');
    });

    //上一首
    this.$playPreBtn.click(function() {
      $($this.$audioListTr).eq($this.preIndex()).trigger('click');
    });

    //播放时长跟新
    this.updatePlayTime(function(current, duration, strTime) {
      $this.$currentPlayTime.text(strTime);
      let porPer = current / duration;
      $this.setProgress(porPer); //进度条随音频滚动

      if (current == duration) {
        $this.continuePlay();
      }

      if ($this.audio.readyState == 4) {
        $this.$btnI.removeClass('btn_load');
      } else {
        $this.$btnI.addClass('btn_load');
      }

      if ($this.lyrMessage == 'not_file' || $this.lyrMessage == 'radio')
        return;
      //歌词滚动
      $this.playAudioLyric(current);
    });

    //改变播放模式
    this.$playModel.click(function() {
      $this.playModelChange($(this));
    });

    //定时器显示
    this.$countDown.click(function() {
      $this.$countSet.toggle();
    });
    //音量控制显示
    this.$volControl.click(function() {
      $this.$volBar.toggle();
    });

    //定时
    this.$setTime.keydown(function(event) {
      $this.setCountdown($(this), $this.$countDownArea, event);
    });
  }
  //播放歌曲
  playAudio(index, mus_mes) {
    this.lyricName = mus_mes.lyric;
    this.isSelectedAudio = true;
    this.currentPlayIndex = index;

    if (this.lyricName != 'not_file' && this.audioType == 'music') {
      this.addAudioLyric(); //加载歌词
    }

    if (this.audioType == 'music') {
      this.currentPlayAudioType = 'music';
      this.$audio.attr('src', `${this.musicPath}${mus_mes.id}.mp3`);
    } else if (this.audioType == 'radio') {
      this.currentPlayAudioType = 'radio';
      this.$audio.attr('src', `${this.radioPath}${mus_mes.id}.mp3`);
    }

    this.$audioName.html(mus_mes.musname);
    $('title').text(mus_mes.musname);
    this.audio.currentTime = 0;
    this.audio.play();
    this.$radioRadyProcess.css({
      width: 0
    });
    this.audioLoadPro();
  }
  //歌曲状态
  audioLoadingStatus() {
    let $this = this;

    this.addEvent(this.audio, 'loadstart', function() {
      $this.$audioStatusHit.css('color', 'black');
      $this.$audioStatusHit.html('开始加载音频');
      $this.$btnI.addClass('btn_load');
    });

    this.addEvent(this.audio, 'loadedmetadata', function() {
      $this.$audioStatusHit.html('音频开始播放');
    });

    this.addEvent(this.audio, 'canplaythrough', function() {
      $this.$audioStatusHit.html('音频加载完成');
    });
  }
  //播放暂停切换
  playToggle() {
    this.$playBtn.toggleClass('pause');
    if (this.isSelectedAudio) {
      if (!this.audio.paused) {
        this.$playBtn.removeClass('pause');
        this.$lycAlbum.addClass('album_pause');
        this.$currentPlayTime.css('opacity', 0.5);
        this.audio.pause();
      } else {
        this.$playBtn.addClass('pause');
        this.$lycAlbum.removeClass('album_pause');
        this.$currentPlayTime.css('opacity', 1);
        this.audio.play();
      }
    }
  }
  //下一曲
  nextIndex() {
    if (this.isSelectedAudio) {
      let index = this.currentPlayIndex + 1;
      if (index > this.audioList.length - 1) {
        index = 0;
      }
      return index;
    }
  }
  //上一曲
  preIndex() {
    if (this.isSelectedAudio) {
      let index = this.currentPlayIndex - 1;
      if (index < 0 || index > this.audioList.length - 1) {
        index = this.audioList.length - 1;
      }
      return index;
    }
  }
  //歌曲时长
  audioTime(duration, currentTime) {
    let d_mun = parseInt(duration / 60);
    let d_sec = parseInt(duration % 60);

    let c_mun = parseInt(currentTime / 60);
    let c_sec = parseInt(currentTime % 60);

    if (d_mun < 10) {
      d_mun = '0' + d_mun;
    }

    if (d_sec < 10) {
      d_sec = '0' + d_sec;
    }

    if (c_mun < 10) {
      c_mun = '0' + c_mun;
    }

    if (c_sec < 10) {
      c_sec = '0' + c_sec;
    }

    if (isNaN(d_mun) || isNaN(c_mun)) {
      return;
    }
    return d_mun + ':' + d_sec + ' / ' + c_mun + ':' + c_sec;
  }
  //歌曲播放时长更新
  updatePlayTime(callBack) {
    let $this = this;
    this.$audio.on('timeupdate', function() {
      let current = $this.audio.currentTime;
      let duration = $this.audio.duration;
      let strTime = $this.audioTime(current, duration);
      callBack(current, duration, strTime);
    });
  }
  //歌曲缓存进度条
  audioLoadPro() {
    let $this = this;
    if (this.isSelectedAudio) {
      clearInterval($this.loadTimeinterval);
      this.loadTimeinterval = setInterval(function() {
        let buffer = $this.audio.buffered;
        let timebuffer = '';
        if (buffer.length != 0) {
          timebuffer = buffer.end(buffer.length - 1);
        }
        let bufferper = timebuffer / $this.audio.duration * 100;

        $this.$radioRadyProcess.css({
          width: bufferper + '%'

        });
        if (bufferper > 99.9) {
          clearInterval($this.loadTimeinterval);
        }
        //console.log(bufferper);
      }, 1000);
    }

  }
  //进度条变化
  setProgress(value) {
    if (this.horizontalBarIsMoving) return;
    if (value < 0 || value > 100) return;

    let percent = value * 100 + '%';
    let initWidth = this.$horizontalPro.width();
    let btnWidth = this.$horizontalBtn.width();
    let left = value * initWidth - btnWidth / 2;

    this.$horizontalBtn.css({
      left: left
    });
    this.$horizontalCur.css({
      width: percent
    });
  }
  //改变播放模式
  playModelChange(obj) {
    if (obj.attr('class').indexOf('icn_shuffle') != -1) {
      this.playModel = 'one';
      obj.removeClass('icn_shuffle');
      obj.addClass('icn_one');
    } else {
      this.playModel = 'shuffle';
      obj.addClass('icn_shuffle');
      if (obj.attr('class').indexOf('icn_one') != -1) {
        this.playModel = 'loop';
        obj.removeClass('icn_one');
        obj.removeClass('icn_shuffle');
      }
    }
  }
  //歌曲播放完成后继续播放
  continuePlay() {
    if (this.playModel == 'loop') {
      this.$playNextBtn.trigger('click');
    } else if (this.playModel == 'one') {
      //单曲循环
      $(this.$audioListTr).eq(this.currentPlayIndex).trigger('click');
    } else if (this.playModel == 'shuffle') {
      let Range = this.audioList.length - 1;
      let Rand = Math.random();
      let index = 0 + Math.round(Rand * Range); //四舍五入
      index = Math.round(index);
      $(this.$audioListTr).eq(index).trigger('click');
    }
  }
  //设置定时
  setCountdown(setObj, showObj, event) {
    let keycode = event.keyCode;
    console.log(keycode);
    if (keycode != 13) {
      return;
    }
    let settime = setObj.val();
    if (isNaN(settime) || settime == '') {
      return;
    }
    settime = parseInt(settime);
    if (settime > 1440) {
      showObj.html('时间过长');
      return;
    } else if (settime == 0) {
      setObj.val('');
      showObj.html('分钟定时');
      this.isCountdown = false;
      this.lastSecond = 0;
      clearInterval(this.countDownstop);
      return;
    }
    setObj.val('');
    this.stopCountdown(showObj, settime);
  }
  //定时倒计时
  stopCountdown(showObj, settime) {
    let $this = this;
    this.isCountdown = true;
    clearInterval(this.countDownstop);
    showObj.html('00:00:00');
    let houor = parseInt(settime / 60);
    let munite = parseInt(settime % 60);
    let second = 0;

    this.lastSecond = 0;
    if (second < 10) {
      second = '0' + second;
    }
    if (munite < 10) {
      munite = '0' + munite;
    }
    if (houor < 10) {
      houor = '0' + houor;
    }
    let time = houor + ':' + munite + ':' + second;
    showObj.html(time);
    this.lastSecond = houor * 3600 + munite * 60;

    this.countDownstop = setInterval(function() {
      if ($this.lastSecond > 0) {
        $this.lastSecond -= 1;
      } else {
        $this.isCountdown = false;
        $this.lastSecond = 0;
        clearInterval($this.countDownstop);
        $this.$playBtn.removeClass('pause');
        $this.$lycAlbum.addClass('album_pause');
        $this.$currentPlayTime.css('opacity', 0.5);
        $this.audio.pause();
        showObj.html('停止播放');
        return;
      }
      houor = parseInt($this.lastSecond / 3600);
      munite = parseInt($this.lastSecond % 3600 / 60);
      second = parseInt($this.lastSecond % 3600 % 60);

      if (second < 10) {
        second = '0' + second;
      }
      if (munite < 10) {
        munite = '0' + munite;
      }
      if (houor < 10) {
        houor = '0' + houor;
      }

      time = houor + ':' + munite + ':' + second;
      showObj.html(time);
    }, 1000);
  }

  //歌曲进度调节
  progressJumpTo(value) {
    let isSelectedAudio = this.isSelectedAudio;
    if (!isSelectedAudio || isNaN(value)) {
      return;
    }
    this.audio.currentTime = this.audio.duration * value;
  }
  //歌曲音量调节
  volJumpTo(value) {
    if (!this.isSelectedAudio || isNaN(value)) {
      return;
    }
    if (value.toFixed(2) <= 0.02) {
      value = 0
    }
    this.audio.volume = value;
    if (this.audio.volume == 0) {
      this.$volControl.addClass('icn_novol');
    } else {
      this.$volControl.removeClass('icn_novol');
    }
  }
  //添加歌词
  addAudioLyric() {
    this.loadLyric(); //加载歌词
  }
  //歌词滚动
  playAudioLyric(current) {
    let lyrIndex = this.currentLyricIndex(current) - 1;
    if (!lyrIndex) {
      return;
    }
    let $curItem = $(this.lyricItem).eq(lyrIndex);
    $curItem.addClass('lyccur');
    $curItem.siblings().removeClass('lyccur');

    if (lyrIndex <= this.lineCenter && (!this.reStart)) {
      return;
    }
    if (this.playIndex != lyrIndex) {
      this.runindex = lyrIndex;
      this.$lyric.stop().animate({
        marginTop: (-lyrIndex + this.lineCenter) * this.marginSize
      }, 500);
    }
  }

  //添加事件
  addEvent(obj, evetype, fn) {
    if (obj.addEventListener) {
      obj.addEventListener(evetype, fn);
    } else {
      obj.attachEvent('on' + evetype, fn);
    }

  }
}
