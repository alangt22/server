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
  await conn();
  await runMiddleware(req, res, corsMiddleware);

  switch (req.method) {
    case 'GET':
      return partyController.get(req, res);
    // Outros métodos (POST, DELETE, PUT) se necessário
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
