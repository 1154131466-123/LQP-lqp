

function initSections () {
    var main = document.querySelector('#main');
    var section = document.querySelector('#sections');

    if (!main || !section) {
        return;
    }

    var items = document.querySelectorAll('#sections > li');
    var height = Math.min(window.innerWidth, window.innerHeight);
    var width = Math.max(window.innerWidth, window.innerHeight);
    var isTheme1 = section.classList.contains('theme-1');
    var maxWidth = (isTheme1 ? 8570 : 8230) * height / 750;

    var getItemWidth = function (w) {
        return Math.floor(w * height / 750) + 'px';
    };

    section.style.width = maxWidth + 'px';
    main.style.height = height + 'px';

    if (isTheme1) {
        items[0].style.width = getItemWidth(1496);
    } else {
        items[0].style.width = getItemWidth(1246);
    }

    items[1].style.width = getItemWidth(1022);
    items[2].style.width = getItemWidth(980);
    items[3].style.width = getItemWidth(1050);
    items[4].style.width = getItemWidth(1598);
    items[5].style.width = getItemWidth(1006);
    items[6].style.width = getItemWidth(807);
    items[7].style.width = getItemWidth(614);
}

function seasonFoodSlider() {
    var ele = document.getElementById('food-info-slider');

    if (!ele) {
        return;
    }

    new SliderVertical({
        ele: ele,
        duration: 5,
        showAction: true,
        showNav: true,
        width: 302,
        height: ele.clientHeight,
        auto: false
    });
}

