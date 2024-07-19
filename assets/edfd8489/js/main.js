// page init
jQuery(function($){
    $("#wrapper a[href^='http://'],#wrapper a[href^='https://']").attr("target", "_blank");

    $('#delete-pic').click(function(event) {
        event.preventDefault();
        var $this = $(this);

        $.post($(this).attr('href'), function(data) {
            $(".user-profile-photo img").attr("src", data);
            $this.closest('li').addClass("disabled");
        });
    });

    $( ".exercise" ).on( "submit", "form", function( event ) {
        event.preventDefault();
        var form = $(this);
        var data = form.serialize();
        var offset = $(form).offset();
        $(form).closest('.exercise').removeClass('exercise-done');
        $.post('', data, function(response) {
            var id= $(form).attr('id');
            var element =  $($.parseHTML(response)).find('#'+id);
            $(form).replaceWith($(element));
            $(element).closest('.exercise').addClass('exercise-done');
            $(element).closest('.exercise').exercise();
            $(element).closest('.exercise').find('.exercise-item .vk').keyboard();
            SITE.utils.initSoundPlayer();
            //$('html,body').animate({scrollTop: offset.top}, 1000);
        });
        return false;
    });

    //$(".exercise-done").on( "input change", ".form-control", function( event ) {
    //    $(this).removeClass('input-error').closest('.exercise-item').removeClass('item-error');
    //});

    $('.help-block.error').not(':empty').closest('.form-group').addClass('has-error')
        .closest('.change-form').removeClass('hide')
        .siblings('.change-link').addClass('hide');

    $('.exercise').exercise();

    var jsplayer = $('<div id="jquery_jplayer" class="jp-jplayer"></div>');
    $('body').append(jsplayer);

    $(jsplayer).jPlayer({
        swfPath: "",
        wmode: "window",
        //cssSelectorAncestor: "#jp_container",
        supplied: "mp3, oga",
        preload: "true"
    });

    $(document).on('click.sound', '.sound', function(e){
        var sound_mp3 = $(this).is("a") ? $(this).attr("href") : ($(this).data("sound") ? $(this).data("sound") : $(this).find("a").attr("href"));
        if (!sound_mp3 || sound_mp3 == "" || sound_mp3 == "#") return;
        var sound_ogg = sound_mp3.substring(0, sound_mp3.lastIndexOf(".")) + ".ogg";
        $(jsplayer).jPlayer("setMedia", {
            mp3: sound_mp3,
            oga: sound_ogg
        }).jPlayer("play");
    });

    SITE.utils.initSoundPlayer();

    $('.popovertrigger').popover({
        html : true,
        content: function() {
            if ($(this).data("target")) {
                var el = $(this).data("target");
                return $(el).html();
            }
        }
    });

    $('.exercise-done').on('mouseover.answer', '.input-error', function(e){
        $(this).tooltip();
    });

    $('.translation .orig[title]').addClass('tip').tooltip();

    if (SITE.isAuth) {
        $('.sentence var, sentence var').click(function() {
            var e=$(this);
            var w=$(this).html();
            e.unbind('click');
            $.get(SITE.dict.route, { word: w} )
                .done(function( data ) {
                    e.popover({content: data,html:true,placement:'bottom',container:'body'}).on('show.bs.popover', function () {
                        $('.sentence var, sentence var').not(this).each(function () {
                            var popover = $.data(this, "bs.popover");
                            if (popover)
                                $(this).popover('hide');
                        });
                    }).popover('show');
                }
            );
        });
        SITE.utils.initKeyboard();
    }
});

