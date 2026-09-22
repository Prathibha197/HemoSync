const prisma = require('../config/db');

const getRequests = async (req, res) => {
  try {
    const requesterId = req.user.id;
    const requests = await prisma.bloodRequest.findMany({
      where: { requesterId },
      orderBy: { createdAt: 'desc' },
      include: {
        responses: {
          where: { response: 'ACCEPTED' },
          include: { donor: true },
          take: 1
        }
      }
    });

    const formatted = requests.map(req => {
      let matchedDonor = null;
      let status = req.status === 'PENDING' ? 'Searching' : (req.status === 'COMPLETED' || req.status === 'FULFILLED') ? 'Fulfilled' : 'Cancelled';

      if (req.responses && req.responses.length > 0) {
        status = 'Matched';
        const donor = req.responses[0].donor;
        matchedDonor = {
          name: donor.name,
          phone: Math.random() > 0.5 ? '8438258962' : '6385309382'
        };
      }

      // If status in db is already accepted/completed/fulfilled, override
      if (req.status === 'ACCEPTED') status = 'Matched';
      if (req.status === 'COMPLETED' || req.status === 'FULFILLED') status = 'Fulfilled';

      return {
        id: req.id,
        bloodType: req.bloodType,
        units: req.units || 1,
        urgency: req.urgency.toLowerCase(),
        patient: req.patientName || 'Anonymous',
        ward: req.ward || 'General',
        status,
        postedAt: req.createdAt,
        fhirId: req.id.substring(0, 8),
        matchedDonor
      };
    });

    res.json(formatted);
  } catch (error) {
    console.error('Get Hospital Requests Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getInventory = async (req, res) => {
  try {
    const units = await prisma.bloodUnit.findMany({
      where: { status: 'AVAILABLE' }
    });

    const bloodTypesArray = ['A+', 'A−', 'B+', 'B−', 'AB+', 'AB−', 'O+', 'O−'];
    const networkInventory = bloodTypesArray.map(type => {
      const typeUnits = units.filter(u => u.bloodType === type).length;
      return {
        type,
        units: typeUnits,
        trend: Math.floor(Math.random() * 5) - 2, // mock trend for now
        critical: typeUnits < 10
      };
    });

    res.json(networkInventory);
  } catch (error) {
    console.error('Get Network Inventory Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getRequests,
  getInventory
};
