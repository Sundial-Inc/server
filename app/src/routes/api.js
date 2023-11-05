import express from 'express';
const router = express.Router();
import { getMonitors, getMonitor, getMonitorRuns, addMonitor, deleteMonitor, updateMonitor } from '../controllers/monitor.js';
import { addPing } from '../controllers/ping.js';
import { getSse } from '../controllers/sse.js';
// import error from './routes/error.js';


router.get('/monitors', getMonitors);
router.get('/monitors/:id', getMonitor);
router.get('/monitors/runs/:id', getMonitorRuns);
router.post('/monitors', addMonitor);
router.put('/monitors/:id', updateMonitor);
router.delete('/monitors/:id', deleteMonitor);

router.get('/sse', getSse);
// router.get('/error', error);

router.post('/pings/:endpoint_key', addPing);

export default router;
