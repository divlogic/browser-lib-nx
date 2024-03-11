import { Logger, ILogObj } from 'tslog';
export const log: Logger<ILogObj> = new Logger({
  hideLogPositionForProduction: true,
  stylePrettyLogs: !navigator.userAgent.includes('Firefox'),
});
