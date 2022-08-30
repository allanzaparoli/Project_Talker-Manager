const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

// Meus código =>>>

// Requisito 1

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

app.get('/talker', async (req, res) => {
  const lista = await locutor();
  return res.status(200).json(lista);
});

// <<<= Fim dos Códigos.

app.listen(PORT, () => {
  console.log('Online');
});
