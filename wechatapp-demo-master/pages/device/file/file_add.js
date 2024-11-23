// pages/device/file/file_add.js
var dateTimePicker = require('../../../utils/datetimePicker.js');
Page({
    data: {
        title: '',
        type: '',
        uploadimgs: [], //上传图片列表
        editable: false, //是否可编辑
        uploadAttachmentId: [], //上传图片返回ID
        //设置限制时间，没有存进数据库
        dateTime: null,
        dateTime1: null,
        dateTimeArray: [],
        dateTimeArray1: [],
        dateTimeStr: null,
    },
    onLoad:function(options) {
        // 获取完整的年月日 时分秒，以及默认显示的数组
        var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
        var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
        // 精确到分的处理，将数组的秒去掉
        var lastArray = obj1.dateTimeArray.pop();
        var lastTime = obj1.dateTime.pop();

        this.setData({
            dateTimeArray: obj.dateTimeArray,
            dateTimeArray1: obj1.dateTimeArray,
            dateTime: obj.dateTime,
            dateTime1: obj1.dateTime,
        })
    },
    //获取图片
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
              url: 'http://localhost:8080/wxcruduse_war_exploded/device_file_servlet_action?action=upload_record',
              header: {  "content-type": "application/x-www-form-urlencoded",
              "x-requested-with": "XMLHttpRequest", },
              success: function (res) {
                //微信小程序上传API接口wx.uploadFile的坑
                //返回的数据格式不是JSON格式（需要自己用JSON.parse()转化格式）
                //https://blog.csdn.net/Charles_Tian/article/details/80669530
                console.log(JSON.stringify(res.data));
                var data = JSON.parse(res.data);
                console.log("[chooseWxImage]返回的数据是："+JSON.stringify(data));
                _this.data.uploadAttachmentId.push(data.attachment_id);   //这个是返回来的附件流水号
                console.log(_this.data.uploadAttachmentId);
              },
              faile: function (res) {
                console.log(JSON.stringify(res));
              },
            //   complete: function (res) {
            //     console.log(JSON.stringify(res));
            //   }
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
    //获取两个input
    inputTitle: function (e) {
        this.setData({
            title: e.detail.value,
        });
    },
    inputType: function (e) {
        this.setData({
            type: e.detail.value,
        });
    },
    //提交
    applySubmit: function () {
        if (this.checkInput()) {
            let that = this;
            var title = this.data.title;
            var type = this.data.type;
            console.log("图片链接是："+this.data.uploadAttachmentId);
            //project_todo表的object_id是一个自定义的流水号，parent_id，可以是从属于哪个项目的，或者单位的等等
            //这两行有用吗？？
            var sqlAdd = "insert into project_todo(parent_id,object_id,title) values('PRJ_AAAABBBBB','TODO_202410290001','待办事项111')";
            console.log(sqlAdd);
            //这里只运行了sqlAdd，需要自行再调用一次wx.request来运行sqlAttachment，实现主表todo表和附件表的关联
            wx.request({
                url: 'http://localhost:8080/wxcruduse_war_exploded/device_file_servlet_action?action=add_device_record',
                //data这里要带上三个参数：
                //1.前端构造好的sql语句；
                //2.所要操作的数据库名称，比如：test，等等；
                //3.动作的id，比如这里是update_record，写在data里也可以，写在url上也可以
                data: {
                    "title": title,
                    "type": type,
                    "attachment_ids": that.data.uploadAttachmentId,//后端将图片返回到前端了
                    "limit_time":that.getCurrentDateTime(),
                },
                header: {
                    "content-type": "application/x-www-form-urlencoded",
                    "x-requested-with": "XMLHttpRequest",
                },
                success: function (res) {
                    //wx.navigateBack({});
                    wx.showToast({
                        title: '已经添加完毕！',
                        icon: "none",
                        duration: 2000,
                        success: function (res) {
                            setTimeout(function () {
                                wx.navigateBack({
                                    delta: 1
                                });
                            }, 2000)
                        }
                    })
                },
                fail: function (res) {

                }
            })

            //这里结束后，需要再运行一遍wx.request来执行sqlAttachment的记录添加，实现主表和附件表的关联

        }
    },
    checkInput: function () {
        var ok = true;
        if (this.data.title == undefined || this.data.title==""||this.data.title == null || this.data.type == undefined ||this.data.type==""|| this.data.type == null) {
            wx.showToast({
                title: '请输入待办事项',
                icon: 'none',
            })
            ok = flase;
        }
        return ok;
    },
    //时间
    changeDateTime(e) {
        var dateTimeStr = this.getCurrentDateTime();
        console.log(dateTimeStr);
        this.setData({
            dateTimeStr: dateTimeStr
        });
    },
    changeDateTimeColumn(e) {
        console.log(11);
        var arr = this.data.dateTime,
            dateArr = this.data.dateTimeArray;
        arr[e.detail.column] = e.detail.value;
        dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
        this.setData({
            dateTimeArray: dateArr,
            dateTime: arr
        });
    },
    getCurrentDateTime: function () {
        var dateTimeStr = this.data.dateTimeArray[0][this.data.dateTime[0]] + "-" + this.data.dateTimeArray[1][this.data.dateTime[1]] + "-" + this.data.dateTimeArray[2][this.data.dateTime[2]];
        dateTimeStr = dateTimeStr + " " + this.data.dateTimeArray[3][this.data.dateTime[3]] + "-" + this.data.dateTimeArray[4][this.data.dateTime[4]] + "-" + this.data.dateTimeArray[5][this.data.dateTime[5]];
        return dateTimeStr;
      },
})