// pages/device/file/file_modify.js
Page({
    data: {
        id:0,
        title:'',
        typr:'',
    },
    onLoad(options) {
        console.log(options.record);
        var record=JSON.parse(options.record);
        this.setData({
            id:record.id,
            title:record.title,
            type:record.type,
        })
    },

    onShareAppMessage() {

    },
    applySubmit: function (e) {
        console.log(JSON.stringify(e));
        let that = this;
        wx.showModal({
            title: '提示',
            content: '您确认要修改该条设备记录吗？',
            complete: (res) => {
                if (res.confirm) {
                    var id = that.data.id;
                    var title=that.data.title;
                    var type=that.data.type;
                    console.log(id);
                    console.log(title);
                    console.log(type);
                    wx.request({
                        url: 'http://localhost:8080/wxcruduse_war_exploded/device_file_servlet_action?action=modify_device_record',
                        data: {
                            "id": id,
                            "title":title,
                            "type":type,
                        },
                        header: {
                            "content-type": "application/x-www-form-urlencoded",
                            "x-requested-with": "XMLHttpRequest",
                        },
                        success: function (res) {
                           wx.navigateBack();
                        },
                        fail: function (res) {}

                    })
                }
            }
        })
    },
    inputTitle:function(e){
        this.setData({
            title:e.detail.value,
        });
    },
    inputType:function(e){
        this.setData({
            type:e.detail.value,
        });
    }



})