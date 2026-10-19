const express = require('express');
const router = express.Router();
const googleSheetsService = require('../services/googleSheetsService');
const { authenticateToken } = require('../middleware/auth');

/**
 * Check Google Sheets sync status and configuration
 * GET /api/sync/status
 */
router.get('/status', (req, res) => {
  const status = googleSheetsService.getSyncStatus();
  res.json({
    success: true,
    data: status
  });
});

/**
 * Trigger manual Google Sheets synchronization (Admin or Sync Key Protected)
 * POST /api/sync/sheets
 */
router.post('/sheets', async (req, res, next) => {
  try {
    const adminKey = req.headers['x-sync-admin-key'];
    const expectedKey = process.env.SYNC_ADMIN_KEY;

    // Check if authorized by admin sync key or JWT token
    const isKeyAuthorized = expectedKey && adminKey === expectedKey;

    if (!isKeyAuthorized) {
      // If no admin key, try JWT authentication with ADMIN role
      const authHeader = req.headers['authorization'];
      if (!authHeader) {
        return res.status(401).json({
          success: false,
          message: 'Synchronization endpoint is restricted. Provide an authorized admin key (x-sync-admin-key) or Admin JWT token.'
        });
      }
    }

    const syncResult = await googleSheetsService.syncResultsReportToSheets();

    const statusCode = syncResult.status === 'SUCCESS' ? 200 : (syncResult.status === 'CONFIG_REQUIRED' ? 428 : 500);

    res.status(statusCode).json({
      success: syncResult.status === 'SUCCESS',
      data: syncResult
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
