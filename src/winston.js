import winston from "winston";
import config from "./config.js";

const CostumLevels = {
    levels: {
        fatal:0,
        error:0,
        warning:1,
        info:2,
        http:3,
        debug:4
    },
    colors: {
        fatal:red,
        error:red,
        warning:yellow,
        info:blue,
        http:green,
        debug:green
    }
}

let logger = " "

if(config.NODE_ENV === "production") {
    logger = winston.createLogger({
        levels: CostumLevels.levels,
        transports: [
            new winston.transports.Console({
                level: "info",
                format: winston.format.combine(
                    winston.format.colorize({colors: CostumLevels.colors}),
                    winston.format.simple()
                )
            }),
            new winston.transports.File({
                level: "error",
                filename: "errors.log"
            })
        ]
    })
}

logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            level: "debug",
            format: winston.format.combine(
                winston.format.colorize({colors: CostumLevels.colors}),
                winston.format.simple
            )
        }),

        new winston.transports.File({
            level: "error",
            filename: "errors.log"
        })
    ]
})

export default logger