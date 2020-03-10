//index.js
// 获取数据库的引用 (默认数据库)
const db = wx.cloud.database()
const _ = db.command
const admin = db.collection('userinfo')

// 获取输入用户名和密码 (方法二,已舍弃)
// let name = null;
// let password = null;

// 引用app()实例
const app = getApp()

Page({

  data: {
    // 默认显示授权按钮关闭用户面板,用于授权
    showView: false,
    showButton: true,

    // 用户信息
    nickName: null,
    avatarUrl: null
  
  },

  /* 
    方法一：授权登录
  */
  onLoad:function(){
    let that = this;
    // 查看是否授权
    wx.getSetting({
      success: function(res){
        if (res.authSetting['scope.userInfo']) {
          // 获取用户信息（授权后才可调用）
          wx.getUserInfo({
            success: (userRes)=> {
              that.setData({
                nickName: userRes.userInfo.nickName,
                avatarUrl: userRes.userInfo.avatarUrl,
                show: false,
                showView: (!that.data.showView),
                showButton: (!that.data.showButton)
              })
              // 打印消息(测试，说明该页面的nickName已经被赋值为为用户信息)
              //console.log(that.data.nickName)
            }
          })
          
        }else{
          console.log("未授权，需手动点击")
        }
      }
    })
  },

  /* 
    点击“授权”
  */
  bindgetuserinfo:function(res) {
    let that = this
    // 获取用户信息 (基于按钮的open-type="getUserInfo"属性才可调用)
    wx.getUserInfo({
      success: (userRes)=> {
        //console.log(userRes)

        // 查询是否已注册
        admin.where({
          nickName: _.eq(userRes.userInfo.nickName)
        }).get({         
            success: (searchRes) => {
              // 设置页面用户信息
              that.setData({
                nickName: userRes.userInfo.nickName,
                avatarUrl: userRes.userInfo.avatarUrl,
                show: false,
                showView: (!that.data.showView),
                showButton: (!that.data.showButton)
              })
              if (searchRes.data.length != 0) {
                console.log("已经注册,直接展示信息")
              }
              else {
                admin.add({
                  data: {
                    nickName: userRes.userInfo.nickName,
                    avatarUrl: userRes.userInfo.avatarUrl,
                    // 以下信息也可添加
                    // gender: userRes.userInfo.gender,
                    // city: userRes.userInfo.city,
                    // province: userRes.userInfo.province,
                    // country: userRes.userInfo.country

                  },
                  success: (res) => {
                    //console.log(res._id) // 此处为id
                    console.log('注册成功！')
                  }
                })
              }
            }
          }),
        // 将获取到的用户资料写入app.js全局变量(可能会用到)
          app.globalData.nickName = userRes.userInfo.nickName,
          app.globalData.avatarUrl = userRes.userInfo.avatarUrl

      }
    })
  },
 
  
  /* 
    方法二：注册登录(舍弃)
  */
  // // 点击‘注册’触发 (事件处理函数)
  // goToRegister: function () {
  //   wx.navigateTo({
  //     url: '../register/register',
  //   })
  // },

  // // 输入用户名
  // inputusrname(event) {
  //   name = event.detail
  //   //console.log("name: ", name)
  // },

  // // 输入密码
  // inputpassword(event) {
  //   password = event.detail
  //   //console.log("password: ", password)
  // },

  // // 点击‘登录’触发
  // loginVerification: function () {
  //   // 查询是否已注册
  //   admin.where({
  //     username: _.eq(name),
  //     password: _.eq(password)
  //   })
  //     .get({
  //       success: (res) => {
  //         //console.log(res.data[0].username)
  //         if (res.data.length === 1) {
  //           //console.log(res.data)
  //           wx.redirectTo({
  //             url: '../main/main',
  //           })
  //         }
  //         else {
  //           wx.showToast({
  //             title: '账号未注册！',
  //             icon: 'none',
  //             duration: 1000,
  //             // 延迟执行跳转
  //             success(data) {
  //               setTimeout(function () {
  //                 wx.navigateTo({
  //                   url: '../register/register'
  //                 })
  //               }, 1000) //延迟时间
  //             }
  //           })
  //         }
  //       }
  //     })
  // }

})
