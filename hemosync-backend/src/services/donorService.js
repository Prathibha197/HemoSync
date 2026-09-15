const prisma = require('../config/db');

/**
 * Find eligible donors within a specified radius (in kilometers)
 * using PostGIS ST_DWithin function.
 * 
 * @param {number} longitude 
 * @param {number} latitude 
 * @param {number} radiusKm 
 * @param {string} bloodType 
 */
async function findEligibleDonorsNearby(longitude, latitude, radiusKm, bloodType) {
  const radiusMeters = radiusKm * 1000;

  // Raw query using PostGIS ST_DWithin and ST_MakePoint.
  // We use standard ST_SetSRID(ST_MakePoint(lon, lat), 4326) to generate the point
  // and we compare it against the User's "location" geography/geometry point.
  // Note: We cast location to geography to get precise distance calculation in meters.

  const donors = await prisma.$queryRaw`
    SELECT id, name, email, "bloodType", "lastDonation",
           ST_Distance(
             "location"::geography, 
             ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography
           ) as distance
    FROM "User"
    WHERE role = 'DONOR'
      AND "bloodType" = ${bloodType}
      AND "location" IS NOT NULL
      AND ST_DWithin(
        "location"::geography, 
        ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography, 
        ${radiusMeters}
      )
    ORDER BY distance ASC
  `;

  return donors;
}

module.exports = {
  findEligibleDonorsNearby,
};
