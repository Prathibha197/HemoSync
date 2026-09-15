const prisma = require('../config/db');
const { getIo } = require('../utils/socket');
const { findEligibleDonorsNearby } = require('../services/donorService');

const createRequest = async (req, res) => {
  try {
    const { bloodType, urgency, patient, ward, units, longitude, latitude } = req.body;
    const requesterId = req.user.id; // from auth middleware

    let bloodRequest;
    
    if (longitude && latitude) {
      const result = await prisma.$queryRaw`
        INSERT INTO "BloodRequest" (id, "requesterId", "bloodType", urgency, "patientName", ward, units, "updatedAt", location)
        VALUES (
          gen_random_uuid(), 
          ${requesterId}, 
          ${bloodType}, 
          ${urgency}::"Urgency", 
          ${patient || null},
          ${ward || null},
          ${units || 1},
          NOW(), 
          ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)
        )
        RETURNING id, "requesterId", "bloodType", urgency, "patientName", ward, units, status, "createdAt", "updatedAt";
      `;
      bloodRequest = result[0];
    } else {
      bloodRequest = await prisma.bloodRequest.create({
        data: {
          requesterId,
          bloodType,
          urgency,
          patientName: patient,
          ward,
          units
        }
      });
    }

    // Broadcast emergency alert using Socket.io to nearest donors first
    const io = getIo();
    
    // Optionally notify nearby donors and throttle
    if (longitude && latitude) {
      const radiusKm = urgency === 'CRITICAL' ? 20 : 10;
      const nearbyDonors = await findEligibleDonorsNearby(longitude, latitude, radiusKm, bloodType);
      
      console.log(`Found ${nearbyDonors.length} eligible donors nearby.`);
      
      const logs = nearbyDonors.map(donor => ({
        requestId: bloodRequest.id,
        donorId: donor.id,
        distance: donor.distance,
        status: 'DELIVERED'
      }));

      if (logs.length > 0) {
        await prisma.notificationLog.createMany({
          data: logs,
          skipDuplicates: true
        });
      }

      // Targeted notification logic could go here. For now, broadcasting to all via Socket.IO
    }

    const hospital = await prisma.user.findUnique({ where: { id: requesterId } });

    io.emit('emergency_alert', {
      id: bloodRequest.id,
      bloodType: bloodRequest.bloodType,
      urgency: bloodRequest.urgency.toLowerCase(),
      hospital: hospital.name,
      hospitalPhone: hospital.mobile,
      address: 'Unknown location', // Could be geocoded
      distance: 'Nearby', // Would be calculated per-donor in real app
      units: bloodRequest.units,
      postedAt: bloodRequest.createdAt,
      notes: bloodRequest.patientName ? `For patient: ${bloodRequest.patientName} (${bloodRequest.ward})` : null
    });

    res.status(201).json({ message: 'Blood request created', bloodRequest });
  } catch (error) {
    console.error('Create Request Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedRequest = await prisma.bloodRequest.update({
      where: { id },
      data: { status }
    });

    res.json({ message: 'Blood request updated', updatedRequest });
  } catch (error) {
    console.error('Update Request Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createRequest,
  updateRequest
};
