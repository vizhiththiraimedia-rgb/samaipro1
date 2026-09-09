/* =========================================================================
   SAM AI - App JS
   Shared JavaScript for standalone service sites
   ========================================================================= */

// Credit countdown timer
function initCreditTimer() {
    const timer = document.querySelector('.credit-timer');
    if (timer) {
        let seconds = parseInt(timer.dataset.seconds || '60');
        const interval = setInterval(() => {
            seconds--;
            if (seconds <= 0) {
                clearInterval(interval);
                location.reload();
            } else {
                timer.textContent = `Refreshing in ${seconds}s...`;
            }
        }, 1000);
    }
}

// Purchase credits
async function purchaseCredits(credits) {
    try {
        const response = await fetch('/billing.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `purchase=1&pack=${credits}`
        });
        const result = await response.json();
        if (result.checkout_url) {
            window.location.href = result.checkout_url;
        }
    } catch (e) {
        console.error('Purchase error:', e);
        alert('Failed to process purchase. Please try again.');
    }
}

// Copy to clipboard
function copyToClipboard(text, button) {
    navigator.clipboard.writeText(text).then(() => {
        const original = button.textContent;
        button.textContent = 'Copied!';
        button.disabled = true;
        setTimeout(() => {
            button.textContent = original;
            button.disabled = false;
        }, 2000);
    });
}

// Initialize tooltips
function initTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(el => {
        el.addEventListener('mouseenter', () => {
            const tip = document.createElement('div');
            tip.className = 'tooltip';
            tip.textContent = el.dataset.tooltip;
            document.body.appendChild(tip);
            const rect = el.getBoundingClientRect();
            tip.style.top = rect.top - 30 + 'px';
            tip.style.left = rect.left + 'px';
        });
        el.addEventListener('mouseleave', () => {
            document.querySelector('.tooltip')?.remove();
        });
    });
}

// Form submit with loading state
function initFormSubmit() {
    const forms = document.querySelectorAll('form[data-loading]');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const btn = form.querySelector('button[type="submit"]');
            if (btn) {
                btn.disabled = true;
                btn.innerHTML = '<span class="spinner"></span> Loading...';
            }
        });
    });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    initCreditTimer();
    initTooltips();
    initFormSubmit();
});

// Handle API errors globally
function handleApiError(result) {
    if (result.status === 'payment_required') {
        const msg = `Insufficient credits. You need ${result.current_balance} more credits.`;
        alert(msg);
        window.location.href = '/billing.php';
        return true;
    }
    if (result.status === 'unauthorized') {
        alert('Session expired. Please log in again.');
        window.location.href = '/login.php';
        return true;
    }
    if (result.status === 'error') {
        console.error('API Error:', result.error);
        return true;
    }
    return false;
}
