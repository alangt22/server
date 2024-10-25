import cors from 'cors';
import serviceController from '../../controllers/partyController'; // ajuste o caminho
import conn from '../../db/conn'; // ajuste o caminho conforme necessário

// Configuração do middleware CORS
const corsMiddleware = cors({
  origin: 'http://localhost:5173', // Permitir apenas seu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
});

// Função para executar o middleware
const runMiddleware = (req, res, fn) =>
  new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });

export default async (req, res) => {
  try {
    await conn(); // Conectar ao banco de dados

    // Executar o middleware CORS
    await runMiddleware(req, res, corsMiddleware);

    // Tratar as diferentes requisições
    switch (req.method) {
      case 'POST':
        return serviceController.create(req, res);
      case 'GET':
        if (req.query.id) {
          return serviceController.get(req, res);
        } else {
          return serviceController.getAll(req, res);
        }
      case 'DELETE':
        return serviceController.delete(req, res);
      case 'PUT':
        return serviceController.update(req, res);
      default:
        res.setHeader('Allow', ['POST', 'GET', 'DELETE', 'PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error(error); // Logar o erro
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
