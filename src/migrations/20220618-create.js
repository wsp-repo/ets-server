module.exports.up = async (knex) => {
  console.info('UP : ', knex);
}

module.exports.down = async (knex) => {
  console.info('DOWN : ', knex);
}
