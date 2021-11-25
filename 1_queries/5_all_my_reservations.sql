SELECT reservations.*, properties.*, AVG(property_reviews.rating) AS average_rating
  FROM property_reviews
  JOIN reservations ON reservations.id = reservation_id
  JOIN properties ON properties.id = reservations.property_id
  WHERE reservations.guest_id = 1 AND end_date < now()::date
  GROUP BY reservations.id, properties.id
  ORDER BY start_date
  LIMIT 10;