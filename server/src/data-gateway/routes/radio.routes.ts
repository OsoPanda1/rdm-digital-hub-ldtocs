import { Router } from 'express';
import { prisma } from '@prisma/client';
import { logAudit } from '../middleware/audit.js';

const radioRouter = Router();

// Start live stream (admin only)
radioRouter.post('/stream/start', logAudit(), async (req, res) => {
  try {
    const userId = req.body.userId || req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Generate unique stream URL
    const streamId = `stream_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const streamUrl = `${process.env.API_URL || 'http://localhost:3000'}/api/radio/stream/${streamId}`;

    // Log stream start
    await logStreamEvent('START', userId, streamId);

    res.json({
      success: true,
      streamUrl,
      streamId,
      message: 'Stream iniciado',
    });
  } catch (error) {
    console.error('[v0] Stream start error:', error);
    res.status(500).json({ error: 'Error iniciando stream' });
  }
});

// Stop live stream
radioRouter.post('/stream/stop', async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await logStreamEvent('STOP', userId, '');

    res.json({
      success: true,
      message: 'Stream detenido',
    });
  } catch (error) {
    console.error('[v0] Stream stop error:', error);
    res.status(500).json({ error: 'Error deteniendo stream' });
  }
});

// Get active streams
radioRouter.get('/streams/active', async (req, res) => {
  try {
    // In a real implementation, this would query active streams from a cache (Redis)
    // For now, return mock data
    res.json({
      activeStreams: [],
      listeners: 0,
    });
  } catch (error) {
    console.error('[v0] Get active streams error:', error);
    res.status(500).json({ error: 'Error obteniendo streams' });
  }
});

// Get stream listeners count
radioRouter.get('/stream/:streamId/listeners', async (req, res) => {
  try {
    const { streamId } = req.params;
    
    // In a real implementation, get from Redis or database
    res.json({
      streamId,
      listeners: Math.floor(Math.random() * 100),
      isActive: true,
    });
  } catch (error) {
    console.error('[v0] Get listeners error:', error);
    res.status(500).json({ error: 'Error obteniendo listeners' });
  }
});

async function logStreamEvent(event: string, userId: string, streamId: string) {
  try {
    // Log to database for auditing
    console.log(`[RADIO] ${event} - User: ${userId} - Stream: ${streamId}`);
  } catch (error) {
    console.error('[v0] Error logging stream event:', error);
  }
}

export default radioRouter;
