var settings = window.actSettings || {},
  user = settings.user || {},
  widget = settings.widget || {},
  query = window.location.search.substring(1),
  zIndex = widget.zIndex || '9999999999',
  modal = widget.type && 'modal' === widget.type,
  selector = widget.selector,
  WIDGET_STYLE =
    'right: 0px;bottom: calc(50% - 70px/2);height: 70px;min-height: 70px;min-width: 65px;overflow: hidden;position: fixed;width: 70px;z-index: ' +
    zIndex +
    ';display: flex;',
  MODAL_STYLE =
    'right: 0px;bottom: calc(50% - 70px/2);height: 0;overflow: hidden;position: fixed;width: 0;z-index: ' + zIndex + ';display: flex;',
  WIDGET_URL = 'https://widget.getacute.io';
function createWidget() {
  var t = document.createElement('div');
  return (
    t.setAttribute('id', '_act_widget'),
    (t.style.cssText = modal ? MODAL_STYLE : WIDGET_STYLE),
    (t.innerHTML =
      '<iframe id="_act_widget_iframe" src="' +
      WIDGET_URL +
      '?token=' +
      settings.token +
      (modal ? '&modal=true' : '') +
      '&query=' +
      query +
      '" style="width: 100%!important;height: 100%!important;border: 0;z-index: 9999;"></iframe>'),
    t
  );
}
function openModal() {
  var t = document.getElementById('_act_widget_iframe');
  if (t)
    return t.contentWindow.postMessage(
      {
        action: 'open_act_modal',
        data: !0,
      },
      '*',
    );
}
function openWidget() {
  var t = document.getElementById('_act_widget_iframe');
  if (t)
    return t.contentWindow.postMessage(
      {
        action: 'open_act_widget',
        data: !0,
      },
      '*',
    );
}
function identify(t) {
  if (t) {
    window.actSettings.user = t.user;
    var e = {
        action: 'set_act_storage',
        data: window.actSettings,
      },
      i = document.getElementById('_act_widget_iframe');
    i && i.contentWindow.postMessage(e, '*');
  } else console.warn('Invalid params supplied to identify method');
}
function Acute(t) {
  var e = t,
    i = arguments[1];
  if (e) {
    var n = window[e];
    'function' == typeof n ? n(i) : console.warn('Invalid method supplied to Acute API');
  } else console.warn('Invalid method supplied to Acute API');
}
var myWidgetInstance = createWidget(),
  WidgetContainerId = '_act_widget_container',
  widgetContainer = document.createElement('div');
function bindEvent(t, e, i) {
  t.addEventListener ? t.addEventListener(e, i, !1) : t.attachEvent && t.attachEvent('on' + e, i);
}
function initAcute() {
  try {
    if (!document.getElementById(WidgetContainerId)) {
      document.body.append(widgetContainer),
        document.getElementById(WidgetContainerId).appendChild(myWidgetInstance),
        modal &&
          (document.querySelector(selector)
            ? (document.querySelector(selector).onclick = openModal)
            : console.warn('Selector element not found'));
    }
  } catch (err) {
    console.log('acute feedback loading err', err);
  }
}
widgetContainer.setAttribute('id', WidgetContainerId),
  bindEvent(window, 'message', function (t) {
    if (t.origin === WIDGET_URL) {
      var e,
        i = document.getElementById('_act_widget');
      if ('resize_frame' === (e = t.data).action) {
        var n = 710 < window.innerHeight ? '720px' : '98%',
          d = 414 < window.innerWidth ? '410px' : 'calc(98% - 20px)',
          o = 710 < window.innerHeight ? 'calc(50% - 720px/2)' : '1%';
        if (e.data)
          if (!1 === e.data.open) {
            var a = e.data.sizes;
            (i.style.height = a.height),
              (i.style.width = a.width),
              (i.style['min-height'] = a.height),
              (i.style['min-width'] = a.width),
              (i.style.bottom = 'calc(50% - ' + a.height + '/2)');
          } else (i.style.height = n), (i.style.width = d), (i.style.bottom = o);
        else (i.style.height = '70px'), (i.style.width = '70px'), (i.style.bottom = 'calc(50% - 70px/2)');
      } else if ('act_widget_loaded' === e.action) {
        if (e.data) {
          e.data.type;
          var s = e.data.sizes;
          s &&
            ((i.style.height = s.height),
            (i.style.width = s.width),
            (i.style['min-height'] = s.height),
            (i.style['min-width'] = s.width),
            (i.style.bottom = 'calc(50% - ' + s.height + '/2)'));
        }
        var c = {
            action: 'set_act_storage',
            data: window.actSettings || {},
          },
          r = document.getElementById('_act_widget_iframe');
        r && r.contentWindow.postMessage(c, '*');
      } else
        'resize_modal' === e.action &&
          (e.data
            ? ((i.style.height = '100%'),
              (i.style.width = '100%'),
              (i.style.bottom = 'auto'),
              (i.style.background = '#00000033'),
              (i.style.top = '0'))
            : ((i.style.height = '0'),
              (i.style.width = '0'),
              (i.style.bottom = '0'),
              (i.style.background = 'transparent'),
              (i.style.top = 'unset')));
    }
  });
initAcute();
