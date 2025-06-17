import React, { useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';

const ResetPassword = () => {
  const [code, setCode] = useState('');
  const [verified, setVerified] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const oobCode = urlParams.get('oobCode');
    if (oobCode) {
      setCode(oobCode);
      verifyPasswordResetCode(auth, oobCode)
        .then(() => setVerified(true))
        .catch((err) => setMessage('Invalid or expired link.'));
    }
  }, []);

  const handleReset = async () => {
    try {
      await confirmPasswordReset(auth, code, newPassword);
      setMessage('✅ Password reset successful!');
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      {verified ? (
        <div>
          <input
            type="password"
            placeholder="New password"
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button onClick={handleReset}>Reset Password</button>
        </div>
      ) : (
        <p>{message || 'Verifying link...'}</p>
      )}
    </div>
  );
};

export default ResetPassword;