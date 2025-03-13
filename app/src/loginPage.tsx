import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { VERIFY_ACCOUNT } from './query'; // Assuming VERIFY_ACCOUNT is defined in a separate query file

const LoginPage: React.FC = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    // Use the VERIFY_ACCOUNT mutation hook
    const [verifyAccount] = useMutation(VERIFY_ACCOUNT, {
        onCompleted: (data) => {
            if (data.verifyAccount) {
                // Handle successful login, e.g., redirect to home page
                window.location.href = '/Home';
            } else {
                setError('Invalid credentials');
            }
        },
        onError: (error) => {
            setError(error.message);
        }
    });

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setError(null); // Reset error on new attempt

        if (name.length === 0) {
            setError('Name is required');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        // Call the verifyAccount mutation
        verifyAccount({ variables: { name, password } });
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Login</h1>
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
                {error && <p style={styles.error}>{error}</p>}
                <button type="submit" style={styles.button}>Login</button>
                <p style={styles.registerText}>
                    Don't have an account? <Link to="/register" style={styles.link}>Register here</Link>
                </p>
            </form>
        </div>
    );
};

// Updated styles for a bigger UI
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
        gap: '30px',
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
        backgroundColor: '#007bff',
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
    registerText: {
        textAlign: 'center' as const,
        fontSize: '18px',
        marginTop: '15px',
    },
    link: {
        color: '#007bff',
        textDecoration: 'none',
        fontWeight: 'bold',
    },
};

export default LoginPage;
