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
      city: 'Unknown', // Not saved in DB currently
      gender: 'male',
      dob: '1990-01-01',
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
    const history = await prisma.donationRecord.findMany({
      where: { donorId },
      orderBy: { date: 'desc' },
      include: { bloodBank: true, campaign: true }
    });

    const formatted = history.map(h => ({
      id: h.id,
      date: h.date,
      hospital: h.bloodBank ? h.bloodBank.name : (h.campaign ? h.campaign.name : 'Unknown'),
      bloodType: 'O+', // Just a fallback, would normally be joined from donor or stored in record
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
      hospitalPhone: req.requester.mobile,
      address: 'Unknown location', 
      distance: 'Nearby', 
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

module.exports = {
  getProfile,
  getAlerts,
  respondToRequest,
  getHistory
};
