// routes/auctionRoutes.js
const express = require('express');
const router = express.Router();
const Auction = require('../Models/Auction'); 
// POST /api/auctions/add
router.post('/add', async (req, res) => {
  try {
    const { title, description, link, image } = req.body;
    
    const newAuction = await Auction.create({
      title,
      description,
      link, 
      image
    });

    res.status(201).json({
      status: 'success',
      data: {
        auction: newAuction
      }
    });

  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
});
router.get('/all', async (req, res) => {
  try {
    
    const auctions = await Auction.find({}); // For MongoDB
    
    if (auctions.length === 0) {
      return res.status(404).json({
        status: 'success',
        message: 'No auctions found',
        data: []
      });
    }

    
    res.status(200).json({
      status: 'success',
      results: auctions.length,
      data: {
        auctions
      }
    });

  } catch (err) {
    // Handle errors
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch auctions',
      error: err.message
    });
  }
});

module.exports = router; 