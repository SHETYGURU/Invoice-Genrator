const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

// Populate state dropdowns
const stateDropdowns = document.querySelectorAll('select[id$="-state"]');
stateDropdowns.forEach(dropdown => {
    states.forEach(state => {
        const option = document.createElement('option');
        option.value = state;
        option.textContent = state;
        dropdown.appendChild(option);
    });
});

// Function to format pincode
function formatPincode(pincode) {
    return pincode.replace(/(\d{3})(\d{3})/, '$1 $2');
}

// Add event listeners for validation
document.getElementById('seller-pincode').addEventListener('input', validatePincode);
document.getElementById('billing-pincode').addEventListener('input', validatePincode);
document.getElementById('shipping-pincode').addEventListener('input', validatePincode);

document.getElementById('seller-pan').addEventListener('input', validatePAN);
document.getElementById('seller-gst').addEventListener('input', validateGST);

// Convert lowercase to uppercase for PAN and GST fields
document.getElementById('seller-pan').addEventListener('input', function() {
    this.value = this.value.toUpperCase();
});
document.getElementById('seller-gst').addEventListener('input', function() {
    this.value = this.value.toUpperCase();
});

// Validation functions
function validatePincode(event) {
    const input = event.target;
    const formatted = formatPincode(input.value.replace(/\s/g, ''));
    const isValid = /^\d{3} \d{3}$/.test(formatted);

    input.value = formatted;
    setValidationState(input, isValid, "123 456");
}

function validatePAN(event) {
    const input = event.target;
    const isValid = /^[A-Z]{5}\d{4}[A-Z]$/.test(input.value);
    setValidationState(input, isValid, "ABCDE1234F");
}

function validateGST(event) {
    const input = event.target;
    const isValid = /^\d{2}[A-Z]{5}\d{4}[A-Z]\d[Z][A-Z\d]$/.test(input.value);
    setValidationState(input, isValid, "11AAAAA0000A1Z5");
}

function setValidationState(input, isValid, example) {
    let warning = input.parentNode.querySelector('.warning');
    if (!warning) {
        warning = document.createElement('div');
        warning.classList.add('warning');
        input.parentNode.insertBefore(warning, input.nextSibling);
    }

    if (isValid) {
        input.style.borderColor = 'green';
        warning.style.color = 'green';
        warning.innerHTML = `&#10003; Correct format`;
        setTimeout(() => {
            input.style.borderColor = '';
            warning.innerHTML = '';
        }, 2000);
    } else {
        input.style.borderColor = 'red';
        warning.style.color = 'red';
        warning.textContent = `Please input the correct format (Ex: ${example})`;
    }
}

// Add item functionality
document.getElementById('add-item').addEventListener('click', function() {
    const itemDetails = document.getElementById('item-details');
    const newItem = document.createElement('div');
    newItem.classList.add('item');
    newItem.innerHTML = `
        <label>Description: <input type="text" class="description" required></label>
        <label>Unit Price: <input type="number" class="unit-price" step="0.01" required></label>
        <label>Quantity: <input type="number" class="quantity" required></label>
        <label>Discount: <input type="number" class="discount" step="0.01" required></label>
        <label>Tax Rate: <input type="number" class="tax-rate" value="18" step="0.01" required></label>
    `;
    itemDetails.appendChild(newItem);
    itemDetails.appendChild(document.getElementById('add-item')); // Ensure the button is at the bottom
});

// Display all fieldsets at once
const fieldsets = document.querySelectorAll('fieldset');
fieldsets.forEach(fieldset => {
    fieldset.style.display = 'block';
});

// Format item data as string for alert
function formatItemsForAlert(items) {
    let formattedItems = 'Items:\n';
    items.forEach((item, index) => {
        formattedItems += `
            Item ${index + 1}:
            - Description: ${item.description}
            - Unit Price: ${item.unit_price}
            - Quantity: ${item.quantity}
            - Discount: ${item.discount}
            - Tax Rate: ${item.tax_rate}\n
        `;
    });
    return formattedItems;
}

// Form submission handler
document.getElementById('invoice-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const data = {
        sellerDetails: {
            name: document.getElementById('seller-name').value,
            address: document.getElementById('seller-address').value,
            city: document.getElementById('seller-city').value,
            state: document.getElementById('seller-state').value,
            pincode: document.getElementById('seller-pincode').value,
            pan_no: document.getElementById('seller-pan').value,
            gst_no: document.getElementById('seller-gst').value
        },
        billingDetails: {
            name: document.getElementById('billing-name').value,
            address: document.getElementById('billing-address').value,
            city: document.getElementById('billing-city').value,
            state: document.getElementById('billing-state').value,
            pincode: document.getElementById('billing-pincode').value,
            state_code: document.getElementById('billing-state-code').value
        },
        shippingDetails: {
            name: document.getElementById('shipping-name').value,
            address: document.getElementById('shipping-address').value,
            city: document.getElementById('shipping-city').value,
            state: document.getElementById('shipping-state').value,
            pincode: document.getElementById('shipping-pincode').value,
            state_code: document.getElementById('shipping-state-code').value
        },
        orderDetails: {
            order_no: document.getElementById('order-no').value,
            order_date: document.getElementById('order-date').value
        },
        invoiceDetails: {
            invoice_no: document.getElementById('invoice-no').value,
            invoice_date: document.getElementById('invoice-date').value
        },
        placeOfSupply: document.getElementById('place-of-supply').value,
        placeOfDelivery: document.getElementById('place-of-delivery').value,
        reverseCharge: document.querySelector('input[name="reverse-charge"]:checked').value,
        items: Array.from(document.querySelectorAll('#item-details .item')).map(item => ({
            description: item.querySelector('.description').value,
            unit_price: parseFloat(item.querySelector('.unit-price').value),
            quantity: parseFloat(item.querySelector('.quantity').value),
            discount: parseFloat(item.querySelector('.discount').value),
            tax_rate: parseFloat(item.querySelector('.tax-rate').value)
        })),
        signature: ''
    };

    const reader = new FileReader();
    reader.onload = function() {
        data.signature = reader.result;
        localStorage.setItem('invoiceData', JSON.stringify(data));

        // Display alert with item details
        // alert(formatItemsForAlert(data.items));

        window.location.href = 'invoice.html';
    };
    reader.readAsDataURL(document.getElementById('signature').files[0]);
});

// Clear form entries
document.getElementById('download-invoice').addEventListener('click', function() {
    document.getElementById('invoice-form').reset();
    document.querySelectorAll('#item-details .item').forEach(item => item.remove());
});

// Add event listener for file input change
document.getElementById('signature').addEventListener('change', handleFileSelect);

function handleFileSelect(event) {
    const file = event.target.files[0];
    const maxSizeMB = 1; // 1MB limit
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
        alert(`File size exceeds ${maxSizeMB}MB limit.`);
        event.target.value = ''; // Reset the input
        return;
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
        alert('Only JPG, JPEG, and PNG files are allowed.');
        event.target.value = ''; // Reset the input
        return;
    }

    // Handle the file (you can proceed with further logic like reading the file)
    // Example: you can use FileReader to read contents of the file if needed
    const reader = new FileReader();
    reader.onload = function() {
        // You can use reader.result here if needed
    };
    reader.readAsDataURL(file);
}
