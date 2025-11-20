document.addEventListener('DOMContentLoaded', function() {
    const emergencyForm = document.getElementById('emergencyForm');

    emergencyForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(emergencyForm);
        const emergencyData = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            location: formData.get('location'),
            emergencyType: formData.get('emergencyType'),
            description: formData.get('description')
        };

        // Here you would typically send the data to your server
        console.log('Emergency request submitted:', emergencyData);

        // For now, just show an alert
        alert('Emergency request submitted successfully! Help is on the way.');

        // Reset the form
        emergencyForm.reset();
    });
});
