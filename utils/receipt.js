exports.generateReceiptHTML = ({
                                   receiptNumber,
                                   donorName,
                                   donorEmail,
                                   donorAddress,
                                   amount,
                                   campaignTitle,
                                   createdAt
                               }) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
      <h2 style="color: #4CAF50;">Donation Receipt</h2>
      <p><strong>Receipt No:</strong> ${receiptNumber}</p>
      <p><strong>Donor Name:</strong> ${donorName}</p>
      <p><strong>Email:</strong> ${donorEmail}</p>
      <p><strong>Address:</strong> ${donorAddress || 'N/A'}</p>
      <p><strong>Campaign:</strong> ${campaignTitle}</p>
      <p><strong>Amount Donated:</strong> $${Number(amount).toFixed(2)}</p>
      <p><strong>Date:</strong> ${new Date(createdAt).toLocaleString()}</p>
      <hr />
      <p>Thank you for your generous support!</p>
    </div>
  `;
};
