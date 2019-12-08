require.config({
    paths: {
        'FD': 'https://img.familydoctor.com.cn/component/common/scripts/fd-base-mobile-2.0.min',
        'fk': 'https://img.familydoctor.com.cn/component/common/scripts/fastclick',
        'app': 'app'
    },
    shim: {
        'app': {
            deps: ['FD', 'fk']
        },
    }
});

require(['FD'], function (FD) {
    window.FD = FD;
});

require(['fk'], function (FastClick) {
    window.FastClick = FastClick;
});

require(['app']);