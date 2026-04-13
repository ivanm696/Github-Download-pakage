'use strict';

const { buildProcess } = require('./api/build');
const { testProcess } = require('./api/test');
const { deployProcess } = require('./api/deploy');
const { logger } = require('./utils/logger');
const { validate } = require('./utils/validate');

/**
 * Robot Package — автоматический движок процессов
 */
const robot = {
  version: '1.2.0',

  /**
   * Запускает пакет и выводит приветствие
   */
  start() {
    logger.info('🤖 Robot Package запущен!');
    logger.info(`Версия: ${this.version}`);
    return { status: 'running', version: this.version };
  },

  /**
   * Обрабатывает команду: 'build' | 'test' | 'deploy'
   * @param {string} command
   * @param {object} options
   * @returns {Promise<object>}
   */
  async process(command, options = {}) {
    validate(command, options);
    logger.info(`▶️  Запуск команды: ${command}`, options);

    switch (command) {
      case 'build':
        return buildProcess(options);
      case 'test':
        return testProcess(options);
      case 'deploy':
        return deployProcess(options);
      default:
        throw new Error(`Неизвестная команда: "${command}". Допустимые: build, test, deploy`);
    }
  },

  /**
   * Возвращает статус пакета
   */
  status() {
    return {
      ok: true,
      version: this.version,
      timestamp: new Date().toISOString(),
      commands: ['build', 'test', 'deploy'],
    };
  },
};

module.exports = robot;
