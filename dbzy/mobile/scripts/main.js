require.config({
    paths: {
        'FD': 'https://img.familydoctor.com.cn/component/common/scripts/fd-base-mobile-2.0.min',
        'app': 'app',
        'fk': 'https://img.familydoctor.com.cn/component/common/scripts/fastclick',
        'ns': 'https://img.familydoctor.com.cn/component/common/scripts/native-share',
        'wx': 'https://res.wx.qq.com/open/js/jweixin-1.2.0'
    },
    shim: {
        'FD': {
            deps: ['wx']
        },
        'ns': {
            deps: ['FD']
        },
        'app': {
            deps: ['FD', 'ns']
        },
    }
});

require(['wx'], function (wx) {
    window.wx = wx;
});

require(['FD'], function (FD) {
    window.FD = FD;
});

require(['fk'], function (FastClick) {
    window.FastClick = FastClick;
});

require(['ns']);
require(['app']);