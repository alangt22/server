import { NextApiRequest, NextApiResponse } from 'next';
import cors from 'cors';
import partyController from '../../controllers/partyController';
import conn from '../../db/conn';

const corsMiddleware = cors({
  origin: 'https://server-gules-one.vercel.app/api', // Adicione esta linha
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
});

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
      return partyController.create(req, res);
    case 'GET':
      if (req.query.id) {
        return partyController.get(req, res);
      } else {
        return partyController.getAll(req, res);
      }
    case 'DELETE':
      return partyController.delete(req, res);
    case 'PATCH':
      return partyController.update(req, res);
    default:
      res.setHeader('Allow', ['POST', 'GET', 'DELETE', 'PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
