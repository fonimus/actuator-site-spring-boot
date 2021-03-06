const logLevels = ['debug', 'info', 'warn', 'error', 'fatal'];

const defaultOptions = {
    logLevel: 'debug',
    separator: '-',
    stringifyArguments: false,
    showConsoleColors: true
};

function init(options, logLevels) {
    const logger = {};
    logLevels.forEach(logLevel => {
        if (logLevels.indexOf(logLevel) >= logLevels.indexOf(options.logLevel)) {
            logger[logLevel] = (...args) => {
                let stackTrace = Error().stack.split('\n')[2];
                let methodName = stackTrace;
                if (/ /.test(methodName)) {
                    methodName = methodName.trim().split(' ')[1]
                }
                if (methodName.includes('.')) {
                    methodName = methodName.split('.')[1]
                }
                let last = stackTrace.substring(stackTrace.lastIndexOf('/') + 1);
                let className = last.substring(0, last.indexOf(':'));
                let line = last.substring(className.length + 1, last.lastIndexOf(':'));
                const classAndMethod = `(${className}.${methodName}:${line}) `;
                const logLevelPrefix = `[${logLevel}] ${options.separator} `;
                const formattedArguments = options.stringifyArguments ? args.map(a => JSON.stringify(a)) : args;
                print(logLevel, logLevelPrefix, classAndMethod, formattedArguments, options.showConsoleColors)
            }
        } else {
            logger[logLevel] = () => {
            }
        }
    });
    return logger
}

function print(logLevel = false, logLevelPrefix = false, classAndMethod = false, formattedArguments = false, showConsoleColors = false) {
    if (showConsoleColors && ('warn' === logLevel || 'error' === logLevel || 'fatal' === logLevel)) {
        console['fatal' === logLevel ? 'error' : logLevel](classAndMethod + logLevelPrefix, ...formattedArguments)
    } else {
        console.log(classAndMethod + logLevelPrefix, ...formattedArguments)
    }
}

export default init(defaultOptions, logLevels)
