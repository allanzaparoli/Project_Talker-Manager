const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const locutores = require('./locutores');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

// Meus códigos =>>>

// Requisito 1 >>

app.get('/talker', async (req, res) => {
  const lista = await locutores.locutor();
  res.status(200).json(lista);
});

// Requisito 2 >>

app.get('/talker/:id', async (req, res) => {
  const lista = await locutores.locutor();
  const locutoresIds = lista.find(({ id }) => id === Number(req.params.id));
  if (locutoresIds) {
    return res.status(200).json(locutoresIds);
  }
    res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
});

// Requisitos 3 e 4 >>

const validate = (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email) {
    res.status(400).json({ message: 'O campo "email" é obrigatório' });
  }

  if (!Object.values(email).includes('@')) {
    res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
  }

  if (!password) {
    res.status(400).json({ message: 'O campo "password" é obrigatório' });
  }

  if (Object.values(password).length < 6) {
    res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }
  next();
};
app.post('/login', validate, (req, res) => {
    res.status(200).json({ token: crypto.randomBytes(8).toString('hex') });
});

// Requisito 5 >>

// app.post('/talker', (req, res) => {});

// <<<= Fim dos Códigos.

app.listen(PORT, () => {
  console.log('Online');
});
