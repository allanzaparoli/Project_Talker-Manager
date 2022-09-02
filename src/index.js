const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const locutores = require('./locutores');
const validarNome = require('./middlewares/validarNome');
const validarIdade = require('./middlewares/validarIdade');
const validarAuthorization = require('./middlewares/validarAuthorization');
const validarTalk = require('./middlewares/validarTalk');
const validarWatchedAt = require('./middlewares/validarWatchedAt');
const validarRate = require('./middlewares/validarRate');
const generateToken = require('./utils/generateToken');

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
    res.status(200).json({ token: generateToken() });
});

// Requisito 5 >>

app.post('/talker',
  validarAuthorization,
  validarTalk,
  validarRate,
  validarWatchedAt, 
  validarIdade,
  validarNome,
  async (req, res) => {
    const { name, age, talk } = req.body;
    const lerArquivo = await fs.readFile('src/talker.json', 'utf-8');
    const mudandoFs = JSON.parse(lerArquivo);
    const ultimaPosicao = mudandoFs.length - 1;
    const addLocutor = [...mudandoFs, {
      id: mudandoFs[ultimaPosicao].id + 1,
      name,
      age,
      talk,
    }];
    const data = JSON.stringify(addLocutor);
    await fs.writeFile('src/talker.json', data);
    res.status(201).json({ id: mudandoFs[ultimaPosicao].id + 1, name, age, talk });
  });

// <<<= Fim dos Códigos.

app.listen(PORT, () => {
  console.log('Online');
});