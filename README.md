# Invoice Generator

This project is an invoice generator web application designed to help users create and manage invoices. The application is built using HTML, CSS, and JavaScript, with features for handling seller, billing, and shipping details, order and invoice information, item details, and tax calculations based on place of supply and delivery.

## Table of Contents

- [Features](#features)
-  [Demo](#demo)
- [Installation](#installation)
- [Usage](#usage)
- [Form Fields](#form-fields)
- [Validation](#validation)
- [Contributing](#contributing)
- [License](#license)


## Features

- Dynamic form for entering seller, billing, and shipping details
- Order and invoice information input fields
- Place of supply and delivery inputs for tax calculations
- Option to add multiple items with descriptions, HSN codes, quantities, rates, and amounts
- Real-time validation for pincode, PAN, and GST fields
- Preview and clear invoice functionalities
- Responsive design for better user experience on various devices

## Demo

Check out the live demo [here](https://aurikatech.netlify.app/).

## Installation

1. Clone the repository to your local machine:

    ```sh
    git clone https://github.com/your-username/invoice-generator.git
    ```

2. Navigate to the project directory:

    ```sh
    cd invoice-generator
    ```

## Usage

1. Open the `index.html` file in a web browser.
2. Fill in the form fields with the necessary information.
3. Click the **Preview** button to preview the invoice.
4. To clear the form and start over, click the **Clear Invoice** button.

## Form Fields

### Seller Details
- Name
- Address
- City
- State
- Pincode
- PAN No.
- GST Registration No.

### Billing Details
- Name
- Address
- City
- State
- Pincode
- State/UT Code

### Shipping Details
- Name
- Address
- City
- State
- Pincode
- State/UT Code

### Order Details
- Order No.
- Order Date

### Invoice Details
- Invoice No.
- Invoice Date

### Place of Supply and Delivery
- Place of Supply
- Place of Delivery

### Reverse Charge
- Yes/No option

### Item Details
- Item Description
- HSN Code
- Quantity
- Rate
- Amount

### Signature
- Upload signature image

## Validation

The form includes real-time validation for the following fields:

- **Pincode**: Must be in the format `123 456`.
- **PAN**: Must be in the format `ABCDE1234F`.
- **GST**: Must be in the format `11AAAAA0000A1Z5`.

Validation messages will be displayed next to the input fields to guide the user in entering the correct format.

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add new feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Create a Pull Request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.