// 垂直滚动 slider
var SliderVertical = (function () {
    var Slider = function (settings) {
        this.options = {
            ele: null,
            duration: 5,
            speed: 0.5,
            width: 0,
            height: 200,
            showNav: true,
            showAction: false,
            showTitle: true,
            auto: true,
            touch: true,
            isScale: false,
            scaleDefault: 0.7,   // 两端副图放大倍数
            scaleZoom: 0.85,     // 中间主图放大倍数
            ratio: 0.28,         // 偏移系数
            itemClassName: 'slider-item',
            TitleClassName: 'slider-title',
            onInit: function () {},
            onBefore: function () {},
            onAfter: function () {}
        };

        this.current = 0;
        this.count = 0;
        this.offsetX = 0,
        this.items = [];
        this.navs = [];
        this.curSlide = null;
        this.curNav = null;
        this.timer = null;

        FD.extend(this.options, settings);
        init.call(this);
    };

    var init = function () {
        var that = this;

        if (this.options.ele == null) {
            throw new Error('ele param is not allow empty');
        } else if (typeof this.options.ele === 'string') {
            this.options.ele = document.querySelector(this.options.ele);
        }

        if (!this.options.isScale) {
            this.options.scaleDefault = 1;
            this.options.scaleZoom = 1;
        }

        if (this.options.scaleZoom === 1) {
            this.options.ratio = 0;
        }

        this.options.width = this.options.ele.clientWidth;
        this.offsetX = parseInt(this.options.width * this.options.ratio);
        this.items = this.options.ele.querySelectorAll('.' + this.options.itemClassName);
        this.count = this.items.length;
        this.outer = document.createElement('div');
        this.inner = document.createElement('div');
        this.outer.className = 'slider-outer';
        this.outer.style.height = this.options.height + 'px';
        this.inner.className = 'slider-inner';
        this.inner.style.height = this.options.height * (this.count + 2) + 'px';
        this.inner.style.transition = 'top '+ this.options.speed +'s';
        this.inner.style.webkitTransition = 'top '+ this.options.speed +'s';

        setTimeout(function () {
            that.outer.style.height = that.inner.clientHeight + 'px';
        }, 30);

        var first = this.items[0];
        var last = this.items[this.items.length - 1];

        this.items = [].slice.call(this.items);
        this.items.unshift(last.cloneNode(true));
        this.items.push(first.cloneNode(true));

        this.items.forEach(function (m) {
            m.style.width = that.options.width + 'px';
            m.style.height = that.options.height + 'px';
            m.style.transition = 'transform '+ that.options.speed +'s';
            m.style.webkitTransition = 'transform '+ that.options.speed +'s';
            setTransform(m, 'scale('+ that.options.scaleDefault +')');
            that.inner.appendChild(m);
        });

        this.outer.appendChild(this.inner);
        this.options.ele.appendChild(this.outer);
        this.top = -this.options.height;
        this.inner.style.top = this.top + 'px';
        this.prevSlide = this.items[this.current];
        this.nextSlide = this.items[this.current + 2];
        this.curSlide = this.items[this.current + 1];
        this.curSlide.style.zIndex = 2;

        setTransform(this.curSlide, 'scale('+ this.options.scaleZoom +')');
        this.curSlide.classList.add('item-active');
        setSideItems.call(this);
        renderAction.call(this);
        renderNav.call(this);
        renderTitle.call(this);
        initTouch.call(this);
        autoRun.call(this);
        this.options.ele.style.height = 'auto';
        this.options.ele.style.overflow = 'visible';
        this.options.onInit(this);
    };

    var autoRun = function () {
        var that = this;

        if (this.options.auto) {
            clearTimeout(this.timer);

            setTimeout(function () {
                that.next();

                that.timer = setTimeout(arguments.callee, that.options.duration * 1000);
            }, that.options.duration * 1000);
        }
    };

    var renderAction = function () {
        if (!this.options.showAction) {
            return;
        }

        var that = this;
        var $prev = document.createElement('a');
        var $next = document.createElement('a');

        $prev.className = 'btn-action btn-prev';
        $next.className = 'btn-action btn-next';
        that.options.ele.appendChild($prev);
        that.options.ele.appendChild($next);

        var clear = function () {
            clearTimeout(that.timer);
            clearTimeout(that.timeId);

            that.timeId = setTimeout(function () {
                autoRun.call(that);
            }, 3000);
        };

        $prev.addEventListener('click', function () {
            that.prev();
            clear();
        });
        
        $next.addEventListener('click', function () {
            that.next();
            clear();
        });
    };

    var renderNav = function () {
        if (!this.options.showNav) {
            return;
        }

        var nav = document.createElement('div');

        for (var i = 0; i < this.count; i++) {
            var link = document.createElement('a');

            if (i === 0) {
                link.className = 'on';
                this.curNav = link;
            }

            this.navs.push(link);
            nav.appendChild(link);
        }

        nav.className = 'slider-nav';
        this.options.ele.appendChild(nav);
    };

    var renderTitle = function () {
        var that = this;

        if (!this.options.showTitle) {
            return;
        }

        this.items.forEach(function (m, i) {
            var title = document.createElement('p');
            var img = m.querySelector('img');
            var text = (img && img.title) || '';

            if (i !== 1) {
                title.style.display = 'none';
            }

            title.className = that.options.TitleClassName;
            title.innerHTML = text;
            !text && (title.style.visibility = 'hidden');
            img && img.parentNode.appendChild(title);
        });
    };

    var cancelAnimate = function () {
        this.inner.style.transition = 'none';
        this.inner.style.webkitTransition = 'none';
    };

    var resetAnimate = function () {
        var that = this;
        var transition = 'top '+ that.options.speed +'s';

        setTimeout(function () {
            that.inner.style.transition = transition;
            that.inner.style.webkitTransition = transition;
        }, that.options.speed * 1000);
    };

    var setTransform = function (ele, value) {
        ele.style.transform = value;
        ele.style.webkitTransform = value;
    };

    var setSideItems = function () {
        setTransform(this.prevSlide, 'scale('+ this.options.scaleDefault +') translateX('+ this.offsetX +'px)');
        setTransform(this.nextSlide, 'scale('+ this.options.scaleDefault +') translateX(-'+ this.offsetX +'px)');
    };

    var setCurNav = function () {
        this.curNav.classList.remove('on');
        this.curNav = this.navs[this.current];
        this.curNav.classList.add('on');
    };

    var initTouch = function () {
        var that = this;

        if (!this.options.touch) {
            return;
        }

        this.inner.addEventListener('touchstart', function (event) {
            var touch = event.changedTouches[0];

            that.y1 = touch.clientY;
        });

        this.inner.addEventListener('touchmove', function (event) {
            var touch = event.changedTouches[0];

            that.y2 = touch.clientY;
        });
        
        this.inner.addEventListener('touchend', function () {
            var distance = that.y2 - that.y1;
            
            if (Math.abs(distance) < 30) {
                return;
            }

            if(distance > 0) {
                that.prev();
            } else {
                that.next();
            }

            clearTimeout(that.timer);
            clearTimeout(that.timeId);

            that.timeId = setTimeout(function () {
                autoRun.call(that);
            }, 3000);
        });
    };

    var onScroll = function () {
        var that = this;
        var setDisplay = function (el, type) {
            var tl = el.querySelector('.' + that.options.TitleClassName);

            tl && (tl.style.display = type);
        };

        var setIndex = function (el, index) {
            el.style.zIndex = index;
        };

        var setTitle = function () {
            if (!that.options.showTitle) {
                return;
            }

            setDisplay(that.prevSlide, 'none');
            setDisplay(that.nextSlide, 'none');
            setDisplay(that.curSlide, 'block');
        };

        this.items.forEach(function (m) {
            if (m === that.curSlide) {
                setTransform(that.curSlide, 'scale('+ that.options.scaleZoom +')');
                m.classList.add('item-active');
            } else {
                if (m !== that.prevSlide && m !== that.nextSlide) {
                    setTransform(m, 'scale('+ that.options.scaleDefault +')');
                }

                m.classList.remove('item-active');
            }
        });

        setIndex(that.prevSlide, 1);
        setIndex(that.nextSlide, 1);
        setIndex(that.curSlide, 2);
        setTitle();

        setTimeout(function () {
            setSideItems.call(that);
            setCurNav.call(that);
            that.options.onAfter(that);
        }, 100);
    };

    Slider.prototype.prev = function () {
        var that = this;

        this.options.onBefore(this);
        this.current--;
        this.top = this.top + that.options.height;
        this.inner.style.top = this.top + 'px';

        if (this.current < 0) {
            this.current = this.count - 1;

            setTimeout(function () {
                cancelAnimate.call(that);
                that.top = -(that.options.height * that.count);
                that.inner.style.top = that.top + 'px';
                resetAnimate.call(that);
            }, that.options.speed * 1000);
        }
        
        this.curSlide = this.items[this.current + 1];
        this.prevSlide = this.items[this.current];
        this.nextSlide = this.items[this.current + 2];
        onScroll.call(this);
    };

    Slider.prototype.next = function () {
        var that= this;

        this.options.onBefore(this);
        this.current++;
        this.top = this.top - that.options.height;
        this.inner.style.top = this.top + 'px';

        if (this.current === this.count) {
            this.current = 0;

            setTimeout(function () {
                cancelAnimate.call(that);
                that.top = -that.options.height;
                that.inner.style.top = that.top + 'px';
                resetAnimate.call(that);
            }, that.options.speed * 1000);
        }

        this.curSlide = this.items[this.current + 1];
        this.prevSlide = this.items[this.current];
        this.nextSlide = this.items[this.current + 2];

        onScroll.call(this);
    };

    return Slider;
})();