(function (s, a) {
    a.trim = function() {
        return this.replace(/^\s+|\s+$/g,"");
    };
    s.utils.goto = function(url,page) {
        document.location = url + '/' + page;
    }
    s.utils.submitForm = function(el) {
        $(el).closest('form').submit();
    }
    s.utils.resetForm = function(el) {
        $(el).closest('form').find('input').each(function(){
            var type = $(this).attr('type');
            if (type == 'checkbox')
                $(this).prop('checked',false);
            if (type == 'text')
                $(this).val('');
        });
    }
    s.utils.toggleKeyboard = function(e) {
        if (e === true) $('.vk').keyboard('enable');
        else $('.vk').keyboard('disable');
    }
    s.utils.initSoundPlayer = function() {
        $('.soundplayer').each(function() {
            $(this).soundplayer();
            $(this).removeClass('soundplayer');
        });
    }
    s.utils.initKeyboard = function () {
        $('.exercise-item .vk').keyboard();
    }
    s.utils.initMailcheck = function(element,confirm) {
        $(element).on('blur', function() {
            $(this).mailcheck({
                domains: ["gmail.com","hotmail.com","yahoo.com","wp.pl","o2.pl","interia.pl","mail.ru","op.pl","seznam.cz",
                    "hotmail.fr","azet.sk","net.hr","yahoo.fr","onet.pl","centrum.sk","vp.pl","live.com","outlook.com",
                    "poczta.onet.pl","onet.eu","tlen.pl","yandex.ru","interia.eu","poczta.fm","yahoo.de","live.fr",
                    "orange.fr","windowslive.com","centrum.cz","laposte.net","ymail.com","hotmail.it","email.cz",
                    "gazeta.pl","icloud.com","libero.it","outlook.fr","siol.net","web.de","zoznam.sk","free.fr",
                    "gmx.de","rambler.ru","hotmail.de","buziaczek.pl","yahoo.it","wanadoo.fr","msn.com","ukr.net",
                    "autograf.pl","bk.ru","yahoo.co.uk","googlemail.com","aol.com","amorki.pl","list.ru","inbox.ru",
                    "spoko.pl","abv.bg","me.com","pobox.sk","sfr.fr","live.it","onet.com.pl","gmx.at","yahoo.pl",
                    "bluewin.ch","hotmail.co.uk","mail.com","t-online.de","rocketmail.com","inet.hr","live.de","atlas.sk"],
                topLevelDomains: ["co.jp", "co.uk", "com", "net", "org", "info", "edu", "gov", "mil", "ca", "de", "fr", "es", "pl", "ru", "cz", "br", "nl", "au", "mx", "jp", "kr", "cn", "se"],
                suggested: function(e, t) {
                    var n = $('<div class="mailcheck_suggestion small help-block">'+confirm.replace('{email}', '<a class="internal" href=":;">'+t.full+'</a>')+'</div>');
                    n.find("a").on("click", function (n) {
                        n.preventDefault();
                        e.siblings(".mailcheck_suggestion").remove();
                        e.val(t.full);
                    });
                    e.siblings(".mailcheck_suggestion").remove();
                    $(n).insertAfter(e);
                },
                empty: function(e) {
                    e.siblings(".mailcheck_suggestion").remove();
                }
            });
        });
    }
})(SITE, String.prototype);


(function($){

    $.fn.soundplayer = function(o) {
        o = $.extend({
        }, o);

        return this.each(function() {
            var player = this;
            var sound_mp3 = $(this).is("a") ? $(this).attr("href") : ($(this).data("sound") ? $(this).data("sound") : $(this).find("a").attr("href"));
            if (!sound_mp3 || sound_mp3 == "" || sound_mp3 == "#") return;
            var sound_ogg = sound_mp3.substring(0, sound_mp3.lastIndexOf(".")) + ".ogg";
            //var num = sound_mp3.substring(sound_mp3.lastIndexOf("/")+1, sound_mp3.lastIndexOf(".")) + Math.floor((Math.random()*1000)+1);
            var id = $(player).attr('id');

            $(this).jPlayer({
                ready: function () {
                    $(this).jPlayer( "setMedia", {
                        mp3: sound_mp3,
                        oga: sound_ogg
                    });
                },
                play: function() {$(this).jPlayer("pauseOthers")},
                swfPath: '',
                solution: 'html, flash',
                supplied: 'mp3, oga',
                preload: 'metadata',
                volume: 0.8,
                muted: false,
                backgroundColor: '#000000',
                cssSelectorAncestor: '#'+id+'_container',
                remainingDuration: true,
                cssSelector: {
                    play: '.play',
                    pause: '.jp-state-playing .play',
                    stop: '.jp-stop',
                    seekBar: '.seek-bar',
                    playBar: '.play-bar',
                    duration: '.duration',
                    title: '.title',
                    noSolution: '.no-solution'
                },
                wmode: "window",
                globalVolume: true,
                useStateClassSkin: true,
                errorAlerts: false,
                warningAlerts: false
            });
        });
    }
})(jQuery);

