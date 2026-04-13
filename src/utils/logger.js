'use strict';

function _fmt(level, msg, meta) {
  const ts = new Date().toISOString();
  const base = `[${ts}] [${level}] ${msg}`;
  return meta ? `${base} ${JSON.stringify(meta)}` : base;
}

const logger = {
  info(msg, meta) {
    console.log(_fmt('INFO ', msg, meta));
  },
  warn(msg, meta) {
    console.warn(_fmt('WARN ', msg, meta));
  },
  error(msg, meta) {
    console.error(_fmt('ERROR', msg, meta));
  },
};

module.exports = { logger };
