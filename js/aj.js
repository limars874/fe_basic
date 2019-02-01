/***** 全局参数 *****/
window.wv = {};
wv.generalHost = 'http://www.somepage.com'
wv.apiHost = wv.generalHost + '/server';			//api地址
wv.staticHost = wv.generalHost;			//静态服务器地址
wv.baseHost = wv.generalHost;		//页面的地址，用于分享
wv.userinfo = null

/**
 * weixin分享
 */



//网页授权以及返回用户数据
get("/api/lottery/info", {}, function (data) {
  wv.userinfo = data
  console.log(wv.userinfo)
})



function wechatshare() {
  //获取jssdk相关数据 分享 如config等
  get('/api/index', {}, function (data) {
      wechatinit(data.wechatConfig, function () {
        share({
          link: 'http://www.somepage.com/index.html',
          title: 'share title',
          desc: 'share desc',
          imgUrl:'http://www.somepage.com/img/cover.jpg'
        })
      })
  })
}
wechatshare()

/**
 * 分享初始化
 * @param data
 * @param ready
 */
function wechatinit(data, ready) {
  data.debug = false
  wx.config(data)
  wx.ready(function () {
    ready && ready()
  })
}



/**
 * 通用请求包装
 * @param {Object} method        方法： get post,put
 * @param {Object} api          api地址
 * @param {Object} data            请求数据
 * @param {Function} success(data)      成功回调
 * @param {Function} fail(result:code,msg)    失败毁掉
 */
function request(method, api, data, success, fail) {
  $.ajax({
    type: method,
    timeout: 20 * 1000,
    data: method.toLowerCase() == 'get' ? data : JSON.stringify(data),
    headers: {
      "Content-Type": 'application/json',
      "x-page-href": location.href
    },
    url: wv.apiHost + api,
    dataType: "json",
    success: function (result) {
      if (result.code == 0) {
        success && success.call(this, result.data)
      } else {
        if (result.code == 403) {
          return window.location.href = result.data.oauthUrl
        }
        fail && fail.call(this, result)
      }
    },
    error: function (e) {
      alert('请求失败，请刷新重试')
    }
  })
}

/**
 * 通用请求包装
 * @param {Object} api          api地址
 * @param {Function} success(data)      成功回调
 * @param {Function} fail(result:code,msg)    失败回调
 */
function get(api, data, success, fail) {
  request("get", api, data, success, fail)
}

/**
 * 通用请求包装
 * @param {Object} api          api地址
 * @param {Object} data            请求数据
 * @param {Function} success(data)      成功回调
 * @param {Function} fail(result:code,msg)    失败毁掉
 */
function post(api, data, success, fail) {
  request('post', api, data, success, fail)
}


/**
 * 通用请求包装
 * @param {Object} api          api地址
 * @param {Object} data            请求数据
 * @param {Function} success(data)      成功回调
 * @param {Function} fail(result:code,msg)    失败毁掉
 */
function put(api, data, success, fail) {
  request('put', api, data, success, fail)
}


/**
 * 简单的模板渲染
 * @param {Object} tplUrl    模板的ID
 * @param {Object} data    模板渲染数据
 */
function render(tplUrl, data) {
  var template = $("#" + tplUrl).html()
  if (!template) {
    console.error('模板不存在....')
  }
  for (var k in data) {
    template = template.replace("${" + k + "}", data[k])
  }
  return template
}


//分享初始化
function init(data, ready) {
  data.debug = false
  wx.config(data)
  wx.ready(function () {
    ready && ready()
  })
}

//分享,用法如下
/**
 * init(wechatconfig,function(){
			share({
				link:'http://xxxx',
				title:'title',
				desc:'description',
				imgUrl:'http://xmay.yun-net.cn/img/cover.jpg'

			})
		})
 注：weichatconfig从api获取
 * @param data
 */
function share(data) {
  wx.onMenuShareAppMessage(data)
  wx.onMenuShareQQ(data)
  wx.onMenuShareWeibo(data)
  wx.onMenuShareQZone(data)
  wx.onMenuShareTimeline(data)
}

//获取get请求参数
function GetQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return decodeURI(r[2]);
  return null;
}