$.fn.scrollTo = function( target, options, callback ){
    if(typeof options == 'function' && arguments.length == 2){ callback = options; options = target; }
    var settings = $.extend({
        scrollTarget  : target,
        offsetTop     : 50,
        duration      : 500,
        easing        : 'swing'
    }, options);
    return this.each(function(){
        var scrollPane = $(this);
        var scrollTarget = (typeof settings.scrollTarget == "number") ? settings.scrollTarget : $(settings.scrollTarget);
        var scrollY = (typeof scrollTarget == "number") ? scrollTarget : scrollTarget.offset().top + scrollPane.scrollTop() - parseInt(settings.offsetTop);
        scrollPane.animate({scrollTop : scrollY }, parseInt(settings.duration), settings.easing, function(){
            if (typeof callback == 'function') { callback.call(this); }
        });
    });
}

$.fn.exercise = function(o) {
    o = $.extend({
        type: 'exercise3'
    }, o);
    var that = this;

    this.each(function() {
        var type = $(this).data("type") || o.type,
            id = $(this).attr("id"),
            loaded = false,
            isDone = $(this).hasClass('exercise-done'),
            init = function() {
                $('.input-error').tooltip();
                $('input.autoresize').autoGrowInput({
                    comfortZone: 0,
                    minWidth: 10,
                    maxWidth: 300
                }).attr("autocapitalize", "off");
                if (type == 'exercise3') {
                    $(that).find(".drag-items").sortable({
                        connectWith: ".drag-items",
                        items: ".drag-item",
                        tolerance: 'pointer',
                        cursorAt: { left: 0, top: 0 },
                        placeholder: "ui-state-highlight",
                        stop: function( event, ui ) {
                            console.log(event);
                            $(that).find('.drop-area').each(function() {
                                var item = this;
                                var glue = ';';
                                var value = "";
                                if ($(item).find(".drag-item").size()) {
                                    $(item).find(".drag-item").each(function(){
                                        value += ($(this).data("value")+glue);
                                    });
                                    $(item).parent().find("input").val(value);
                                } else {
                                    $(item).parent().find("input").val("");
                                }
                            });
                        },
                        start: function( event, ui ) {
                            $(that).removeClass('exercise-done');
                        }
                    }).disableSelection()
                }

            };
        init();
    });
    return this;
};

jQuery.fn.extend({
    insertAtCaret: function(text){
        return this.each(function() {
            if (document.selection && this.tagName == 'TEXTAREA') {
                //IE textarea support
                this.focus();
                sel = document.selection.createRange();
                sel.text = text;
                sel.moveStart ('character', 0);
                this.focus();
            } else if (this.selectionStart || this.selectionStart == '0') {
                //MOZILLA/NETSCAPE support
                startPos = this.selectionStart;
                endPos = this.selectionEnd;
                scrollTop = this.scrollTop;
                this.value = this.value.substring(0, startPos) + text + this.value.substring(endPos, this.value.length);
                this.focus();
                this.selectionStart = startPos + text.length;
                this.selectionEnd = startPos + text.length;
                this.scrollTop = scrollTop;
            } else {
                // IE input[type=text] and other browsers
                this.focus();
                $(this).trigger('focus.placeholder');
                this.value += text;
                this.focus();
                //this.value = this.value;    // forces cursor to end
            }
        });
    }
});

