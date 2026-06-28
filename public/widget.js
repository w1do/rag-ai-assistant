/**
 * Встраиваемый чат-виджет ассистента.
 *
 * Скрипт подключается на сторонний сайт одной строкой:
 *
 *   <script src="https://ВАШ-ДОМЕН/widget.js"
 *           data-assistant-id="123"
 *           data-position="bottom-right"
 *           async></script>
 *
 * На странице появляется плавающая кнопка, по клику на которую открывается
 * окно с публичным чатом ассистента (страница /share-chat/{id}, загружаемая
 * в iframe). Базовый URL вычисляется из адреса самого скрипта, поэтому виджет
 * корректно работает при кросс-доменном встраивании.
 */
(function () {
    'use strict';

    var currentScript =
        document.currentScript ||
        (function () {
            var scripts = document.getElementsByTagName('script');
            return scripts[scripts.length - 1];
        })();

    if (!currentScript) {
        return;
    }

    var assistantId = currentScript.getAttribute('data-assistant-id');
    if (!assistantId) {
        console.error('[chat-widget] Не указан data-assistant-id.');
        return;
    }

    var position = currentScript.getAttribute('data-position') || 'bottom-right';
    var baseUrl = new URL(currentScript.src).origin;
    var chatUrl = baseUrl + '/share-chat/' + encodeURIComponent(assistantId);

    var isRight = position.indexOf('left') === -1;
    var sideStyles = isRight ? 'right: 20px;' : 'left: 20px;';

    // Защита от повторной инициализации, если скрипт подключён дважды.
    if (document.getElementById('ai-chat-widget-' + assistantId)) {
        return;
    }

    var container = document.createElement('div');
    container.id = 'ai-chat-widget-' + assistantId;
    container.style.cssText =
        'position: fixed; bottom: 20px; ' + sideStyles + ' z-index: 2147483000;';

    var style = document.createElement('style');
    style.innerHTML =
        '@media (max-width: 768px) {' +
        '  #' + container.id + '.ai-chat-widget-open {' +
        '    width: 100% !important;' +
        '    height: 100% !important;' +
        '    bottom: 0 !important;' +
        '    left: 0 !important;' +
        '    right: 0 !important;' +
        '  }' +
        '  #' + container.id + '.ai-chat-widget-open .ai-chat-frame-wrapper {' +
        '    width: 100% !important;' +
        '    height: 100% !important;' +
        '    max-width: 100% !important;' +
        '    max-height: 100% !important;' +
        '    bottom: 0 !important;' +
        '    left: 0 !important;' +
        '    right: 0 !important;' +
        '    border-radius: 0 !important;' +
        '  }' +
        '  #' + container.id + '.ai-chat-widget-open .ai-chat-button {' +
        '    bottom: auto !important;' +
        '    top: 12px !important;' +
        '    ' + sideStyles +
        '    width: 44px !important;' +
        '    height: 44px !important;' +
        '    z-index: 2147483001 !important;' +
        '    background: rgba(0, 0, 0, 0.2) !important;' +
        '    backdrop-filter: blur(4px) !important;' +
        '    border: 1px solid rgba(255, 255, 255, 0.1) !important;' +
        '  }' +
        '}';
    document.head.appendChild(style);

    // Плавающая кнопка открытия/закрытия чата.
    var button = document.createElement('button');
    button.className = 'ai-chat-button';
    button.type = 'button';
    button.setAttribute('aria-label', 'Открыть чат');
    button.style.cssText =
        'width: 60px; height: 60px; border-radius: 9999px; border: none; cursor: pointer;' +
        'background: #4f46e5; color: #fff; box-shadow: 0 4px 14px rgba(0,0,0,0.25);' +
        'display: flex; align-items: center; justify-content: center; transition: transform 0.15s ease;';
    button.onmouseenter = function () {
        button.style.transform = 'scale(1.05)';
    };
    button.onmouseleave = function () {
        button.style.transform = 'scale(1)';
    };

    var iconChat =
        '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
        'stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>';
    var iconClose =
        '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
        'stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
    button.innerHTML = iconChat;

    // Окно чата с iframe на публичную страницу ассистента.
    var frameWrapper = document.createElement('div');
    frameWrapper.className = 'ai-chat-frame-wrapper';
    frameWrapper.style.cssText =
        'position: absolute; bottom: 76px; ' + sideStyles.replace('20px', '0') +
        'width: 380px; max-width: calc(100vw - 40px); height: 560px;' +
        'max-height: calc(100vh - 120px); background: #fff; border-radius: 16px;' +
        'overflow: hidden; box-shadow: 0 12px 40px rgba(0,0,0,0.25);' +
        'display: none; opacity: 0; transform: translateY(10px); transition: opacity 0.2s ease, transform 0.2s ease;';

    var iframe = document.createElement('iframe');
    iframe.src = chatUrl;
    iframe.title = 'Чат с ассистентом';
    iframe.style.cssText = 'width: 100%; height: 100%; border: none;';
    frameWrapper.appendChild(iframe);

    var isOpen = false;
    var toggle = function () {
        isOpen = !isOpen;
        if (isOpen) {
            container.classList.add('ai-chat-widget-open');
            frameWrapper.style.display = 'block';
            // Запускаем анимацию появления на следующем кадре.
            requestAnimationFrame(function () {
                frameWrapper.style.opacity = '1';
                frameWrapper.style.transform = 'translateY(0)';
            });
            button.innerHTML = iconClose;
            button.setAttribute('aria-label', 'Закрыть чат');
        } else {
            container.classList.remove('ai-chat-widget-open');
            frameWrapper.style.opacity = '0';
            frameWrapper.style.transform = 'translateY(10px)';
            button.innerHTML = iconChat;
            button.setAttribute('aria-label', 'Открыть чат');
            setTimeout(function () {
                if (!isOpen) {
                    frameWrapper.style.display = 'none';
                }
            }, 200);
        }
    };

    button.addEventListener('click', toggle);

    container.appendChild(frameWrapper);
    container.appendChild(button);

    var mount = function () {
        document.body.appendChild(container);
    };

    if (document.body) {
        mount();
    } else {
        document.addEventListener('DOMContentLoaded', mount);
    }
})();
