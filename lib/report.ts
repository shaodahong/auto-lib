const Report = {
  /**
   * 报告一条消息
   * msg: 消息内容
   */
  info(msg: string) {
    if (window && (window as any).Raven) {
      (window as any).Raven.captureMessage(msg, { level: 'info' });
    }
  },

  /**
   * 报告一条warning
   * msg: 消息内容
   */
  warning(msg: string) {
    if (window && (window as any).Raven) {
      (window as any).Raven.captureMessage(msg, { level: 'warning' });
    }
  },

  /**
   * 报告一条error
   * msg: 消息内容
   */
  error(msg: string | Error) {
    if (window && (window as any).Raven) {
      if (msg instanceof Error) {
        (window as any).Raven.captureException(msg);
        return;
      }

      (window as any).Raven.captureMessage(msg, { level: 'error' });
    }
  },
};

export default Report;