function exitFullscreen() {
    var fullscreenEnabled =
        document.fullscreenEnabled ||
        document.mozFullScreenEnabled ||
        document.webkitFullscreenEnabled ||
        document.msFullscreenEnabled;

    try {
        if (fullscreenEnabled) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
    } catch (e) {
        console.log(e);
    }
}

// 二十四节气首页
function initSectionsTabs () {
    var wrap = document.querySelector('#seasons');
    var main = document.querySelector('#main');
    var img = main.querySelector('img');

    if (!wrap) {
        return;
    }

    document.body.classList.add('seasons-bg');
    
    var items = wrap.querySelectorAll('li');
    var height = Math.min(window.innerHeight, window.innerWidth);
    var width = Math.max(window.innerHeight, window.innerWidth);

    setTimeout(function () {
        var offset = wrap.clientWidth - width;

        if (offset) {
            wrap.style.width = width + 'px';
            wrap.style.left = offset + 'px';
            img.style.left = offset + 'px';
            img.style.width = width + 'px';
        }
    }, 30);
    
    main.style.width = width + 'px';
    main.style.height = height + 'px';
    img.style.height = height + 'px';
    height = height / 3;

    [].forEach.call(items, function (m) {
        m.style.height = height + 'px';
    });

}

function listenOrientation () {
    var check = function () {
        if (window.orientation == 90 || window.orientation == -90) {
            FD.toast({msg: '请锁定竖屏方向以获最佳浏览效果', className: 'fd-toast-msg icon-lock', sec: -1});
        }
    }

    check();

    window.addEventListener('orientationchange', function () {
        check();
        location.reload();
    });
}