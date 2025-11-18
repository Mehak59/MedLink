document.addEventListener('DOMContentLoaded', () => {
  const paymentBtn = document.getElementById('complete-payment-btn');

  paymentBtn.addEventListener('click', () => {
    alert('✅ Payment done successfully! Redirecting to Pharmacy...');
    localStorage.removeItem('cart');
    window.location.href = '/pharmacy';
  });
});
