const validateEventType = (req, res, next) => {
  const { title, slug, duration } = req.body;
  const errors = [];
  if (!title || !title.trim()) errors.push('Title is required');
  if (!slug || !slug.trim()) errors.push('Slug is required');
  if (!duration || Number(duration) <= 0) {
    errors.push('Duration must be greater than 0');
  }
  // Validate slug is URL-safe
  if (slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    errors.push('Slug must be URL-safe (lowercase letters, numbers, hyphens)');
  }
  if (errors.length) return res.status(400).json({ errors });
  next();
};

const validateBooking = (req, res, next) => {
  const { name, email, start_time, timezone } = req.body;
  const errors = [];
  if (!name || !name.trim()) errors.push('Name is required');
  if (!email || !email.trim()) errors.push('Email is required');
  if (!start_time) errors.push('Start time is required');
  if (!timezone) errors.push('Timezone is required');
  if (errors.length) return res.status(400).json({ errors });
  next();
};

module.exports = { validateEventType, validateBooking };
