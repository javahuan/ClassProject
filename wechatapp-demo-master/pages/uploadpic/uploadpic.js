
Page({
  data: {
    uploadimgs: [], //上传图片列表
    uploadAttachmentId: [],//上传图片返回id
    editable: false, //是否可编辑
    dateTime: null,
    dateTime1: null,
    dateTimeArray: [],
    dateTimeArray1: [],
    dateTimeStr: null,
  },
  onLoad: function (options) {
  
  },
  
  chooseImage: function () {
    let _this = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#f7982a",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            _this.chooseWxImage('album')
          } else if (res.tapIndex == 1) {
            _this.chooseWxImage('camera')
          }
        }
      }
    })
  },
  chooseWxImage: function (type) {
    let _this = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        _this.setData({
          uploadimgs: _this.data.uploadimgs.concat(res.tempFilePaths)
        });
        wx.uploadFile({
          filePath: res.tempFilePaths[0],
          name: "img",
          url: 'https://www.ylxteach.net/teach-demo/device_file_servlet_action?action=upload_file',
          header: { "content-type": "application/x-www-form-urlencoded", "x-requested-with": "XMLHttpRequest", },
          success: function (res) {
            //微信小程序上传API接口wx.uploadFile的坑
            //返回的数据格式不是JSON格式（需要自己用JSON.parse()转化格式）
            //https://blog.csdn.net/Charles_Tian/article/details/80669530
            console.log(JSON.stringify(res.data));
            var data = JSON.parse(res.data);
            console.log("[chooseWxImage]返回的数据是："+JSON.stringify(data));
            console.log("[chooseWxImage]图片访问URL是：https://www.ylxteach.net/"+data.upload_files[0].file_url_name);
            console.log("[chooseWxImage]后端生成的流水ID是："+data.upload_files[0].file_object_id);
            _this.data.uploadAttachmentId.push(data.upload_files[0].file_object_id);   //这个是返回来的附件流水号
            console.log(_this.data.uploadAttachmentId);
          },
          faile: function (res) {
            console.log(JSON.stringify(res));
          },
          complete: function (res) {
            console.log(JSON.stringify(res));
          }
        })
      }
    })
  },
  editImage: function () {
    this.setData({
      editable: !this.data.editable
    })
  },
  deleteImg: function (e) {
    console.log(e.currentTarget.dataset.index);
    const imgs = this.data.uploadimgs
    // Array.prototype.remove = function(i){
    //   const l = this.length;
    //   if(l==1){
    //     return []
    //   }else if(i>1){
    //     return [].concat(this.splice(0,i),this.splice(i+1,l-1))
    //   }
    // }
    this.setData({
      uploadimgs: imgs.remove(e.currentTarget.dataset.index)
    })
  },
 
  applySubmit: function () {
    
      let that = this;
      var title = this.data.title;
      console.log("图片链接："+this.data.uploadAttachmentId);
      //project_todo表的object_id是一个自定义的流水号，parent_id，可以是从属于哪个项目的，或者单位的等等
      var sqlAdd="insert into project_todo(parent_id,object_id,title) values('PRJ_AAAABBBBB','TODO_202410290001','待办事项111')";
      console.log(sqlAdd);
      //这里只运行了sqlAdd，需要自行再调用一次wx.request来运行sqlAttachment，实现主表todo表和附件表的关联
      wx.request({
        url: 'https://www.ylxteach.net/teach-demo/device_file_servlet_action?action=update_record',
        //data这里要带上三个参数：
        //1.前端构造好的sql语句；
        //2.所要操作的数据库名称，比如：test，等等；
        //3.动作的id，比如这里是update_record，写在data里也可以，写在url上也可以
        data: { "sql": sqlAdd,"db_name":"ydbc2024"},
        header: { "content-type": "application/x-www-form-urlencoded", "x-requested-with": "XMLHttpRequest", },
        success: function (res) {
          //that.handleAddTodoRecordResult(res);
          wx.showToast({
            title: '已经添加完毕！',
            icon: "none",
            duration: 2000,
            success: function (res) {
              setTimeout(function () {
                //要延时执行的代码
                wx.navigateBack({ delta: 1 });
              }, 2000) //延迟时间
            }
          })
        },
        fail: function (res) {
        }
      })
      //这里结束后，需要再运行一遍wx.request来执行sqlAttachment的记录添加，实现主表和附件表的关联

      for(var i=0;i<this.data.uploadAttachmentId.length;i++){
        var id=this.data.uploadAttachmentId[i];
        console.log(id);
        //构造对public_attachment的关联操作
        //public_attachment的parent_id对应project_todo表的object_id，表明这几个附件是对应todo表的某一条记录的
        //public_attachment的object_id，是唯一索引，代表本条附件记录，多个附件不同的object_id可以对应一个相同的parent_id，也就是project_todo里的object_id
        var sqlAttachment="update public_attachment(parent_id,object_id,attachment_name,attachment_filename,attachment_url,creator_id,creator,create_time) values('','"+id+"','','','','','','')";//这里需要自己构造
        console.log(sqlAttachment);

        /*
        wx.request({
          url: 'xxxxxxxx',
        })
        */
      }
    
  },
})