export const handleWhatsAppClick = () => {
  window.open('https://wa.me/5491155555555', '_blank');
};

export const getCurrentWeek = () => {
  const currentDate = new Date();
  const startDate = new Date(currentDate.getFullYear(), 0, 1);

  const days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));

  const weekNumber = Math.ceil((days + startDate.getDay() + 1) / 7);
  const year = currentDate.getFullYear();
  return `${year}-W${String(weekNumber).padStart(2, '0')}`;
};
