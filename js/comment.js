// JavaScript Document
//评论区功能封装
export default class Comment {

  constructor($commentParams) {
    this.musID = ''; //当前选中音乐ID
    this.radioID = ''; //当前选中电台ID
    this.page = 1; //评论当前页
    this.pageLast = 1; //尾页
    this.commentParams = ['$commentBox', '$toggleCommentButton', '$commentButton', '$writeMesText', '$writeMesNum',
      '$commentAreaButton', '$commentContent', '$commentHit', '$sendCmmtButton', '$sendHit', '$currentPage', '$finalPage',
      '$changePageButtons', '$freshCommentButton', '$pageJumpText', '$pageJumpButton', '$jumpHit','$commentAudioName'
    ];
    this.setParams(this.commentParams, $commentParams);
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

  addCommentEvent() {
    let $this = this;

    //留言框显示
    this.$toggleCommentButton.click(function() {
      $this.$commentBox.toggle();
    });
    this.$commentButton.click(function() {
      $this.$commentBox.hide();
    });

    //留言字数提示
    this.$commentBox.keyup(function() {
      $this.cmmtNum($this.$writeMesText.get(0).value, $this.$writeMesNum);
    });

    //评论区显示切换
    this.$commentAreaButton.click(function() {
      $this.commtToggle($this.$commentContent, $this.$commentHit);
    });

    //发送留言
    this.$sendCmmtButton.click(function() {
      $this.sendStatus($this.$writeMesText.get(0).value, $this.$sendHit);
    });

    //评论翻页
    this.$changePageButtons.eq(0).click(function() {
      $this.changePage('top');
    });
    this.$changePageButtons.eq(1).click(function() {
      $this.changePage('before');
    });
    this.$changePageButtons.eq(2).click(function() {
      $this.changePage('next');
    });
    this.$changePageButtons.eq(3).click(function() {
      $this.changePage('final');
    });

    //评论区刷新
    this.$freshCommentButton.click(function() {
      $this.changePage('top');

    });

    //评论跳页
    this.$pageJumpText.keydown(function(event) {
      $this.jumpPage(event.keyCode, $this.$pageJumpText.get(0), $this.$jumpHit);
    });
    this.$pageJumpButton.click(function() {
      $this.jumpPage('', $this.$pageJumpText.get(0), $this.$jumpHit, 'jump');
    });
  }

  //显示留言框
  commtToggle(obj, hit) {
    if (obj.css('display') == 'none') {
      hit.html('收起留言');
    } else if (obj.css('display') == 'block') {
      hit.html('查看留言');
    }
    obj.toggle();
  }
  //留言字数
  cmmtNum(text, hit) {
    let max_num = 140;
    let wei_num = text.length;
    hit.text(max_num - wei_num);
  }
  //发送留言状态处理
  sendStatus(text, hit) {
    hit.text('');
    if (text.length == 0) {
      hit.text('留言内容不能为空');
    } else if (this.trim(text).length == 0) {
      hit.text('留言内容不能全为空格');
    } else if (text.length > 140) {
      hit.text('留言内容不能超过140个字符');
    } else if (!this.isSelectedAudio) {
      hit.text('没有正在播放的音频文件，无法评论');
    } else {
      this.sendCmmt(text, hit);
    }

  }
  //发送信息
  sendCmmt(mes, hit) {
    let $this = this;
    hit.text('信息正在发向服务器');
    $.ajax({
      type: 'post',
      url: './inc/cmmtAjax.php',
      data: `mes=${mes}&musID=${$this.musID}&radioID=${$this.radioID}`,
      success: function(resText) {
        hit.text(resText);
        $this.$writeMesText.get(0).value = '';
        //留言后刷新评论
        $this.changePage('top');
      },
      error: function(xhr) {
        console.log('发送评论失败返回信息', xhr.status);
      }
    });
  }
  //创建评论
  createCmmt(mes) {
    let item = $(`
				<div class='commet_messagelist'>
					<div class='commet_picture'>
						<a href='javascript:void(0)'><img src='./source/picture/1.jpg'></a>
			  		</div>
					<div class='commet_text'>
						<div class='commet_textValue'>
							${mes.content}
						</div>

						<div class='commet_textDate'>
							#${mes.number} 日期 ${mes.addtime}
						</div>
					</div>
	      </div>`);
    return item;
  }
  //查看评论
  lookCmmt(type, audioID) {
    let $this = this;
    $.ajax({
      type: 'post',
      url: './inc/cmmtAjax.php',
      data: `audioID=${audioID}&type=${type}&page=${$this.page}`,
      success: function(resText) {
        $this.$commentContent.html('');
        let mesRes_value = eval('(' + resText + ')');
        let commet = mesRes_value.commet;
        let lastpage = mesRes_value.pagesize;
        let total = mesRes_value.total;
        let page = mesRes_value.page;
        $this.page = page;
        $this.pageLast = lastpage;
        if (total == 0) {
          $this.$commentContent.html(`<div
            style='text-align: center'>暂无评论
            </div>`);
          $('#page_final').text('');
          $('#page_now').text('');
          return;
        }
        $('#page_final').text(lastpage);
        $('#page_now').text($this.page);
        $.each(commet, function(key, ele) {
          let item = $this.createCmmt(ele);
          $this.$commentContent.append(item);
        });

      },
      error: function(xhr) {
        console.log('获取评论信息失败返回信息', xhr.status);
      }
    });
  }
  //翻页
  changePage(page) {
    if (!this.isSelectedAudio) {
      return;
    }

    if (page == 'top') {
      this.page = 1;
    } else if (page == 'final')

    {
      this.page = this.pageLast;
    } else if (page == 'before') {
      if (this.page > 1) {
        this.page -= 1;
      }
    } else if (page == 'next') {
      if (this.page < this.pageLast) {
        this.page += 1;
      }
    }

    if (this.audioType == 'music') {
      this.lookCmmt(this.audioType, this.musID);
    } else if (this.audioType == 'radio') {
      this.lookCmmt(this.audioType, this.radioID);
    }
  }
  //Enter跳页
  jumpPage(keycode, obj, hit, click) {
    if (!this.isSelectedAudio) {
      return;
    }
    if (keycode == 13 || click == 'jump') {
      if (obj.value != '') {
        let page = obj.value;
        //将字符串数字转成整形数字
        page = parseInt(page);
        if (page >= 1 && page <= this.pageLast) {
          this.page = page;

          obj.value = '';
          hit.text('√');

          if (this.audioType == 'music') {
            this.lookCmmt(this.audioType, this.musID);
          } else if (this.audioType == 'radio') {
            this.lookCmmt(this.audioType, this.radioID);
          }
        } else {
          obj.value = '';
          hit.text('×');
        }
      } else {
        hit.text('');
      }
    }
  }
}
