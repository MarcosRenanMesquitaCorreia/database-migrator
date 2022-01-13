import * as winston from "winston";

const logConfiguration = {
    transports: [
        new winston.transports.Console({
            level: "error"
        }),
        new winston.transports.File({
            level: "debug",
            filename: "./log/main.log",
			options: { flags: 'w' }
        })
    ],
	format: winston.format.combine(
		winston.format.timestamp({
           format: "YYYY-MMM-DD HH:mm:ss"
		}),
		winston.format.prettyPrint(),
		winston.format.printf(info => `[${info.timestamp}] [${info.level}]: ${info.message}`)
    )
};

export const logger = winston.createLogger(logConfiguration);