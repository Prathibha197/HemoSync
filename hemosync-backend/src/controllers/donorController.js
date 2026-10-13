const prisma = require('../config/db');

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let cooldownDays = 0;
    if (user.lastDonation) {
      const daysSince = Math.floor((Date.now() - new Date(user.lastDonation).getTime()) / (1000 * 60 * 60 * 24));
      cooldownDays = Math.max(0, 90 - daysSince);
    }

    const profile = {
      id: user.id,
      name: user.name,
      city: 'Chennai, TN',
      dob: '1996-05-15',
      bloodType: user.bloodType || 'O+',
      cooldownDays,
      isEligible: cooldownDays === 0,
      totalDonations: await prisma.donationRecord.count({ where: { donorId: userId, status: 'COMPLETED' } }),
      livesImpacted: user.livesImpacted,
      points: user.points,
      level: user.level,
      badges: user.badges,
      streaks: user.streaks,
      emergencyWilling: user.emergencyWilling
    };

    res.json(profile);
  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const respondToRequest = async (req, res) => {
  try {
    const donorId = req.user.id;
    const { id } = req.params; // Request ID
    const { response, eta } = req.body; // ACCEPTED, REJECTED, UNAVAILABLE

    let mappedResponse = 'UNAVAILABLE';
    if (response === 'accept' || response === 'ACCEPTED') mappedResponse = 'ACCEPTED';
    if (response === 'reject' || response === 'REJECTED') mappedResponse = 'REJECTED';

    const requestResponse = await prisma.requestResponse.upsert({
      where: {
        requestId_donorId: {
          requestId: id,
          donorId
        }
      },
      update: {
        response: mappedResponse,
        eta: eta || null,
        respondedAt: new Date()
      },
      create: {
        requestId: id,
        donorId,
        response: mappedResponse,
        eta: eta || null
      }
    });

    res.json({ message: 'Response recorded', requestResponse });
  } catch (error) {
    console.error('Respond to Request Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getHistory = async (req, res) => {
  try {
    const donorId = req.user.id;
    
    // Get user to know their blood type
    const user = await prisma.user.findUnique({ where: { id: donorId } });
    
    const history = await prisma.donationRecord.findMany({
      where: { donorId },
      orderBy: { date: 'desc' },
      include: { bloodBank: true, campaign: true }
    });

    const formatted = history.map(h => ({
      id: h.id,
      date: h.date,
      hospital: h.bloodBank ? h.bloodBank.name : (h.campaign ? h.campaign.name : 'Unknown'),
      bloodType: user.bloodType || 'O+', 
      units: h.volume / 350,
      status: h.status === 'COMPLETED' ? 'Completed' : 'Cancelled',
      notes: h.status === 'COMPLETED' ? 'Post-donation checkup completed' : 'Adverse reaction or incomplete'
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Get History Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAlerts = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // For now, return all PENDING requests for their blood type, or all if we want to show it for demo
    const requests = await prisma.bloodRequest.findMany({
      where: {
        status: 'PENDING',
        bloodType: user.bloodType || 'O+' 
      },
      orderBy: { createdAt: 'desc' },
      include: { requester: true }
    });

    const formatted = requests.map(req => ({
      id: req.id,
      bloodType: req.bloodType,
      urgency: req.urgency.toLowerCase(),
      hospital: req.requester.name,
      hospitalPhone: Math.random() > 0.5 ? '9025879003' : '8778571234',
      address: req.requester.name.toLowerCase().includes('srm') ? 'Ramapuram, Chennai' : 'Anna Nagar, Chennai', 
      distance: '2.5 km', 
      units: req.units,
      postedAt: req.createdAt,
      notes: req.patientName ? `For patient: ${req.patientName} (${req.ward})` : null
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Get Donor Alerts Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getNearbyBanks = async (req, res) => {
  try {
    const banks = await prisma.user.findMany({
      where: { role: 'BLOOD_BANK' },
      take: 4,
      include: {
        bloodUnits: {
          where: { status: 'AVAILABLE' }
        }
      }
    });

    const formatted = banks.map(bank => {
      // Aggregate inventory by type for this bank
      const inventory = {};
      const availableTypes = [];
      
      bank.bloodUnits.forEach(unit => {
        inventory[unit.bloodType] = (inventory[unit.bloodType] || 0) + 1;
      });

      for (const [type, count] of Object.entries(inventory)) {
        if (count > 0) availableTypes.push(type);
      }

    // Authentic Chennai landmarks and localities
    const chennaiLocations = [
      { area: 'Ramapuram, Chennai', address: 'Mount-Poonamallee Road, Ramapuram, Chennai, Tamil Nadu' },
      { area: 'Anna Nagar, Chennai', address: '2nd Avenue, Anna Nagar, Chennai, Tamil Nadu' },
      { area: 'Kilpauk, Chennai', address: 'Poonamallee High Road, Kilpauk, Chennai, Tamil Nadu' },
      { area: 'Adyar, Chennai', address: 'Lattice Bridge Road, Adyar, Chennai, Tamil Nadu' },
    ];

    const formatted = banks.map((bank, idx) => {
      // Aggregate inventory by type for this bank
      const inventory = {};
      const availableTypes = [];
      
      bank.bloodUnits.forEach(unit => {
        inventory[unit.bloodType] = (inventory[unit.bloodType] || 0) + 1;
      });

      for (const [type, count] of Object.entries(inventory)) {
        if (count > 0) availableTypes.push(type);
      }

      // Generate realistic distance strictly within Chennai (1.8 km to 6.2 km)
      const randomDistance = (1.8 + (idx * 1.4)).toFixed(1);
      const loc = chennaiLocations[idx % chennaiLocations.length];

      return {
        id: bank.id,
        name: bank.name,
        address: loc.address,
        distance: `${randomDistance} km`,
        openNow: true,
        phone: idx % 2 === 0 ? '8825690254' : '8925877696',
        emergencySupport: true,
        availableTypes,
        inventory
      };
    });

    res.json(formatted);
  } catch (error) {
    console.error('Get Nearby Banks Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getProfile,
  getAlerts,
  respondToRequest,
  getHistory,
  getNearbyBanks
};
