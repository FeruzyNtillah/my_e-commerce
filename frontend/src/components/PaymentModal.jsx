import React, { useState, useEffect } from 'react';
import { validateTanzanianPhone, formatPhoneNumber, simulatePayment, getProviderDetails } from '../utils/paymentSimulator';
import './PaymentModal.css';

const PaymentModal = ({ isOpen, onClose, onSuccess, provider, amount }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');
    const [step, setStep] = useState('input'); // input, processing, success, error

    const providerDetails = getProviderDetails(provider);

    useEffect(() => {
        if (!isOpen) {
            // Reset state when modal closes
            setPhoneNumber('');
            setIsProcessing(false);
            setError('');
            setStep('input');
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate phone number
        if (!validateTanzanianPhone(phoneNumber)) {
            setError('Please enter a valid Tanzanian phone number (e.g., 0712345678 or +255712345678)');
            return;
        }

        const formattedPhone = formatPhoneNumber(phoneNumber);

        setStep('processing');
        setIsProcessing(true);

        try {
            const result = await simulatePayment(provider, formattedPhone, amount);
            setStep('success');

            // Wait a bit before calling onSuccess
            setTimeout(() => {
                onSuccess(result);
            }, 2000);
        } catch (err) {
            setStep('error');
            setError(err.message);
            setIsProcessing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="payment-modal">
                {step === 'input' && (
                    <>
                        <div className="modal-header">
                            <h2>Complete Payment</h2>
                            <button onClick={onClose} className="close-btn">&times;</button>
                        </div>

                        <div className="modal-body">
                            <div className="provider-display">
                                <span className="provider-logo-large">{providerDetails?.logo}</span>
                                <h3>{providerDetails?.name}</h3>
                            </div>

                            <div className="amount-display">
                                <p>Amount to Pay</p>
                                <h2>TZS {Number(amount).toLocaleString()}</h2>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Phone Number *</label>
                                    <input
                                        type="tel"
                                        placeholder="0712345678 or +255712345678"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className="form-control"
                                        required
                                    />
                                    {error && <p className="error-message">{error}</p>}
                                </div>

                                <div className="instructions-box">
                                    <p><strong>Instructions:</strong></p>
                                    <p>{providerDetails?.instructions}</p>
                                    <p className="note">You will receive a prompt on your phone to authorize the payment.</p>
                                </div>

                                <button type="submit" className="btn btn-primary btn-block" disabled={isProcessing}>
                                    {isProcessing ? 'Processing...' : 'Initiate Payment'}
                                </button>
                            </form>
                        </div>
                    </>
                )}

                {step === 'processing' && (
                    <div className="modal-body text-center">
                        <div className="processing-animation">
                            <div className="spinner-large"></div>
                        </div>
                        <h3>Processing Payment...</h3>
                        <p>Please check your phone for the payment prompt</p>
                        <p className="provider-name">{providerDetails?.name}</p>
                        <p className="processing-note">
                            This may take a few seconds. Please do not close this window.
                        </p>
                    </div>
                )}

                {step === 'success' && (
                    <div className="modal-body text-center">
                        <div className="success-icon">✓</div>
                        <h3>Payment Successful!</h3>
                        <p>Your payment has been processed successfully.</p>
                        <p className="success-note">Redirecting to order confirmation...</p>
                    </div>
                )}

                {step === 'error' && (
                    <div className="modal-body text-center">
                        <div className="error-icon">✗</div>
                        <h3>Payment Failed</h3>
                        <p>{error}</p>
                        <div className="error-actions">
                            <button onClick={() => setStep('input')} className="btn btn-primary">
                                Try Again
                            </button>
                            <button onClick={onClose} className="btn btn-secondary">
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentModal;