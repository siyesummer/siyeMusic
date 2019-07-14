// JavaScript Document
//处理歌词
export default class AudioLyric {
  constructor($audioLyricParams) {
    this.lyricPath = '';
    this.lyricName = '';
    this.lyricText = []; //存储歌词文件歌词内容/用smartgit改注释
    this.lyricTime = []; //存储歌词文件歌词时间戳
    this.lyricIndex = -1; //标记歌词当前行
    this.playIndex = -1; //
    this.first = true; //标记当前歌词是否第一次加载
    this.curTime = -1; //记录歌词的当前时间;当歌曲回退时，与此时间作比较
    this.reStart = false; //标记歌词是否有回退
    this.marginSize = 25; //歌词行高，双语歌词行高加倍
    this.lineCenter = 3; //标记歌词中间行
    this.mixIndex = 0;
    this.mixPerc = 0;
    this.audioLyricParams = [
      'lyricPath', 'lyricName', '$lyric', 'lyricItem'
    ];
    this.setParams(this.audioLyricParams, $audioLyricParams);
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

  //加载歌词
  loadLyric() {
    let $this = this;
    $.ajax({
      url: `${$this.lyricPath}${this.lyricName}`,
      dataType: 'text',
      success: function(data) {
        $this.parseLyric(data);
      },
      error: function(err) {
        console.log(err);
      }
    });
  }
  //处理歌词
  parseLyric(data) {
    this.$lyric.css({
      marginTop: 0
    });
    let $this = this;
    this.lyricTime = [];
    this.lyricText = [];
    this.marginSize = 25;
    this.lineCenter = 3;
    this.mixIndex = 0;
    this.mixPerc = 0;
    this.lyricIndex = -1;
    this.first = true;
    this.reStart = false;
    this.curTime = -1;

    let str = data.split('\n');
    $.each(str, function(index, ele) {
      //如果为空行，跳过
      if (ele == null || !ele || ele.trim().length == 0) return true;

      let regTime = /\[(\d*:\d*\.\d*)\]/;
      let time = regTime.exec(ele);

      //如果没有时间戳跳过
      if (!time || time == null || typeof time == 'undefined') return true;
      let text = ele.split(']')[1];
      if (text.indexOf('/') != -1) {
        //处理双语歌词
        //$this.lineCenter = 2;
        $this.marginSize = 50;
        $this.mixIndex++;
        text = text.replace(/\//g, '<br/>');
      }
      if ($this.trim(text).length == 0 && $this.marginSize == 25) {
        text = '</br>';
      } else if ($this.trim(text).length == 0) {
        return true;
      }
      $this.lyricText.push(text);

      //if(time==null)
      //return true;
      let timeStr = time[1].split(':');
      let min = parseInt(timeStr[0]);
      let sec = parseFloat(timeStr[1]);
      let t = parseFloat(Number(min * 60 + sec).toFixed(2));
      $this.lyricTime.push(t);
    });

    $this.mixPerc = ($this.mixIndex / $this.lyricText.length).toFixed(2);
    $this.mixPerc = parseFloat($this.mixPerc);
    if ($this.mixPerc >= 0.5) {
      $this.marginSize = 50;
    } else {
      $this.marginSize = 25;
    }
    console.log('歌词/占行比', $this.mixPerc);

    //歌词添加到页面
    $.each(this.lyricText, function(index, ele) {
      let $li = $(`<li>${ele}</li>`);
      $this.$lycText.append($li);
    })
  }
  //歌词当前行处理
  currentLyricIndex(current) {
    if (current >= this.lyricTime[0]) {
      if (this.reStart) {
        if (this.lyricIndex > 3) {
          this.reStart = false;
        }
      }
      if (this.first) {
        this.lyricIndex = 0;
        this.first = false;
        this.curTime = current;
        return this.lyricIndex;
      }
      if (this.curTime > current) {
        this.lyricIndex = 0;
      }
      for (let i = this.lyricIndex; i < this.lyricTime.length; i++) {
        if (current >= this.lyricTime[i]) {
          this.lyricIndex = i + 1;
          this.curTime = current;
          return this.lyricIndex;
        }
      }
    } else {
      if (!this.first) {
        this.reStart = true;
        return 0;
      }
      return 0;
    }
  }
  //去除字符串两端空格
  trim(str) {
    if (str.trim) {
      return str.trim();
    } else {
      return str.replace(/^\s+|\s+$/g, '');
    }
  }
  //判断字符串是否是NaN
  isNaN(str) {
    return str !== str;
  }
}
