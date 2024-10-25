
import cors from 'cors';
import serviceController from '../../controllers/serviceController'; // ajuste o caminho
import conn from '../../db/conn'; // ajuste o caminho conforme necessário

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
};
