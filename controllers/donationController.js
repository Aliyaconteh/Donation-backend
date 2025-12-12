const db = require('../config/db');
const { generateReceiptHTML } = require('../utils/receipt');
const { sendReceipt } = require('../utils/email');

const generateReceiptNumber = () => 'R-' + Math.random().toString(36).substr(2, 9).toUpperCase();


exports.submitDonation = async (req, res) => {
    const { campaign_id, amount, is_recurring, donor_name, donor_email, donor_address } = req.body;
    const user_id = req.user.id;

    try {
        const [result] = await db.execute(
            `INSERT INTO donations 
             (user_id, campaign_id, amount, is_recurring, donor_name, donor_email, donor_address)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [user_id, campaign_id, amount, is_recurring, donor_name, donor_email, donor_address]
        );

        const donation_id = result.insertId;

        await db.execute(
            'UPDATE campaigns SET current_amount = current_amount + ? WHERE id = ?',
            [amount, campaign_id]
        );

        const receipt_number = generateReceiptNumber();
        await db.execute(
            'INSERT INTO receipts (donation_id, receipt_number) VALUES (?, ?)',
            [donation_id, receipt_number]
        );

        const [[user]] = await db.execute('SELECT name, email FROM users WHERE id = ?', [user_id]);
        const [[campaign]] = await db.execute('SELECT title FROM campaigns WHERE id = ?', [campaign_id]);

        const receiptHTML = generateReceiptHTML({
            receiptNumber: receipt_number,
            donorName: user.name,
            amount,
            campaignTitle: campaign.title,
            createdAt: new Date()
        });

        await sendReceipt(user.email, 'Thank You for Your Donation - Receipt', receiptHTML);


        res.status(201).json({
            message: 'Donation submitted and receipt generated successfully',
            donationId: donation_id
        });
    } catch (err) {
        console.error(" Donation submission failed:", err);
        res.status(500).json({ message: 'Failed to submit donation', error: err.message });
    }
};



exports.getUserDonations = async (req, res) => {
    const user_id = req.user.id;

    try {
        const [donations] = await db.execute(
            `SELECT d.*, c.title AS campaign_title     
             FROM donations d    
             JOIN campaigns c ON d.campaign_id = c.id    
             WHERE d.user_id = ?   
             ORDER BY d.created_at DESC`,
            [user_id]
        );
        res.json(donations);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch user donations', error: err.message });
    }
};

exports.getCampaignDonations = async (req, res) => {
    const campaign_id = req.params.id;

    try {
        const [donations] = await db.execute(
            `SELECT d.*, u.name AS donor_name   
             FROM donations d  
             JOIN users u ON d.user_id = u.id    
             WHERE d.campaign_id = ?    
             ORDER BY d.created_at DESC`,
            [campaign_id]
        );
        res.json(donations);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch campaign donations', error: err.message });
    }
};


exports.getAllDonations = async (req, res) => {
    try {
        const [donations] = await db.execute(
            `SELECT  d.id AS donation_id, d.amount,  d.created_at,  d.is_recurring,   
                     u.name AS donor_name,   u.email AS donor_email,     
                     c.title AS campaign_title,     r.receipt_number   
             FROM donations d   
             JOIN users u ON d.user_id = u.id    
             JOIN campaigns c ON d.campaign_id = c.id  
             LEFT JOIN receipts r ON r.donation_id = d.id  
             ORDER BY d.created_at DESC`
        );

        res.json(donations);
    } catch (err) {
        console.error('❌ Error in getAllDonations:', err.message);
        res.status(500).json({ message: 'Failed to fetch all donations', error: err.message });
    }
};


exports.getReceiptByDonationId = async (req, res) => {
    const donationId = req.params.donationId;

    try {
        const [[donation]] = await db.execute(
            `SELECT d.*, u.name AS donor_name, u.email AS donor_email, d.donor_address, 
                    c.title AS campaign_title, r.receipt_number 
             FROM donations d   
             JOIN users u ON d.user_id = u.id   
             JOIN campaigns c ON d.campaign_id = c.id    
             LEFT JOIN receipts r ON r.donation_id = d.id  
             WHERE d.id = ?`,
            [donationId]
        );

        if (!donation) {
            return res.status(404).json({ message: 'Donation not found' });
        }

        const receiptHTML = generateReceiptHTML({
            receiptNumber: donation.receipt_number || 'Not issued',
            donorName: donation.donor_name,
            donorEmail: donation.donor_email,
            donorAddress: donation.donor_address || 'N/A',
            amount: donation.amount,
            campaignTitle: donation.campaign_title,
            createdAt: donation.created_at
        });

        res.json({ html: receiptHTML });
    } catch (err) {
        console.error(' Error in getReceiptByDonationId:', err);
        res.status(500).json({ message: 'Failed to fetch receipt', error: err.message });
    }
};
