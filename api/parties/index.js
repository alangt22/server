import { NextApiRequest, NextApiResponse } from 'next';
import cors from 'cors';
import partyController from '../../controllers/partyController'; // ajuste o caminho
import conn from '../../db/conn'; // ajuste o caminho conforme necessário

// Habilitar CORS
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

  await runMiddleware(req, res, corsMiddleware);

  switch (req.method) {
    case 'POST':
      return partyController.create(req, res);
    case 'GET':
      if (req.query.id) {
        return partyController.get(req, res);
      } else {
        return partyController.getAll(req, res);
      }
    case 'DELETE':
      return partyController.delete(req, res);
    case 'PUT':
      return partyController.update(req, res);
    default:
      res.setHeader('Allow', ['POST', 'GET', 'DELETE', 'PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
