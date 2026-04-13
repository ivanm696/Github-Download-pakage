'use strict';

const ALLOWED_COMMANDS = ['build', 'test', 'deploy'];

/**
 * Проверяет корректность команды и опций
 * @param {string} command
 * @param {object} options
 */
function validate(command, options) {
  if (!command || typeof command !== 'string') {
    throw new TypeError('Команда должна быть непустой строкой');
  }
  if (!ALLOWED_COMMANDS.includes(command)) {
    throw new RangeError(
      `Недопустимая команда "${command}". Разрешены: ${ALLOWED_COMMANDS.join(', ')}`
    );
  }
  if (options !== null && typeof options !== 'object') {
    throw new TypeError('Параметры (options) должны быть объектом');
  }
}

module.exports = { validate, ALLOWED_COMMANDS };
