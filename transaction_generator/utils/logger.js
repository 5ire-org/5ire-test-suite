const { createLogger, format, transports, config } = require('winston');
const genLogger = createLogger({
    transports:
        new transports.File({
            filename: 'logs/transaction_generator.log',
            format: format.combine(
                format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
                format.align(),
                format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
            )
        }),
});

const listnerLogger = createLogger({
    transports:
        new transports.File({
            filename: 'logs/transaction_listner.log',
            format: format.combine(
                format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
                format.align(),
                format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
            )
        }),
});
const fetchLogger = createLogger({
    transports:
        new transports.File({
            filename: 'logs/transaction_fetch.log',
            format: format.combine(
                format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
                format.align(),
                format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
            )
        }),
});
module.exports = {
    genLogger: genLogger,
    listnerLogger: listnerLogger,
    fetchLogger: fetchLogger

};