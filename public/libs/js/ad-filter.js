(function () {
    'use strict';

    if (window.location.search.includes('no-adfilter')) {
        console.log('[广告过滤] ⚠️ 检测到 ?no-adfilter 参数，广告过滤模块已完全禁用');
        return;
    }

    var AD_FILTER_CONFIG = {
        enabled: true,
        logEnabled: true,
        adKeywords: [
            'sponsor', '/ad/', '/ads/', 'advert', 'advertisement',
            '/adjump', 'redtraffic'
        ]
    };

    var log = function () {
        if (AD_FILTER_CONFIG.logEnabled) {
            console.log('[广告过滤]', Array.prototype.slice.call(arguments).join(' '));
        }
    };

    function filterAdsFromM3U8(m3u8Content) {
        if (!m3u8Content || !AD_FILTER_CONFIG.enabled) return m3u8Content;

        var lines = m3u8Content.split('\n');
        var filteredLines = [];
        var adsRemoved = 0;
        var i = 0;

        while (i < lines.length) {
            var line = lines[i];

            if (line.indexOf('#EXT-X-DISCONTINUITY') !== -1) {
                i++;
                continue;
            }

            if (line.indexOf('#EXTINF:') !== -1) {
                if (i + 1 < lines.length) {
                    var nextLine = lines[i + 1];
                    var isAd = false;
                    for (var k = 0; k < AD_FILTER_CONFIG.adKeywords.length; k++) {
                        if (nextLine.toLowerCase().indexOf(AD_FILTER_CONFIG.adKeywords[k].toLowerCase()) !== -1) {
                            isAd = true;
                            break;
                        }
                    }
                    if (isAd) {
                        adsRemoved++;
                        i += 2;
                        continue;
                    }
                }
            }

            filteredLines.push(line);
            i++;
        }

        var noDiscoLines = [];
        for (var j = 0; j < filteredLines.length; j++) {
            if (filteredLines[j].indexOf('#EXT-X-DISCONTINUITY') === -1) {
                noDiscoLines.push(filteredLines[j]);
            }
        }

        if (adsRemoved > 0) {
            log('已过滤', adsRemoved, '个广告分段');
        }

        return noDiscoLines.join('\n');
    }

    function createCustomLoader(HlsLib) {
        var OrigLoader = HlsLib.DefaultConfig.loader;
        var CustomLoader = function (config) {
            OrigLoader.call(this, config);
            var origLoad = this.load.bind(this);
            this.load = function (context, config, callbacks) {
                if (context.type === 'manifest' || context.type === 'level') {
                    var origOnSuccess = callbacks.onSuccess;
                    callbacks.onSuccess = function (response, stats, context, networkDetails) {
                        if (response.data && typeof response.data === 'string' && response.data.indexOf('#EXTM3U') !== -1) {
                            response.data = filterAdsFromM3U8(response.data);
                        }
                        origOnSuccess(response, stats, context, networkDetails);
                    };
                }
                origLoad(context, config, callbacks);
            };
        };
        CustomLoader.prototype = Object.create(OrigLoader.prototype);
        CustomLoader.prototype.constructor = CustomLoader;
        return CustomLoader;
    }

    function bindHlsToPlayer(dp, url) {
        if (!dp || !dp.video || !url) return null;

        var video = dp.video;

        if (video._hls) {
            try { video._hls.destroy(); } catch (e) { }
            video._hls = null;
        }

        if (typeof Hls === 'undefined') {
            video.src = url;
            log('HLS.js 未加载，使用原生播放');
            return null;
        }

        if (!Hls.isSupported()) {
            video.src = url;
            log('浏览器不支持 HLS.js');
            return null;
        }

        try {
            video.removeAttribute('src');
            video.removeAttribute('srcObject');

            var CustomHlsJsLoader = createCustomLoader(Hls);

            var hlsConfig = {
                debug: false,
                enableWorker: true,
                loader: CustomHlsJsLoader,
                manifestLoadingMaxRetry: 2,
                manifestLoadingRetryDelay: 500,
                levelLoadingMaxRetry: 2,
                levelLoadingRetryDelay: 500,
                fragLoadingMaxRetry: 2,
                fragLoadingRetryDelay: 500,
                fragLoadingLoopThreshold: 3,
                maxBufferSize: 0,
                maxBufferLength: 30,
                startLevel: 0
            };

            var hls = new Hls(hlsConfig);

            var recoverAttempts = 0;
            var maxRecoverAttempts = 2;

            hls.on(Hls.Events.MANIFEST_PARSED, function () {
                log('HLS Manifest 解析完成');
                recoverAttempts = 0;
                video.play().catch(function () { });
            });

            hls.on(Hls.Events.ERROR, function (event, data) {
                if (data.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            log('网络错误，尝试恢复...', data.details);
                            if (recoverAttempts < maxRecoverAttempts) {
                                recoverAttempts++;
                                hls.startLoad();
                            } else {
                                log('网络错误，尝试切换播放器');
                                hls.destroy();
                                video.src = url;
                                video.play().catch(function () { });
                            }
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            log('媒体错误，尝试恢复...', data.details);
                            if (recoverAttempts < maxRecoverAttempts) {
                                recoverAttempts++;
                                hls.recoverMediaError();
                            } else {
                                log('媒体错误，尝试切换播放器');
                                hls.destroy();
                                video.src = url;
                                video.play().catch(function () { });
                            }
                            break;
                        default:
                            log('HLS 错误:', data.type, data.details);
                            hls.destroy();
                            video.src = url;
                            video.play().catch(function () { });
                            break;
                    }
                }
            });

            video._hls = hls;
            hls.loadSource(url);
            hls.attachMedia(video);

            log('HLS.js 已绑定');
            return hls;
        } catch (err) {
            log('HLS.js 绑定失败:', err.message);
            video.src = url;
            return null;
        }
    }

    window.AdFilter = {
        filterAdsFromM3U8: filterAdsFromM3U8,
        bindHlsToPlayer: bindHlsToPlayer,
        createCustomLoader: createCustomLoader,
        isEnabled: function () { return AD_FILTER_CONFIG.enabled; },
        enable: function () {
            AD_FILTER_CONFIG.enabled = true;
            try { localStorage.setItem('donggua_ad_filter_enabled', 'true'); } catch (e) { }
            log('广告过滤已启用');
        },
        disable: function () {
            AD_FILTER_CONFIG.enabled = false;
            try { localStorage.setItem('donggua_ad_filter_enabled', 'false'); } catch (e) { }
            log('广告过滤已禁用');
        }
    };

    log('广告过滤模块加载完成');
    log('使用: AdFilter.bindHlsToPlayer(dp, url) 激活');

})();
