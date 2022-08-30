const fs = require('fs').promises;

async function locutor() {
  const listaVazia = [];
  try {
    const data = await fs.readFile('src/talker.json', 'utf-8');
    const filtroParse = JSON.parse(data);
    return filtroParse;
  } catch (err) {
    return listaVazia;
  }
}

module.exports = {
  locutor,
};