!function($) {
    "use strict"

    var chars = ['áčďéěíňóřšťúůýž','ÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ'];

    var popup = $('<ul class="vk-popup" style="display:none;" />');

    var Keyboard = function ( element, options ) {
        this.init('keyboard', element, options );
    }

    var activeElement;

    Keyboard.prototype = {
        constructor: Keyboard,

        init: function (type, element, options) {
            this.type = type;
            this.$element = $(element);
            this.enabled = true;
            this.options = this.getOptions(options);
            this.$element.on('focus.' + this.type, false, $.proxy(this.enter, this));
            this.$element.on('blur.' + this.type, false, $.proxy(this.leave, this));
            this.$element.on('keyup.' + this.type + ', keydown.' + this.type, false, $.proxy(this.onKeyDown, this));
        },

        getOptions: function (options) {
            options = $.extend({}, $.fn[this.type].defaults, this.$element.data(), options);
            return options;
        },

        enter: function (e) {
            if (activeElement!==e.target){
                this.showKeyboard();
            }
            activeElement = e.target;
        },

        leave: function (e) {
            var el = this.$element;
            setTimeout(function() {
                if ($(activeElement).is(":focus")) {
                } else {
                    $(popup).hide( "fast", function() {
                        activeElement = null;
                        $(popup).detach();
                    });
                }
            },500);
        },

        onKeyDown: function(e) {
            if (e.shiftKey) {
                popup.addClass('shifted');
            } else {
                popup.removeClass('shifted');
            }
        },

        showKeyboard: function() {
            if (this.enabled) {
                popup.empty();
                var letter;
                var el = this.$element;
                for (var i=0; i<chars[0].length; i++) {
                    letter=$('<li class="vk-letter" />').text(chars[0].charAt(i));
                    popup.append(letter);
                }
                for (var i=0; i<chars[1].length; i++) {
                    letter=$('<li class="vk-letter vk-shifted" />').text(chars[1].charAt(i));
                    popup.append(letter);
                }
                $(popup).find('.vk-letter').on('click.' + this.type, false, $.proxy(this.insert, this));

                $('body').append(popup);
                $(popup).show('fast');
            }
        },

        insert: function(e) {
            e.preventDefault();
            var char = $(e.target).text();
            $(this.$element).insertAtCaret(char);
            $(this.$element).trigger("update");
        },

        enable: function () {
            this.enabled = true;
        },

        disable: function () {
            this.enabled = false;
            this.leave();
        }
    }


    $.fn.keyboard = function (option) {
        return this.each(function () {
            var $this = $(this)
                , data = $this.data('keyboard')
                , options = typeof option == 'object' && option
            if (!data) $this.data('keyboard', (data = new Keyboard(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }

    $.fn.keyboard.Constructor = Keyboard;

    $.fn.keyboard.defaults = {};

}(window.jQuery);

(function($){
    $.fn.autoGrowInput = function(o) {
        o = $.extend({
            maxWidth: 1000,
            minWidth: 10,
            comfortZone: 70
        }, o);

        this.filter('input:text').each(function(){

            var minWidth = o.minWidth || $(this).width(),
                val = '',
                input = $(this),
                testSubject = $('<tester/>').css({
                    position: 'absolute',
                    top: -9999,
                    left: -9999,
                    width: 'auto',
                    fontSize: input.css('fontSize'),
                    fontFamily: input.css('fontFamily'),
                    fontWeight: input.css('fontWeight'),
                    letterSpacing: input.css('letterSpacing'),
                    whiteSpace: 'nowrap'
                }),
                check = function() {
                    if (val === (val = input.val())) {return;}
                    var escaped = val.replace(/&/g, '&amp;').replace(/\s/g,'&nbsp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                    testSubject.html(escaped);
                    var testerWidth = testSubject.width(),
                        newWidth = (testerWidth + o.comfortZone) >= minWidth ? testerWidth + o.comfortZone : minWidth,
                        currentWidth = input.width(),
                    //isValidWidthChange = (newWidth < currentWidth && newWidth >= minWidth)
                    //|| (newWidth > minWidth && newWidth < o.maxWidth);
                        isValidWidthChange = true;

                    // Animate width
                    if (isValidWidthChange) {
                        input.width(newWidth);
                    }

                };

            testSubject.insertAfter(input);

            $(this).bind('keyup keydown blur update', check);
            if (input.val() != '') check();

        });

        return this;

    };

})(jQuery);


/*!
 * Infinite Ajax Scroll, a jQuery plugin
 * Version 1.0.2
 * https://github.com/webcreate/infinite-ajax-scroll
 *
 * Copyright (c) 2011-2013 Jeroen Fiege
 * Licensed under MIT:
 * https://raw.github.com/webcreate/infinite-ajax-scroll/master/MIT-LICENSE.txt
 */
(function(e){"use strict";Date.now=Date.now||function(){return+(new Date)},e.ias=function(t){function u(){var t;i.onChangePage(function(e,t,r){s&&s.setPage(e,r),n.onPageChange.call(this,e,r,t)});if(n.triggerPageThreshold>0)a();else if(e(n.next).attr("href")){var u=r.getCurrentScrollOffset(n.scrollContainer);E(function(){p(u)})}return s&&s.havePage()&&(l(),t=s.getPage(),r.forceScrollTop(function(){var n;t>1?(v(t),n=h(!0),e("html, body").scrollTop(n)):a()})),o}function a(){c(),n.scrollContainer.scroll(f)}function f(){var e,t;e=r.getCurrentScrollOffset(n.scrollContainer),t=h(),e>=t&&(m()>=n.triggerPageThreshold?(l(),E(function(){p(e)})):p(e))}function l(){n.scrollContainer.unbind("scroll",f)}function c(){e(n.pagination).hide()}function h(t){var r,i;return r=e(n.container).find(n.item).last(),r.size()===0?0:(i=r.offset().top+r.height(),t||(i+=n.thresholdMargin),i)}function p(t,r){var s;s=e(n.next).attr("href");if(!s)return n.noneleft&&e(n.container).find(n.item).last().after(n.noneleft),l();if(n.beforePageChange&&e.isFunction(n.beforePageChange)&&n.beforePageChange(t,s)===!1)return;i.pushPages(t,s),l(),y(),d(s,function(t,i){var o=n.onLoadItems.call(this,i),u;o!==!1&&(e(i).hide(),u=e(n.container).find(n.item).last(),u.after(i),e(i).fadeIn()),s=e(n.next,t).attr("href"),e(n.pagination).replaceWith(e(n.pagination,t)),b(),c(),s?a():l(),n.onRenderComplete.call(this,i),r&&r.call(this)})}function d(t,r,i){var s=[],o,u=Date.now(),a,f;i=i||n.loaderDelay,e.get(t,null,function(t){o=e(n.container,t).eq(0),0===o.length&&(o=e(t).filter(n.container).eq(0)),o&&o.find(n.item).each(function(){s.push(this)}),r&&(f=this,a=Date.now()-u,a<i?setTimeout(function(){r.call(f,t,s)},i-a):r.call(f,t,s))},"html")}function v(t){var n=h(!0);n>0&&p(n,function(){l(),i.getCurPageNum(n)+1<t?(v(t),e("html,body").animate({scrollTop:n},400,"swing")):(e("html,body").animate({scrollTop:n},1e3,"swing"),a())})}function m(){var e=r.getCurrentScrollOffset(n.scrollContainer);return i.getCurPageNum(e)}function g(){var t=e(".ias_loader");return t.size()===0&&(t=e('<div class="ias_loader">'+n.loader+"</div>"),t.hide()),t}function y(){var t=g(),r;n.customLoaderProc!==!1?n.customLoaderProc(t):(r=e(n.container).find(n.item).last(),r.after(t),t.fadeIn())}function b(){var e=g();e.remove()}function w(t){var r=e(".ias_trigger");return r.size()===0&&(r=e('<div class="ias_trigger"><a href="#">'+n.trigger+"</a></div>"),r.hide()),e("a",r).unbind("click").bind("click",function(){return S(),t.call(),!1}),r}function E(t){var r=w(t),i;n.customTriggerProc!==!1?n.customTriggerProc(r):(i=e(n.container).find(n.item).last(),i.after(r),r.fadeIn())}function S(){var e=w();e.remove()}var n=e.extend({},e.ias.defaults,t),r=new e.ias.util,i=new e.ias.paging(n.scrollContainer),s=n.history?new e.ias.history:!1,o=this;u()},e.ias.defaults={container:"#container",scrollContainer:e(window),item:".item",pagination:"#pagination",next:".next",noneleft:!1,loader:'<img src="images/loader.gif"/>',loaderDelay:600,triggerPageThreshold:3,trigger:"Load more items",thresholdMargin:0,history:!0,onPageChange:function(){},beforePageChange:function(){},onLoadItems:function(){},onRenderComplete:function(){},customLoaderProc:!1,customTriggerProc:!1},e.ias.util=function(){function i(){e(window).load(function(){t=!0})}var t=!1,n=!1,r=this;i(),this.forceScrollTop=function(i){e("html,body").scrollTop(0),n||(t?(i.call(),n=!0):setTimeout(function(){r.forceScrollTop(i)},1))},this.getCurrentScrollOffset=function(e){var t,n;return e.get(0)===window?t=e.scrollTop():t=e.offset().top,n=e.height(),t+n}},e.ias.paging=function(){function s(){e(window).scroll(o)}function o(){var t,s,o,f,l;t=i.getCurrentScrollOffset(e(window)),s=u(t),o=a(t),r!==s&&(f=o[0],l=o[1],n.call({},s,f,l)),r=s}function u(e){for(var n=t.length-1;n>0;n--)if(e>t[n][0])return n+1;return 1}function a(e){for(var n=t.length-1;n>=0;n--)if(e>t[n][0])return t[n];return null}var t=[[0,document.location.toString()]],n=function(){},r=1,i=new e.ias.util;s(),this.getCurPageNum=function(t){return t=t||i.getCurrentScrollOffset(e(window)),u(t)},this.onChangePage=function(e){n=e},this.pushPages=function(e,n){t.push([e,n])}},e.ias.history=function(){function n(){t=!!(window.history&&history.pushState&&history.replaceState),t=!1}var e=!1,t=!1;n(),this.setPage=function(e,t){this.updateState({page:e},"",t)},this.havePage=function(){return this.getState()!==!1},this.getPage=function(){var e;return this.havePage()?(e=this.getState(),e.page):1},this.getState=function(){var e,n,r;if(t){n=history.state;if(n&&n.ias)return n.ias}else{e=window.location.hash.substring(0,7)==="#/page/";if(e)return r=parseInt(window.location.hash.replace("#/page/",""),10),{page:r}}return!1},this.updateState=function(t,n,r){e?this.replaceState(t,n,r):this.pushState(t,n,r)},this.pushState=function(n,r,i){var s;t?history.pushState({ias:n},r,i):(s=n.page>0?"#/page/"+n.page:"",window.location.hash=s),e=!0},this.replaceState=function(e,n,r){t?history.replaceState({ias:e},n,r):this.pushState(e,n,r)}}})(jQuery);