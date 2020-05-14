function Transition( transformName, properties = {}, duration = 0, ease = 'ease', callback = function () { }, complete = true) {
    let pages = getCurrentPages();
    let page=pages[pages.length - 1];
    let csses = {};
    let defaults = { delay: 0, origin: '50% 50% 0' };
    Object.assign(csses, defaults, properties);
    // console.log(csses);
    let delay = csses.delay;
    let transformCount = 0;
    let transformOther = 0;
    let cssTransition = '';
    let cssTransitionProperty = '';
    let cssTransform = 'transform:';
    let cssTransformOrigin = 'transform-origin: ' + csses.origin + ';';
    let cssOther = '';
    let cssTarget = '';
    let cssTotal = '';
    for (let key in csses) {
        if (setter[key]) {
            transformCount++;
            let name = '';
            if (key == 'x') { name = 'translateX'; }
            else if (key == 'y') { name = 'translateY'; }
            else if (key == 'z') { name = 'translateZ'; }
            else { name = key; }
            let value = setter[key](csses[key]);
            cssTransform += ' ' + name + '(' + value + ')';
        }//end if
        else {
            if (key != 'origin' && key != 'delay') {
                transformOther++;
                cssOther += ' ' + key + ':' + csses[key] + ';'
            }//edn if
        }//edn else
    }//edn for
    cssTransform = transformCount > 0 ? cssTransform + ';' : '';
    if (duration > 0) {
        cssTransitionProperty = transformOther > 0 ? 'all' : 'transform';
        cssTransition = 'transition: ' + cssTransitionProperty + ' ' + duration + 'ms ' + ease + ' ' + 0 + 'ms' + '; ';
    }//edn if
    cssTarget = cssTransform + ' ' + cssTransformOrigin + cssOther;
    cssTotal = cssTransition + cssTarget;
    // console.log(cssTotal);
    if (page && transformName && transformName != '') {
        setTimeout(function () {
            page.setData({
                [transformName]: cssTotal
            });
        }, delay);
        setTimeout(function () {
            if (complete && duration > 0) {
                page.setData({
                    [transformName]: cssTarget
                });
            }//end if
            callback(page, cssTotal);
        }, duration + delay);
    }//end if
    return cssTotal;
}//edn func

module.exports = Transition;

let setter = {
    rotate: function (theta = 0) {
        return unit(theta, 'deg');
    },
    rotateX: function (theta = 0) {
        return unit(theta, 'deg');
    },
    rotateY: function (theta = 0) {
        return unit(theta, 'deg');
    },
    rotateZ: function (theta = 0) {
        return unit(theta, 'deg');
    },
    scale: function (value = 1) {
        return value + ',' + value;
    },
    scaleX: function (value = 1) {
        return value;
    },
    scaleY: function (value = 1) {
        return value;
    },
    scaleZ: function (value = 1) {
        return value;
    },
    skewX: function (x = 0) {
        return unit(x, 'deg');
    },
    skewY: function (y = 0) {
        return unit(y, 'deg');
    },
    x: function (x = 0) {
        return unit(x, 'px');
    },
    y: function (y = 0) {
        return unit(y, 'px');
    },
    z: function (z = 0) {
        return unit(z, 'px');
    },
    translateX: function (x = 0) {
        return unit(x, 'px');
    },
    translateY: function (y = 0) {
        return unit(y, 'px');
    },
    translateZ: function (z = 0) {
        return unit(z, 'px');
    },
    translate: function (ary) {
        ary[0] = ary[0] || 0;
        ary[1] = ary[1] || 0;
        return unit(ary[0], 'px') + ',' + unit(ary[1], 'px');
    },
    translate3d: function (ary) {
        ary[0] = ary[0] || 0;
        ary[1] = ary[1] || 0;
        ary[2] = ary[2] || 0;
        return unit(ary[0], 'px') + ',' + unit(ary[1], 'px') + ',' + unit(ary[2], 'px');
    }
};//end setter

function unit(i, units) {
    if ((typeof i === "string") && (!i.match(/^[\-0-9\.]+$/))) {
        return i;
    } else {
        return "" + i + units;
    }
}//edn func