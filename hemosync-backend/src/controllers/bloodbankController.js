const prisma = require('../config/db');

const getInventory = async (req, res) => {
  try {
    const bloodBankId = req.user.id;

    // Fetch all units for this blood bank
    const units = await prisma.bloodUnit.findMany({
      where: { bloodBankId }
    });

    const totalUnits = units.length;
    const reservedUnits = units.filter(u => u.status === 'USED' || u.status === 'TRANSFERRED').length;

    // Aggregate by blood type
    const bloodTypesArray = ['A+', 'A−', 'B+', 'B−', 'AB+', 'AB−', 'O+', 'O−'];
    const bloodTypes = bloodTypesArray.map(type => {
      const typeUnits = units.filter(u => u.bloodType === type);
      const total = typeUnits.length;
      const reserved = typeUnits.filter(u => u.status === 'USED' || u.status === 'TRANSFERRED').length;
      const critical = total < 5; // basic expiry/critical logic

      return {
        type,
        total,
        reserved,
        trend: 0,
        critical
      };
    });

    res.json({
      totalUnits,
      reservedUnits,
      bloodTypes
    });
  } catch (error) {
    console.error('Get Inventory Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const addBloodUnit = async (req, res) => {
  try {
    const bloodBankId = req.user.id;
    const { bloodType, volume, collectionDate, expiryDate } = req.body;

    const unit = await prisma.bloodUnit.create({
      data: {
        bloodBankId,
        bloodType,
        volume: volume || 350,
        collectionDate: new Date(collectionDate || Date.now()),
        expiryDate: new Date(expiryDate || Date.now() + 35 * 24 * 60 * 60 * 1000), // 35 days default
        status: 'AVAILABLE'
      }
    });

    res.status(201).json({ message: 'Blood unit added successfully', unit });
  } catch (error) {
    console.error('Add Unit Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getIncomingRequests = async (req, res) => {
  try {
    // For now, return all pending requests in the system.
    // In Phase 3, this will be filtered by distance/blood bank.
    const requests = await prisma.bloodRequest.findMany({
      where: { status: 'PENDING' },
      include: { requester: true }
    });

    const formatted = requests.map(req => ({
      id: req.id,
      bloodType: req.bloodType,
      units: req.units, 
      urgency: req.urgency.toLowerCase(),
      hospital: req.requester.name,
      hospitalPhone: req.requester.mobile,
      patient: req.patientName,
      ward: req.ward || 'General',
      requestedAt: req.createdAt,
      fhirId: req.id.substring(0, 8)
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Get Incoming Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const fulfillRequest = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.bloodRequest.update({ where: { id }, data: { status: 'COMPLETED' } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fulfill request' });
  }
};

const declineRequest = async (req, res) => {
  try {
    const { id } = req.params;
    // We just ignore it, or maybe mark it if it was specifically assigned to this bank.
    // For now, doing nothing to the global status since it's an open broadcast.
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to decline request' });
  }
};

const simulateWhatsAppReply = async (req, res) => {
  try {
    const bloodBankId = req.user.id;
    const { parsedData } = req.body;
    
    // Create new blood units for the parsed data
    const newUnits = [];
    for (const [bloodType, count] of Object.entries(parsedData)) {
      for (let i = 0; i < count; i++) {
        newUnits.push({
          bloodBankId,
          bloodType,
          volume: 350,
          collectionDate: new Date(),
          expiryDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000), // 35 days
          status: 'AVAILABLE'
        });
      }
    }

    if (newUnits.length > 0) {
      await prisma.bloodUnit.createMany({
        data: newUnits
      });
    }

    res.json({ success: true, message: 'Inventory updated from WhatsApp parsed data' });
  } catch (err) {
    console.error('Simulate WA Reply Error:', err);
    res.status(500).json({ error: 'Failed to update inventory' });
  }
};

module.exports = {
  getInventory,
  addBloodUnit,
  getIncomingRequests,
  fulfillRequest,
  declineRequest,
  simulateWhatsAppReply
};
