
import express from 'express';
import { toAhMillis } from '../shared/ah-time.js';

const router = express.Router();

router.get('/elapsed', (req, res) => {
  const start = Number(req.query.start);
  res.json({ elapsedAh: toAhMillis(Date.now() - start) });
});

export default router;
