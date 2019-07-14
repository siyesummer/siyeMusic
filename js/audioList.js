// JavaScript Document
//音乐列表处理
export default class AudioList {
  constructor($audioListParams) {
    this.firstAudioName = 0;
    this.currentAudioPageIndex = 1;
    this.lastAudioPageIndex = 1;
    this.audioList = [];
    this.audioType = 'music';
    this.audioListParams = ['$audioList', '$audioListTr', '$audioTitle', '$audioDescription', '$audioStatusHit', '$audioPage', '$audioStatusHit',
      '$preAudioPage', '$nxtAudioPage', '$audioType'
    ];

    this.setParams(this.audioListParams, $audioListParams);
  }
  //设置参数
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
  //添加音频列表相关事件监听
  addAudioListEvent() {
    let $this = this;
    //上一页
    this.$preAudioPage.click(function() {
      $this.changeaudioListPage('before');
    });
    //下一页
    this.$nxtAudioPage.click(function() {
      $this.changeaudioListPage('next');
    });
    //音乐频道
    this.$audioType.eq(1).click(function() {
      console.log('音乐频道');
      $this.audioListInit();
    });
    //心灵砒霜
    this.$audioType.eq(2).click(function() {
      console.log('心灵砒霜');
      $this.radioListInit();
    });
  }

  //获取歌曲列表
  getAudioList(type) {
    let $this = this;
    $.ajax({
      type: 'get',
      url: './inc/getMusicList.php',
      data: `type=${type}&page=${this.currentAudioPageIndex}&audioType=${this.audioType}`,
      success: function(resText) {
        let mesRes_value = eval('(' + resText + ')');
        let mes = mesRes_value.mes;
        $this.$audioList.html('');
        if (mes == '没有音频文件') {
          $this.$audioList.html('没有音频文件');
          return;
        } else if (mes == '没有电台文件') {
          $this.$audioList.html('没有电台文件');
          return;
        }

        $this.firstAudioName = mesRes_value.mus_first;
        $this.currentAudioPageIndex = mesRes_value.page;
        $this.lastAudioPageIndex = mesRes_value.pagemax;
        $this.audioList = mesRes_value.mus_list;
        $this.$audioPage.html(`${$this.currentAudioPageIndex} / ${$this.lastAudioPageIndex}`);
        $.each($this.audioList, function(key, val) {
          let $audio = $this.createAudio(key, val);
          $this.$audioList.append($audio);
        });

      },
      error: function(xhr) {
        console.log(xhr.status);
      }
    });

  }
  //创建音频条目
  createAudio(index, mus_mes) {
    let $audio = '';
    let trClass = 'summer';
    let trName = 'music';
    if (this.audioType == 'radio') {
      trClass = 'winter';
      trName = 'radio';
    }

    $audio = $(`
      <tr style='text-align: center' class=${trClass}>
				<th>
				<a href='javascript:;' >
				<span id=${mus_mes.id} lyr=${mus_mes.lyric}  name=${trName} style='color: silver' >
				${mus_mes.musname}
				</span>
				</a>
				</th>
			</tr>`);
    $audio.get(0).index = index;
    $audio.get(0).mus_mes = mus_mes;
    return $audio;
  }
  //歌区页面初始化
  audioListInit() {
    this.$audioTitle.html('音乐列表');
    this.$audioDescription.html('首次加载歌曲需要10秒左右 &nbsp;5M音频上传需要30秒左右');
    this.currentAudioPageIndex = 1;
    this.audioType = 'music';
    this.getAudioList('get_mus');
  }
  //歌曲翻页
  changeaudioListPage(type) {
    this.getAudioList(type);
  }
  //电台页面初始化
  radioListInit() {
    this.$audioTitle.html('电台频道');
    this.$audioDescription.html('每周日66和你 不见不散');
    this.currentAudioPageIndex = 1;
    this.audioType = 'radio';
    this.getAudioList('get_radio');
  }

}
