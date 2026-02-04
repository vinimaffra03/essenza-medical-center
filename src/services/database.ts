// @ts-nocheck
// Database service for Neon PostgreSQL
// Uses @neondatabase/serverless for edge-compatible connections

import { neon } from '@neondatabase/serverless'

const DATABASE_URL = import.meta.env.VITE_DATABASE_URL

if (!DATABASE_URL) {
  console.warn('Missing VITE_DATABASE_URL - database features will not work')
}

// Create SQL query function
const sql = DATABASE_URL ? neon(DATABASE_URL) : null

/**
 * Database helper functions
 */
export const db = {
  // Raw SQL query
  query: async (query, params = []) => {
    if (!sql) throw new Error('Database not configured')
    return sql(query, params)
  },

  // ============================================
  // PROFILES
  // ============================================

  profiles: {
    // Get profile by ID
    getById: async (id) => {
      const result = await sql`
        SELECT * FROM profiles WHERE id = ${id}
      `
      return result[0] || null
    },

    // Get profile by email
    getByEmail: async (email) => {
      const result = await sql`
        SELECT * FROM profiles WHERE email = ${email.toLowerCase()}
      `
      return result[0] || null
    },

    // Create profile
    create: async ({ id, email, name, role, phone = null, bio = null }) => {
      const result = await sql`
        INSERT INTO profiles (id, email, name, role, phone, bio)
        VALUES (${id}, ${email.toLowerCase()}, ${name}, ${role}, ${phone}, ${bio})
        RETURNING *
      `
      return result[0]
    },

    // Update profile
    update: async (id, updates) => {
      const { name, phone, bio, role } = updates
      const result = await sql`
        UPDATE profiles
        SET
          name = COALESCE(${name}, name),
          phone = COALESCE(${phone}, phone),
          bio = COALESCE(${bio}, bio),
          role = COALESCE(${role}, role),
          updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `
      return result[0]
    },

    // Upsert profile (create or update)
    upsert: async ({ id, email, name, role }) => {
      const result = await sql`
        INSERT INTO profiles (id, email, name, role)
        VALUES (${id}, ${email.toLowerCase()}, ${name}, ${role})
        ON CONFLICT (id) DO UPDATE SET
          email = EXCLUDED.email,
          name = EXCLUDED.name,
          updated_at = NOW()
        RETURNING *
      `
      return result[0]
    },
  },

  // ============================================
  // ROOMS
  // ============================================

  rooms: {
    // Get all active rooms
    getAll: async (filters = {}) => {
      const { city, minPrice, maxPrice, minCapacity, ownerId } = filters

      let query = `
        SELECT r.*, p.name as owner_name, p.email as owner_email
        FROM rooms r
        LEFT JOIN profiles p ON r.owner_id = p.id
        WHERE r.is_active = true
      `
      const params = []
      let paramIndex = 1

      if (city) {
        query += ` AND LOWER(r.city) LIKE LOWER($${paramIndex})`
        params.push(`%${city}%`)
        paramIndex++
      }
      if (minPrice) {
        query += ` AND r.price_per_hour >= $${paramIndex}`
        params.push(minPrice)
        paramIndex++
      }
      if (maxPrice) {
        query += ` AND r.price_per_hour <= $${paramIndex}`
        params.push(maxPrice)
        paramIndex++
      }
      if (minCapacity) {
        query += ` AND r.capacity >= $${paramIndex}`
        params.push(minCapacity)
        paramIndex++
      }
      if (ownerId) {
        query += ` AND r.owner_id = $${paramIndex}`
        params.push(ownerId)
        paramIndex++
      }

      query += ' ORDER BY r.created_at DESC'

      return sql(query, params)
    },

    // Get room by ID
    getById: async (id) => {
      const result = await sql`
        SELECT r.*, p.name as owner_name, p.email as owner_email, p.phone as owner_phone
        FROM rooms r
        LEFT JOIN profiles p ON r.owner_id = p.id
        WHERE r.id = ${id}
      `
      return result[0] || null
    },

    // Get rooms by owner
    getByOwner: async (ownerId) => {
      return sql`
        SELECT * FROM rooms
        WHERE owner_id = ${ownerId}
        ORDER BY created_at DESC
      `
    },

    // Create room
    create: async (room) => {
      const {
        owner_id, title, description, address, city, state, zip_code,
        price_per_hour, capacity, amenities = [], images = [],
        latitude = null, longitude = null
      } = room

      const result = await sql`
        INSERT INTO rooms (
          owner_id, title, description, address, city, state, zip_code,
          price_per_hour, capacity, amenities, images, latitude, longitude
        )
        VALUES (
          ${owner_id}, ${title}, ${description}, ${address}, ${city}, ${state}, ${zip_code},
          ${price_per_hour}, ${capacity}, ${JSON.stringify(amenities)}, ${JSON.stringify(images)},
          ${latitude}, ${longitude}
        )
        RETURNING *
      `
      return result[0]
    },

    // Update room
    update: async (id, ownerId, updates) => {
      const {
        title, description, address, city, state, zip_code,
        price_per_hour, capacity, amenities, images, is_active,
        latitude, longitude
      } = updates

      const result = await sql`
        UPDATE rooms SET
          title = COALESCE(${title}, title),
          description = COALESCE(${description}, description),
          address = COALESCE(${address}, address),
          city = COALESCE(${city}, city),
          state = COALESCE(${state}, state),
          zip_code = COALESCE(${zip_code}, zip_code),
          price_per_hour = COALESCE(${price_per_hour}, price_per_hour),
          capacity = COALESCE(${capacity}, capacity),
          amenities = COALESCE(${amenities ? JSON.stringify(amenities) : null}, amenities),
          images = COALESCE(${images ? JSON.stringify(images) : null}, images),
          is_active = COALESCE(${is_active}, is_active),
          latitude = COALESCE(${latitude}, latitude),
          longitude = COALESCE(${longitude}, longitude),
          updated_at = NOW()
        WHERE id = ${id} AND owner_id = ${ownerId}
        RETURNING *
      `
      return result[0]
    },

    // Delete room
    delete: async (id, ownerId) => {
      const result = await sql`
        DELETE FROM rooms
        WHERE id = ${id} AND owner_id = ${ownerId}
        RETURNING id
      `
      return result.length > 0
    },
  },

  // ============================================
  // BOOKINGS
  // ============================================

  bookings: {
    // Get all bookings for a user
    getByUser: async (userId) => {
      return sql`
        SELECT b.*, r.title as room_title, r.address as room_address, r.images as room_images
        FROM bookings b
        LEFT JOIN rooms r ON b.room_id = r.id
        WHERE b.user_id = ${userId}
        ORDER BY b.start_time DESC
      `
    },

    // Get all bookings for rooms owned by user
    getByOwner: async (ownerId) => {
      return sql`
        SELECT b.*, r.title as room_title, r.address as room_address,
               p.name as user_name, p.email as user_email
        FROM bookings b
        LEFT JOIN rooms r ON b.room_id = r.id
        LEFT JOIN profiles p ON b.user_id = p.id
        WHERE r.owner_id = ${ownerId}
        ORDER BY b.start_time DESC
      `
    },

    // Get booking by ID
    getById: async (id) => {
      const result = await sql`
        SELECT b.*, r.title as room_title, r.address as room_address, r.price_per_hour,
               p.name as user_name, p.email as user_email
        FROM bookings b
        LEFT JOIN rooms r ON b.room_id = r.id
        LEFT JOIN profiles p ON b.user_id = p.id
        WHERE b.id = ${id}
      `
      return result[0] || null
    },

    // Get bookings for a room (for availability check)
    getByRoom: async (roomId, startDate, endDate) => {
      return sql`
        SELECT * FROM bookings
        WHERE room_id = ${roomId}
        AND status NOT IN ('cancelled')
        AND start_time >= ${startDate}
        AND end_time <= ${endDate}
        ORDER BY start_time ASC
      `
    },

    // Create booking
    create: async (booking) => {
      const {
        room_id, user_id, start_time, end_time, total_price, notes = null
      } = booking

      const result = await sql`
        INSERT INTO bookings (room_id, user_id, start_time, end_time, total_price, notes)
        VALUES (${room_id}, ${user_id}, ${start_time}, ${end_time}, ${total_price}, ${notes})
        RETURNING *
      `
      return result[0]
    },

    // Update booking status
    updateStatus: async (id, status, stripeData = {}) => {
      const { stripe_session_id, stripe_payment_intent_id } = stripeData

      const result = await sql`
        UPDATE bookings SET
          status = ${status},
          stripe_session_id = COALESCE(${stripe_session_id}, stripe_session_id),
          stripe_payment_intent_id = COALESCE(${stripe_payment_intent_id}, stripe_payment_intent_id),
          updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `
      return result[0]
    },

    // Cancel booking
    cancel: async (id, userId) => {
      const result = await sql`
        UPDATE bookings SET
          status = 'cancelled',
          updated_at = NOW()
        WHERE id = ${id} AND user_id = ${userId} AND status IN ('pending', 'confirmed')
        RETURNING *
      `
      return result[0]
    },

    // Get dashboard stats
    getStats: async (ownerId) => {
      const result = await sql`
        SELECT
          COUNT(*) FILTER (WHERE status = 'pending') as pending_count,
          COUNT(*) FILTER (WHERE status = 'confirmed') as confirmed_count,
          COUNT(*) FILTER (WHERE status = 'paid') as paid_count,
          COUNT(*) FILTER (WHERE status = 'completed') as completed_count,
          COALESCE(SUM(total_price) FILTER (WHERE status IN ('paid', 'completed')), 0) as total_revenue
        FROM bookings b
        LEFT JOIN rooms r ON b.room_id = r.id
        WHERE r.owner_id = ${ownerId}
      `
      return result[0]
    },
  },
}

export default db
