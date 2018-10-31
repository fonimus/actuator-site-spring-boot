const LOG_LEVELS = ['debug', 'info', 'warn', 'error', 'fatal'];

const defaultOptions = {
    logLevel: 'debug',
    separator: '-',
    stringifyByDefault: false,
    showConsoleColors: true,
};

function init(options: any, logLevels: string[]) {
    const logger: any = {};
    logLevels.forEach((logLevel) => {
        if (logLevels.indexOf(logLevel) >= logLevels.indexOf(options.logLevel)) {
            logger[logLevel] = (...args: any[]) => {
                const error = Error();
                let classAndMethod;
                if (error && error.stack) {
                    const stackTrace = error.stack.split('\n')[2];
                    let methodName = stackTrace;
                    if (/ /.test(methodName)) {
                        methodName = methodName.trim().split(' ')[1];
                    }
                    if (methodName.includes('.')) {
                        methodName = methodName.split('.')[1];
                    }
                    const last = stackTrace.substring(stackTrace.lastIndexOf('/') + 1);
                    const className = last.substring(0, last.indexOf(':'));
                    const line = last.substring(className.length + 1, last.lastIndexOf(':'));
                    classAndMethod = `(${className}.${methodName}:${line}) `;
                } else {
                    classAndMethod = 'unknown';
                }
                const logLevelPrefix = `[${logLevel}] ${options.separator} `;
                const formattedArguments = options.stringifyByDefault ? args.map((a) => JSON.stringify(a)) : args;
                print(logLevel, logLevelPrefix, classAndMethod, formattedArguments, options.showConsoleColors);
            };
        } else {
            logger[logLevel] = () => {
                // nothing
            };
        }
    });
    return logger;
}

function print(
    logLevel: any, logLevelPrefix: any, classAndMethod: any, formattedArguments: any, showConsoleColors: any) {
    if (showConsoleColors && ('warn' === logLevel || 'error' === logLevel || 'fatal' === logLevel)) {
        // @ts-ignore
        console['fatal' === logLevel ? 'error' : logLevel](classAndMethod + logLevelPrefix, ...formattedArguments);
    } else {
        console.log(classAndMethod + logLevelPrefix, ...formattedArguments);
    }
}

export default {
    install: (Vue: any, options: any) => {
        Vue.$log = init(Object.assign(defaultOptions, options), LOG_LEVELS);
        Vue.prototype.$log = Vue.$log;
    },
};
