const db = require('../../config/db');
const bcrypt = require('bcrypt');

const login = (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        
        db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }

            if (results.length === 0) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            const user = results[0];

            const isPasswordValid = bcrypt.compareSync(password, user.password);

            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            return res.json({ 
                message: 'Login successful',
                user: {
                    id: user.id,
                    username: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { login };