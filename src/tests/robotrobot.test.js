'use strict';

const assert = require('assert');
const robot = require('../index');
const { validate } = require('../utils/validate');
const { logger } = require('../utils/logger');

let passed = 0;
let failed = 0;

async function run(name, fn) {
  try {
    await fn();
    console.log(`  ✔ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✘ ${name}`);
    console.error(`    ${err.message}`);
    failed++;
  }
}

(async () => {
  console.log('\n🧪 Robot Package — тесты\n');

  // --- robot.start() ---
  await run('robot.start() возвращает статус running', () => {
    const res = robot.start();
    assert.strictEqual(res.status, 'running');
    assert.ok(res.version);
  });

  // --- robot.status() ---
  await run('robot.status() возвращает ok:true и массив команд', () => {
    const s = robot.status();
    assert.strictEqual(s.ok, true);
    assert.deepStrictEqual(s.commands, ['build', 'test', 'deploy']);
  });

  // --- robot.process('build') ---
  await run('robot.process("build") завершается успешно', async () => {
    const res = await robot.process('build', { target: 'development' });
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.target, 'development');
  });

  // --- robot.process('test') ---
  await run('robot.process("test") — все тесты проходят', async () => {
    const res = await robot.process('test', { suite: 'unit' });
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.failed, 0);
  });

  // --- robot.process('deploy') ---
  await run('robot.process("deploy") возвращает url', async () => {
    const res = await robot.process('deploy', { env: 'staging' });
    assert.strictEqual(res.success, true);
    assert.ok(res.url.startsWith('https://'));
  });

  // --- validate() ---
  await run('validate() выбрасывает TypeError на пустую команду', () => {
    assert.throws(() => validate('', {}), TypeError);
  });

  await run('validate() выбрасывает RangeError на неизвестную команду', () => {
    assert.throws(() => validate('fly', {}), RangeError);
  });

  await run('validate() не выбрасывает для допустимых команд', () => {
    assert.doesNotThrow(() => validate('build', {}));
    assert.doesNotThrow(() => validate('test', {}));
    assert.doesNotThrow(() => validate('deploy', {}));
  });

  // --- logger ---
  await run('logger.info не выбрасывает исключений', () => {
    assert.doesNotThrow(() => logger.info('Тест логгера', { ok: true }));
  });

  // --- robot.process() неизвестная команда ---
  await run('robot.process() отклоняет неизвестную команду', async () => {
    await assert.rejects(() => robot.process('unknown'), Error);
  });

  console.log(`\n📊 Результат: ${passed} пройдено, ${failed} провалено из ${passed + failed}\n`);

  if (failed > 0) process.exit(1);
})();
