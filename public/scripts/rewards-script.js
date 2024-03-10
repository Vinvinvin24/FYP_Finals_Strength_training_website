document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.redeem-button').forEach(button => {
        button.addEventListener('click', function() {
            const rewardId = this.getAttribute('data-reward-id');

            fetch('/redeem-reward', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rewardId }),
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                // Optionally disable the button after successful redemption
                this.disabled = true;
            })
            .catch(error => console.error('Error:', error));
        });
    });
});
