const express = require('express');
const bodyParser = require('body-parser');
const locutores = require('./locutores');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

// Meus código =>>>

// Requisito 1 >>

app.get('/talker', async (req, res) => {
  const lista = await locutores.locutor();
  res.status(200).json(lista);
});

// requisito 2 >>

app.get('/talker/:id', async (req, res) => {
  const lista = await locutores.locutor();
  const locutoresIds = lista.find(({ id }) => id === Number(req.params.id));
  if (locutoresIds) {
    return res.status(200).json(locutoresIds);
  }
    res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
});

// <<<= Fim dos Códigos.

app.listen(PORT, () => {
  console.log('Online');
});
