import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { CREATE_ACCOUNT } from './query';


const RegisterPage: React.FC = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const [createAccount] = useMutation(CREATE_ACCOUNT, {
        onCompleted: () => {
            window.location.href = '/';
        },
        onError: (error) => {
            setError(error.message);
        }
    });

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setError(null); // Reset error on new attempt

        if (name.trim() === '') {
            setError('Name is required');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        createAccount({ variables: { name, password } });
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Register</h1>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputContainer}>
                    <label htmlFor="name" style={styles.label}>Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputContainer}>
                    <label htmlFor="password" style={styles.label}>Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputContainer}>
                    <label htmlFor="confirmPassword" style={styles.label}>Confirm Password:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                {error && <p style={styles.error}>{error}</p>}
                <button type="submit" style={styles.button}>Register</button>
            </form>
        </div>
    );
};

// Styles
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f4f4f4',
    },
    title: {
        fontSize: '48px',
        fontWeight: 'bold',
        marginBottom: '20px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '25px',
        backgroundColor: '#fff',
        padding: '50px',
        borderRadius: '12px',
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
        width: '400px',
    },
    inputContainer: {
        display: 'flex',
        flexDirection: 'column' as const,
    },
    label: {
        fontSize: '20px',
        fontWeight: 'bold',
        marginBottom: '5px',
    },
    input: {
        padding: '16px',
        fontSize: '18px',
        borderRadius: '6px',
        border: '2px solid #ccc',
    },
    button: {
        padding: '18px',
        fontSize: '20px',
        borderRadius: '6px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        marginTop: '20px',
        fontWeight: 'bold',
    },
    error: {
        color: 'red',
        fontSize: '18px',
        textAlign: 'center' as const,
    },
};

export default RegisterPage;
