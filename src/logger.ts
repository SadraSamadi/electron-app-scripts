import winston from 'winston';
import _ from 'lodash';

export default winston.createLogger({
  format: winston.format.combine(
    winston.format.splat(),
    winston.format.metadata(),
    winston.format.timestamp({format: 'HH:mm:ss'}),
    winston.format(info => {
      info.level = info.level.toUpperCase();
      info.level = _.padEnd(info.level, 7, ' ');
      return info;
    })(),
    winston.format.colorize({all: true}),
    winston.format.printf(info => {
      let template = _.template('[${timestamp}] ${level} : ${message}');
      return template(info);
    })
  ),
  transports: [
    new winston.transports.Console()
  ]
});
