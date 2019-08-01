export const initMini = () => {
  const ua = navigator.userAgent;
  const isWx = /MicroMessenger/gi.test(ua);
  const isAlipay = /AlipayClient/gi.test(ua);
  const isSwan = /swan/gi.test(ua);
  if (isAlipay) {
    document.writeln('<script src="https://appx/web-view.min.js"' + '>' + '<' + '/' + 'script>');
  }
  if (isSwan) {
    document.writeln(
      '<script src="https://b.bdstatic.com/searchbox/icms/searchbox/js/swan-2.0.6.js"' +
        '>' +
        '<' +
        '/' +
        'script>',
    );
  }
  if (isWx) {
    document.writeln(
      '<script src="https://res.wx.qq.com/open/js/jweixin-1.3.2.js"' + '>' + '<' + '/' + 'script>',
    );
  }
};

interface MiniEnv {
  isAlipay?: boolean;
  isWeapp?: boolean;
  isSwan?: boolean;
  isMiniProgram?: boolean;
}

export const getMiniProgramEnv = (): Promise<MiniEnv> => {
  return new Promise(resolve => {
    if (window.my && window.my.getEnv) {
      window.my.getEnv((res: any) => {
        resolve({
          isAlipay: res.miniprogram,
          isMiniProgram: res.miniprogram,
        });
      });
    } else if (window.wx && window.wx.miniProgram) {
      window.wx.miniProgram.getEnv((res: any) => {
        resolve({
          isWeapp: res.miniprogram,
          isMiniProgram: res.miniprogram,
        });
      });
    } else if (window.swan && window.swan.webView.getEnv) {
      window.swan.webView.getEnv((res: any) => {
        resolve({
          isSwan: res.smartprogram,
          isMiniProgram: res.smartprogram,
        });
      });
    } else {
      resolve({
        isMiniProgram: false,
      });
    }
  });
};