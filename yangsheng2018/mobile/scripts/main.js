require.config({
    paths: {
        'wechat': 'https://img.familydoctor.com.cn/component/common/scripts/wechat.min',
        'wx': 'https://res.wx.qq.com/open/js/jweixin-1.4.0',
        'FD': 'https://img.familydoctor.com.cn/component/common/scripts/fd-base-mobile-2.0.min'
    },
    shim: {
        'app': { 
            deps: ['FD']
        }
    }
});

require(['FD'], function (FD) {
    window.FD = FD;

    if (FD.isWeiXin()) {
        require(['wechat'], function (wechat) {
            FD.ready(function () {
                wechat.initShare();
            });
        });
    }

    require(['app'], function () {
        listenOrientation();
        exitFullscreen();
        initSections();
        seasonFoodSlider();
        initSectionsTabs();
    });
});