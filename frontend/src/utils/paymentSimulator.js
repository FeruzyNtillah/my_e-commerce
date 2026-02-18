// Simulated Tanzanian Payment Gateway

export const PAYMENT_PROVIDERS = {
    MOBILE_MONEY: {
        MPESA: {
            name: 'M-Pesa (Vodacom)',
            code: 'mpesa',
            logo: '📱',
            instructions: 'Dial *150*00# and follow the prompts'
        },
        TIGO_PESA: {
            name: 'Tigo Pesa',
            code: 'tigo_pesa',
            logo: '💳',
            instructions: 'Dial *150*01# and follow the prompts'
        },
        AIRTEL_MONEY: {
            name: 'Airtel Money',
            code: 'airtel_money',
            logo: '💰',
            instructions: 'Dial *150*60# and follow the prompts'
        },
        HALOPESA: {
            name: 'HaloPesa (Halotel)',
            code: 'halopesa',
            logo: '📞',
            instructions: 'Dial *150*88# and follow the prompts'
        }
    },
    MOBILE_BANKING: {
        CRDB: {
            name: 'CRDB SimBanking',
            code: 'crdb',
            logo: '🏦',
            instructions: 'Use CRDB SimBanking app or dial *150*55#'
        },
        NMB: {
            name: 'NMB Mobile Banking',
            code: 'nmb',
            logo: '🏛️',
            instructions: 'Use NMB Mobile app or dial *150*66#'
        },
        NBC: {
            name: 'NBC Mobile Banking',
            code: 'nbc',
            logo: '🏢',
            instructions: 'Use NBC Mobile app or USSD'
        }
    }
};

// Simulate payment processing
export const simulatePayment = (provider, phoneNumber, amount) => {
    return new Promise((resolve, reject) => {
        // Simulate network delay
        setTimeout(() => {
            // 90% success rate simulation
            const isSuccess = Math.random() > 0.1;

            if (isSuccess) {
                resolve({
                    success: true,
                    transactionId: generateTransactionId(provider),
                    provider: provider,
                    phoneNumber: phoneNumber,
                    amount: amount,
                    timestamp: new Date().toISOString(),
                    message: 'Payment processed successfully'
                });
            } else {
                reject({
                    success: false,
                    message: 'Payment failed. Please try again or use a different payment method.',
                    errorCode: 'INSUFFICIENT_BALANCE'
                });
            }
        }, 3000); // 3 second delay to simulate real payment processing
    });
};

// Generate realistic transaction ID
const generateTransactionId = (provider) => {
    const prefix = provider.toUpperCase().substring(0, 3);
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `${prefix}${timestamp}${random}`;
};

// Validate Tanzanian phone number
export const validateTanzanianPhone = (phoneNumber) => {
    // Tanzanian phone numbers: +255 followed by 9 digits
    // Or 0 followed by 9 digits
    const regex = /^(\+255|0)[67]\d{8}$/;
    return regex.test(phoneNumber);
};

// Format phone number to standard format
export const formatPhoneNumber = (phoneNumber) => {
    // Remove spaces and dashes
    let formatted = phoneNumber.replace(/[\s-]/g, '');

    // Convert to international format
    if (formatted.startsWith('0')) {
        formatted = '+255' + formatted.substring(1);
    }

    return formatted;
};

// Get payment provider details
export const getProviderDetails = (providerCode) => {
    const allProviders = { ...PAYMENT_PROVIDERS.MOBILE_MONEY, ...PAYMENT_PROVIDERS.MOBILE_BANKING };

    for (const provider of Object.values(allProviders)) {
        if (provider.code === providerCode) {
            return provider;
        }
    }

    return null;
};