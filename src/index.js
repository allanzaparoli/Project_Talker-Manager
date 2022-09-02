const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const locutor = require('./locutores');
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
  const lista = await locutor();
  res.status(200).json(lista);
});

// Requisito 2 >>

app.get('/talker/:id', async (req, res) => {
  const lista = await locutor();
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
    const lerArquivo = await locutor();
    const ultimaPosicao = lerArquivo.length - 1;
    const addLocutor = [...lerArquivo, {
      id: lerArquivo[ultimaPosicao].id + 1,
      name,
      age,
      talk,
    }];
    const data = JSON.stringify(addLocutor);
    await fs.writeFile('src/talker.json', data);
    res.status(201).json({ id: lerArquivo[ultimaPosicao].id + 1, name, age, talk });
  });

  // Requisito 6 >>

  app.put('/talker/:id',
  validarAuthorization,
  validarTalk,
  validarRate,
  validarWatchedAt, 
  validarIdade,
  validarNome,
  async (req, res) => {
      const { id } = req.params;
      const { name, age, talk } = req.body;
      const lerArquivo = await locutor();
      const reduce = lerArquivo.reduce((acc, curr) => {
        if (curr.id === +id) {
          acc.push({ id: +id, name, age, talk });
          return acc;
        }
        acc.push(curr);
        return acc;
      }, []);
      const data = JSON.stringify(reduce);
      await fs.writeFile('src/talker.json', data);
      res.status(200).json({ id: +id, name, age, talk });
    });

// <<<= Fim dos Códigos.

app.listen(PORT, () => {
  console.log('Online');
});