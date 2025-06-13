class AuthManager {
    constructor() {
        this.token = localStorage.getItem('auth_token');
        // PRODUCTION: Replace with your actual Render backend URL
        this.apiBase = 'https://readablepasswords.onrender.com/api';
        
        this.initializeElements();
        this.bindEvents();
        this.checkServerConnection();
        this.checkAuthState();
    }

    initializeElements() {
        // Auth elements
        this.authSection = document.getElementById('authSection');
        this.loginForm = document.getElementById('loginForm');
        this.registerForm = document.getElementById('registerForm');
        this.loginFormElement = document.getElementById('loginFormElement');
        this.registerFormElement = document.getElementById('registerFormElement');
    }

    bindEvents() {
        // Auth events
        const showRegisterBtn = document.getElementById('showRegister');
        const showLoginBtn = document.getElementById('showLogin');
        
        if (showRegisterBtn) {
            showRegisterBtn.addEventListener('click', () => this.showRegister());
        }
        if (showLoginBtn) {
            showLoginBtn.addEventListener('click', () => this.showLogin());
        }
        
        if (this.loginFormElement) {
            this.loginFormElement.addEventListener('submit', (e) => this.handleLogin(e));
        }
        if (this.registerFormElement) {
            this.registerFormElement.addEventListener('submit', (e) => this.handleRegister(e));
        }
    }

    async checkServerConnection() {
        try {
            const response = await fetch(`${this.apiBase}/health`);
            const data = await response.json();
            
            if (response.ok) {
                // console.log('✅ Server connection successful:', data);
            } else {
                throw new Error('Server health check failed');
            }
        } catch (error) {
            // console.error('❌ Server connection failed:', error);
            this.showConnectionError();
        }
    }

    showConnectionError() {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff4444;
            color: white;
            padding: 15px;
            border-radius: 8px;
            z-index: 1000;
            max-width: 300px;
        `;
        errorDiv.innerHTML = `
            <strong>❌ Error de Conexión</strong><br>
            No se puede conectar al servidor.<br>
            <small>Verifica que el servidor esté funcionando correctamente</small>
        `;
        document.body.appendChild(errorDiv);

        // Remove after 10 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 10000);
    }

    checkAuthState() {
        if (this.token) {
            this.validateToken();
        }
    }

    async validateToken() {
        try {
            const response = await fetch(`${this.apiBase}/passwords`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (response.ok) {
                window.location.href = 'app.html';
            } else {
                this.logout();
            }
        } catch (error) {
            // console.error('Token validation error:', error);
            this.logout();
        }
    }

    showRegister() {
        if (this.loginForm && this.registerForm) {
            this.loginForm.classList.add('hidden');
            this.registerForm.classList.remove('hidden');
        }
    }

    showLogin() {
        if (this.registerForm && this.loginForm) {
            this.registerForm.classList.add('hidden');
            this.loginForm.classList.remove('hidden');
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        try {
            const response = await fetch(`${this.apiBase}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Usuario registrado correctamente. Ahora puedes iniciar sesión.');
                this.showLogin();
                if (this.registerFormElement) {
                    this.registerFormElement.reset();
                }
            } else {
                alert(data.error || 'Error al registrar usuario');
            }
        } catch (error) {
            alert('Error de conexión con el servidor');
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const response = await fetch(`${this.apiBase}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                this.token = data.token;
                localStorage.setItem('auth_token', this.token);
                window.location.href = 'app.html';
            } else {
                alert(data.error || 'Email o contraseña incorrectos');
            }
        } catch (error) {
            alert('Error de conexión con el servidor');
        }
    }

    logout() {
        this.token = null;
        localStorage.removeItem('auth_token');
        if (this.loginFormElement) {
            this.loginFormElement.reset();
        }
        // Refresh the page to show login form
        window.location.reload();
    }
}

// Initialize the auth manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new AuthManager();
});
