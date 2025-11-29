import React from 'react';
import LoginPage from '../../pages/LoginPage/LoginPage';
import { useAuth } from '../../context/AuthContext';
import './LoginModal.css'

interface LoginModalProps {
    open: boolean;
    onClose: () => void;
}


const LoginModal: React.FC<LoginModalProps> = ({ open, onClose }) => {
    const { user } = useAuth();

    if (!open) return null;

    return (
        <div className="modal-overlay">
            <div className="login-modal-window">
                <button className="close-btn" onClick={onClose}>
                    &times;
                </button>
                <LoginPage onLoginSuccess={onClose} />
            </div>
        </div>
    );
};

export default LoginModal;