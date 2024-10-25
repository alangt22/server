import partyController from '../../../controllers/partyController';
import conn from '../../../db/conn';
import cors from 'cors';

const corsMiddleware = cors();

const runMiddleware = (req, res, fn) => 
  new Promise((resolve, reject) => {
    fn(req, res, result => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });

export default async (req, res) => {
  // Conectar ao banco de dados
  await conn();

  // Habilitar CORS
  await runMiddleware(req, res, corsMiddleware);

  // Roteamento baseado no método da requisição
  switch (req.method) {
    case 'GET':
      return partyController.get(req, res);
    case 'POST':
      return partyController.create(req, res);
    case 'DELETE':
      return partyController.delete(req, res);
    case 'PUT':
      return partyController.update(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE', 'PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
