// Helper function to fetch data from local storage
function fetchInvoiceData() {
    const data = JSON.parse(localStorage.getItem('invoiceData'));
    console.log('Fetched Invoice Data:', data);
    return data;
}

// Helper function to format amount in words
function convertAmountToWords(amount) {
    // Function to convert amount to words can be implemented or imported
    console.log('Amount to Words:', amount);
    return amount + " Rupees only"; // Placeholder
}

// Function to render the invoice
function renderInvoice(data) {
    console.log('Rendering Invoice Data:', data);

    document.getElementById('seller-name').textContent = data.sellerDetails.name;
    document.getElementById('seller-address').textContent = data.sellerDetails.address;
    document.getElementById('seller-city').textContent = data.sellerDetails.city;
    document.getElementById('seller-state').textContent = data.sellerDetails.state;
    document.getElementById('seller-pincode').textContent = data.sellerDetails.pincode;
    document.getElementById('seller-pan').textContent = `PAN No: ${data.sellerDetails.pan_no}`;
    document.getElementById('seller-gst').textContent = `GST Registration No: ${data.sellerDetails.gst_no}`;

    document.getElementById('place-of-supply-text').textContent = data.placeOfSupply;

    document.getElementById('billing-name').textContent = data.billingDetails.name;
    document.getElementById('billing-address').textContent = data.billingDetails.address;
    document.getElementById('billing-city').textContent = data.billingDetails.city;
    document.getElementById('billing-state').textContent = data.billingDetails.state;
    document.getElementById('billing-pincode').textContent = data.billingDetails.pincode;
    document.getElementById('billing-state-code').textContent = data.billingDetails.state_code;

    document.getElementById('shipping-name').textContent = data.shippingDetails.name;
    document.getElementById('shipping-address').textContent = data.shippingDetails.address;
    document.getElementById('shipping-city').textContent = data.shippingDetails.city;
    document.getElementById('shipping-state').textContent = data.shippingDetails.state;
    document.getElementById('shipping-pincode').textContent = data.shippingDetails.pincode;
    document.getElementById('shipping-state-code').textContent = data.shippingDetails.state_code;

    document.getElementById('place-of-delivery-text').textContent = data.placeOfDelivery;

    document.getElementById('order-no').textContent = `Order No: ${data.orderDetails.order_no}`;
    document.getElementById('order-date').textContent = `Order Date: ${data.orderDetails.order_date}`;

    document.getElementById('invoice-no').textContent = `Invoice No: ${data.invoiceDetails.invoice_no}`;
    document.getElementById('invoice-date').textContent = `Invoice Date: ${data.invoiceDetails.invoice_date}`;
    document.getElementById('reverse-charge').textContent = `Reverse Charge: ${data.reverseCharge}`;

    const tbody = document.querySelector('#item-table tbody');
    tbody.innerHTML = ''; // Clear any existing rows

    let totalAmount = 0;

    data.items.forEach(item => {
        console.log('Processing Item:', item);

        const description = item.description;
        const unitPrice = item.unit_price;
        const quantity = item.quantity;
        const discount = item.discount;

        const netAmount = unitPrice * quantity - discount;

        let taxType = '';
        let taxRate = 0;
        let cgstAmount = 0;
        let sgstAmount = 0;
        let igstAmount = 0;

        if (data.placeOfSupply === data.placeOfDelivery) {
            // Intra-state supply (CGST & SGST)
            taxType = 'CGST & SGST';
            taxRate = item.tax_rate / 2; // Assuming equal CGST & SGST rates
            cgstAmount = netAmount * (taxRate / 100);
            sgstAmount = netAmount * (taxRate / 100);
        } else {
            // Inter-state supply (IGST)
            taxType = 'IGST';
            taxRate = item.tax_rate;
            igstAmount = netAmount * (taxRate / 100);
        }

        let taxAmount = cgstAmount + sgstAmount + igstAmount;
        let total = netAmount + taxAmount;
        totalAmount += total;

        const row = document.createElement('tr');

        if (data.placeOfSupply === data.placeOfDelivery) {
            // Separate rows for CGST and SGST
            row.innerHTML = `
                <td>${description}</td>
                <td>${unitPrice.toFixed(2)}</td>
                <td>${quantity}</td>
                <td>${discount.toFixed(2)}</td>
                <td>${netAmount.toFixed(2)}</td>
                <td>${taxType}</td>
                <td>${taxRate.toFixed(2)}% & ${taxRate.toFixed(2)}%</td>
                <td>${cgstAmount.toFixed(2)} & ${sgstAmount.toFixed(2)}</td>
                <td>${total.toFixed(2)}</td>
            `;
        } else {
            // Single row for IGST
            row.innerHTML = `
                <td>${description}</td>
                <td>${unitPrice.toFixed(2)}</td>
                <td>${quantity}</td>
                <td>${discount.toFixed(2)}</td>
                <td>${netAmount.toFixed(2)}</td>
                <td>${taxType}</td>
                <td>${taxRate.toFixed(2)}%</td>
                <td>${taxAmount.toFixed(2)}</td>
                <td>${total.toFixed(2)}</td>
            `;
        }

        tbody.appendChild(row);
    });

    document.getElementById('amount-words').textContent = convertAmountToWords(totalAmount);

    document.getElementById('signature').src = data.signature;
}

document.addEventListener('DOMContentLoaded', () => {
    const data = fetchInvoiceData();
    renderInvoice(data);

    document.getElementById('download-pdf').addEventListener('click', () => {
        const invoiceElement = document.getElementById('invoice');
        const pdf = new jspdf.jsPDF();
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        html2canvas(invoiceElement).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const imgProps = pdf.getImageProperties(imgData);
            const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

            // Calculate scale factor to fit content within one page
            const scaleFactor = pdfHeight / imgHeight;

            // Resize canvas to fit the entire content on one page
            const scaledCanvas = document.createElement('canvas');
            scaledCanvas.width = canvas.width * scaleFactor;
            scaledCanvas.height = canvas.height * scaleFactor;

            const ctx = scaledCanvas.getContext('2d');
            ctx.scale(scaleFactor, scaleFactor);
            ctx.drawImage(canvas, 0, 0);

            const scaledImgData = scaledCanvas.toDataURL('image/png');
            pdf.addImage(scaledImgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('invoice.pdf');
        });
    });
});
