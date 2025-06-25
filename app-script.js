/**
 * Generador de Contraseñas Legibles en Español
 * 
 * Esta clase implementa un sistema completo para generar contraseñas seguras
 * pero pronunciables en español, con análisis de fortaleza y gestión de usuarios.
 * 
 * Características principales:
 * - Generación fonéticamente correcta en español
 * - Análisis detallado de fortaleza de contraseñas
 * - Autenticación JWT y persistencia en servidor
 * - Interfaz educativa interactiva
 */
class ReadablePasswordManager {
    constructor() {
        // Configuración de autenticación y API
        this.token = localStorage.getItem('auth_token'); // Token JWT del usuario
        this.apiBase = 'https://readablepasswords.onrender.com/api'; // URL del backend (mantener igual)
        this.currentUser = null; // Información del usuario actual
        this.savedPasswords = []; // Array de contraseñas guardadas
        
        // Configuración lingüística española avanzada
        this.spanishSyllables = {
            // Consonantes y vocales básicas del español
            consonants: ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z'],
            vowels: ['a', 'e', 'i', 'o', 'u'],
            
            // Combinaciones consonánticas comunes en español (grupos consonánticos)
            commonCombos: ['br', 'cr', 'dr', 'fr', 'gr', 'pr', 'tr', 'bl', 'cl', 'fl', 'gl', 'pl', 'ch', 'll', 'rr', 'ñ'],
            
            // Sílabas complejas para generación avanzada de palabras más naturales
            complexSyllables: {
                start: ['bra', 'bre', 'bri', 'bro', 'bru', 'cla', 'cle', 'cli', 'clo', 'clu', 'cra', 'cre', 'cri', 'cro', 'cru',
                       'dra', 'dre', 'dri', 'dro', 'dru', 'fra', 'fre', 'fri', 'fro', 'fru', 'gra', 'gre', 'gri', 'gro', 'gru',
                       'pla', 'ple', 'pli', 'plo', 'plu', 'pra', 'pre', 'pri', 'pro', 'pru', 'tra', 'tre', 'tri', 'tro', 'tru'],
                middle: ['bla', 'ble', 'bli', 'blo', 'blu', 'fla', 'fle', 'fli', 'flo', 'flu', 'gla', 'gle', 'gli', 'glo', 'glu'],
                end: ['ción', 'sión', 'tivo', 'tiva', 'mente', 'able', 'ible'] // Terminaciones típicas del español
            },
            
            // Terminaciones gramaticales por tipo de palabra (morfología española)
            wordEndings: {
                verbs: ['ar', 'er', 'ir', 'ando', 'iendo', 'ado', 'ido'], // Verbos y participios
                nouns: ['o', 'a', 'e', 'or', 'ora', 'ero', 'era', 'ista'], // Sustantivos
                adjectives: ['oso', 'osa', 'ivo', 'iva', 'able', 'ible', 'al', 'ante'], // Adjetivos
                adverbs: ['mente'] // Adverbios
            },
            
            // Reglas lingüísticas del español
            naturalDoubles: ['ll', 'rr', 'cc', 'nn', 'ss'], // Consonantes dobles permitidas
            invalidCombinations: [
                // Combinaciones que NO existen en español (imposibles fonéticamente)
                'cv', 'kv', 'pv', 'bv', 'tv', 'dv', 'gv', 'fv', 'jv', 'lv', 'mv', 'nv', 'rv', 'sv', 'xv', 'zv',
                // Otras combinaciones raras o imposibles
                'kb', 'kg', 'kp', 'kt', 'kf', 'kj', 'km', 'kn', 'ks', 'kx', 'kz',
                'pb', 'pg', 'pk', 'pt', 'pf', 'pj', 'pm', 'pn', 'ps', 'px', 'pz',
                'gb', 'gp', 'gk', 'gt', 'gf', 'gj', 'gm', 'gx', 'gz',
                'tb', 'tg', 'tk', 'tp', 'tf', 'tj', 'tm', 'tx', 'tz',
                'db', 'dg', 'dk', 'dp', 'df', 'dj', 'dm', 'dx', 'dz',
                'fb', 'fg', 'fk', 'fp', 'ft', 'fj', 'fm', 'fn', 'fx', 'fz',
                'jb', 'jg', 'jk', 'jp', 'jt', 'jf', 'jm', 'jn', 'js', 'jx', 'jz',
                'vb', 'vg', 'vk', 'vp', 'vt', 'vf', 'vj', 'vm', 'vn', 'vs', 'vx', 'vz',
                'wb', 'wg', 'wk', 'wp', 'wt', 'wf', 'wj', 'wm', 'wn', 'ws', 'wx', 'wz',
                'xb', 'xg', 'xk', 'xp', 'xt', 'xf', 'xj', 'xm', 'xn', 'xs', 'xx', 'xz',
                'zb', 'zg', 'zk', 'zp', 'zt', 'zf', 'zj', 'zm', 'zn', 'zs', 'zx', 'zz'
            ],
            
            // Grupos consonánticos válidos en español
            validClusters: ['br', 'cr', 'dr', 'fr', 'gr', 'kr', 'pr', 'tr', 'bl', 'cl', 'fl', 'gl', 'kl', 'pl'],
            
            // Consonantes que pueden aparecer antes de 'r' o 'l'
            canPrecedeR: ['b', 'c', 'd', 'f', 'g', 'k', 'p', 't'],
            canPrecedeL: ['b', 'c', 'f', 'g', 'k', 'p'],
            
            // Consonantes que raramente inician palabras en español
            rareInitial: ['k', 'w', 'x'],
            
            // Prefijos y sufijos comunes del español para palabras más naturales
            prefixes: ['pre', 'pro', 'sub', 'des', 'con', 'ex', 'in', 'un', 're'],
            suffixes: ['tion', 'sion', 'ado', 'ido', 'ero', 'era', 'oso', 'osa'],

            // Patrones rítmicos para mejor memorabilidad (C=Consonante, V=Vocal)
            rhythmicPatterns: [
                'CVCV', 'CVCVC', 'CVCVCV', 'CCVCV', 'CVCVC', 'CVCCV'
            ],
            
            // Raíces de palabras españolas comunes para mayor naturalidad
            wordRoots: ['amor', 'vida', 'casa', 'agua', 'luz', 'sol', 'mar', 'voz', 'paz', 'flor', 'pan', 'sal', 'rey', 'ley']
        };

        // Reemplazos para leet speak amigable con el español
        this.characterReplacements = {
            'a': ['4', '@'], 'e': ['3'], 'i': ['1', '!'], 'o': ['0'], 'u': ['v'],
            's': ['$', '5'], 't': ['7'], 'l': ['1'], 'g': ['6', '9'], 'b': ['8'], 'z': ['2']
        };

        // Símbolos permitidos para contraseñas
        this.symbols = ['!', '@', '#', '$', '%', '&', '*', '+', '=', '?'];
        
        // Inicialización de la aplicación
        this.initializeElements(); // Buscar elementos DOM
        this.bindEvents(); // Asignar eventos
        this.checkAuth(); // Verificar autenticación
    }

    /**
     * Inicializa las referencias a elementos DOM
     * Busca todos los elementos necesarios para la interfaz
     */
    initializeElements() {
        // Elementos de usuario
        this.usernameSpan = document.getElementById('username'); // Mostrar nombre de usuario
        this.logoutBtn = document.getElementById('logoutBtn'); // Botón de cerrar sesión
        
        // Elementos del generador de contraseñas
        this.passwordLabel = document.getElementById('passwordLabel'); // Campo etiqueta
        this.passwordLength = document.getElementById('passwordLength'); // Slider de longitud
        this.lengthValue = document.getElementById('lengthValue'); // Valor actual de longitud
        this.includeUppercase = document.getElementById('includeUppercase'); // Checkbox mayúsculas
        this.includeLowercase = document.getElementById('includeLowercase'); // Checkbox minúsculas
        this.includeNumbers = document.getElementById('includeNumbers'); // Checkbox números
        this.includeSymbols = document.getElementById('includeSymbols'); // Checkbox símbolos
        this.generateBtn = document.getElementById('generateBtn'); // Botón generar
        
        // Elementos de resultado
        this.passwordResult = document.getElementById('passwordResult'); // Contenedor resultado
        this.generatedPassword = document.getElementById('generatedPassword'); // Contraseña generada
        this.syllableCount = document.getElementById('syllableCount'); // Contador de sílabas
        this.pronounceable = document.getElementById('pronounceable'); // Indicador pronunciable
        this.passwordLengthDisplay = document.getElementById('passwordLengthDisplay'); // Longitud mostrada
        this.memorability = document.getElementById('memorability'); // Nivel de memorabilidad
        this.strengthFill = document.getElementById('strengthFill'); // Barra de fortaleza
        this.strengthText = document.getElementById('strengthText'); // Texto de fortaleza
        this.copyPassword = document.getElementById('copyPassword'); // Botón copiar
        this.savePassword = document.getElementById('savePassword'); // Botón guardar
        
        // Elementos de contraseñas guardadas
        this.refreshPasswords = document.getElementById('refreshPasswords'); // Botón actualizar
        this.searchInput = document.getElementById('searchInput'); // Campo de búsqueda
        this.passwordsList = document.getElementById('passwordsList'); // Lista de contraseñas
        this.passwordItemTemplate = document.getElementById('passwordItemTemplate'); // Plantilla de elemento
        
        // Sistema de notificaciones
        this.toast = document.getElementById('toast'); // Contenedor de toast
        this.toastMessage = document.getElementById('toastMessage'); // Mensaje de toast

        // Opciones avanzadas
        this.useComplexSyllables = document.getElementById('useComplexSyllables'); // Usar sílabas complejas
        this.capitalizeFirst = document.getElementById('capitalizeFirst'); // Capitalizar primera letra
        this.addEndings = document.getElementById('addEndings'); // Añadir terminaciones
        this.useRhythm = document.getElementById('useRhythm'); // Usar patrones rítmicos

        // Sección educativa
        this.toggleEducationBtn = document.getElementById('toggleEducation'); // Botón mostrar/ocultar educación
        this.educationalContent = document.getElementById('educationalContent'); // Contenido educativo
        
        // Log de elementos encontrados para depuración
        console.log('🔍 Elements initialized:', {
            passwordsList: !!this.passwordsList,
            passwordItemTemplate: !!this.passwordItemTemplate,
            usernameSpan: !!this.usernameSpan,
            generateBtn: !!this.generateBtn
        });
    }

    /**
     * Asigna eventos a los elementos de la interfaz
     */
    bindEvents() {
        // Eventos de autenticación
        this.logoutBtn.addEventListener('click', () => this.logout());
        
        // Eventos del generador
        this.passwordLength.addEventListener('input', () => this.updateLengthDisplay());
        this.generateBtn.addEventListener('click', () => this.generatePassword());
        this.copyPassword.addEventListener('click', () => this.copyToClipboard(this.generatedPassword.textContent, 'Contraseña copiada'));
        this.savePassword.addEventListener('click', () => this.saveCurrentPassword());
        
        // Eventos de contraseñas guardadas
        this.refreshPasswords.addEventListener('click', () => this.loadSavedPasswords());
        this.searchInput.addEventListener('input', () => this.filterPasswords());

        // Eventos de la sección educativa
        if (this.toggleEducationBtn) {
            this.toggleEducationBtn.addEventListener('click', () => this.toggleEducationalSection());
        }
    }

    /**
     * Verifica la autenticación del usuario mediante JWT
     * Decodifica el token y valida con el servidor
     */
    async checkAuth() {
        // Si no hay token, redirigir al login
        if (!this.token) {
            console.log('❌ No token found, redirecting to login');
            this.redirectToLogin();
            return;
        }

        try {
            console.log('🔐 Checking authentication...');
            
            // Hacer petición al servidor para validar el token
            const response = await fetch(`${this.apiBase}/passwords`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.token}`, // Enviar token en header
                    'Content-Type': 'application/json'
                }
            });

            console.log('📊 Auth check status:', response.status);

            if (response.ok) {
                // Decodificar información del usuario desde el JWT de forma segura
                try {
                    // Decodificar payload del JWT (parte central en base64)
                    const payload = JSON.parse(atob(this.token.split('.')[1]));
                    this.currentUser = {
                        id: payload.userId,
                        username: payload.username,
                        email: payload.email
                    };
                    
                    // Mostrar nombre de usuario en la interfaz
                    if (this.usernameSpan) {
                        this.usernameSpan.textContent = this.currentUser.username;
                    }
                    
                    console.log('✅ User authenticated:', this.currentUser.username);
                    await this.loadSavedPasswords(); // Cargar contraseñas del usuario
                } catch (tokenError) {
                    console.error('❌ Error decoding token:', tokenError);
                    this.logout(); // Token corrupto, cerrar sesión
                }
            } else {
                console.log('❌ Authentication failed, logging out');
                this.logout(); // Token inválido, cerrar sesión
            }
        } catch (error) {
            console.error('❌ Auth check error:', error);
            // Error de conexión, permitir trabajar sin conexión
            this.showToast('Error de conexión con el servidor. Trabajando sin conexión.', 'warning');
        }
    }

    /**
     * Redirige al usuario a la página de login
     */
    redirectToLogin() {
        try {
            window.location.href = 'index.html';
        } catch (error) {
            console.error('❌ Error redirecting to login:', error);
        }
    }

    /**
     * Carga las contraseñas guardadas del usuario desde el servidor
     */
    async loadSavedPasswords() {
        try {
            console.log('🔄 Loading saved passwords...');
            
            // Petición GET para obtener contraseñas del usuario autenticado
            const response = await fetch(`${this.apiBase}/passwords`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('📊 Response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                this.savedPasswords = data; // Almacenar contraseñas en memoria
                console.log('✅ Contraseñas cargadas:', this.savedPasswords.length);
                console.log('📄 Datos recibidos:', this.savedPasswords);
                
                this.displaySavedPasswords(); // Mostrar en la interfaz
            } else {
                const errorText = await response.text();
                console.error('❌ Load error:', response.status, errorText);
                this.showToast(`Error del servidor: ${response.status}`, 'error');
                this.displaySavedPasswords([]); // Mostrar lista vacía
            }
        } catch (error) {
            console.error('❌ Network error loading passwords:', error);
            this.showToast('Error de conexión con el servidor', 'error');
            this.displaySavedPasswords([]); // Mostrar lista vacía
        }
    }

    /**
     * Muestra las contraseñas guardadas en la interfaz
     * @param {Array} passwords - Array de contraseñas a mostrar
     */
    displaySavedPasswords(passwords = this.savedPasswords) {
        console.log('🎨 Displaying passwords:', passwords.length);
        
        // Verificar que el elemento existe
        if (!this.passwordsList) {
            console.error('❌ passwordsList element not found');
            return;
        }

        // Limpiar lista actual
        this.passwordsList.innerHTML = '';

        // Mostrar mensaje si no hay contraseñas
        if (passwords.length === 0) {
            this.passwordsList.innerHTML = '<div class="loading">No hay contraseñas guardadas</div>';
            return;
        }

        // Crear elemento para cada contraseña
        passwords.forEach((password, index) => {
            try {
                console.log(`🎯 Creating item ${index}:`, password.label);
                const item = this.createPasswordItem(password);
                this.passwordsList.appendChild(item);
            } catch (error) {
                console.error(`❌ Error creating password item ${index}:`, error);
            }
        });
    }

    /**
     * Crea un elemento DOM para una contraseña guardada
     * @param {Object} password - Objeto con datos de la contraseña
     * @returns {HTMLElement} - Elemento DOM del item de contraseña
     */
    createPasswordItem(password) {
        // Verificar que la plantilla existe
        if (!this.passwordItemTemplate) {
            console.error('❌ passwordItemTemplate not found');
            return document.createElement('div');
        }

        // Clonar la plantilla
        const template = this.passwordItemTemplate.content.cloneNode(true);
        const item = template.querySelector('.password-item');
        
        // Rellenar datos de forma segura
        const labelElement = item.querySelector('.password-label');
        const valueElement = item.querySelector('.field-value');
        const dateElement = item.querySelector('.created-date');
        
        if (labelElement) labelElement.textContent = password.label || 'Sin etiqueta';
        if (valueElement) valueElement.textContent = '••••••••'; // Ocultar contraseña inicialmente
        if (dateElement) dateElement.textContent = new Date(password.createdAt).toLocaleDateString();
        
        // Configurar badge de fortaleza con colores
        const strengthBadge = item.querySelector('.strength-badge');
        if (strengthBadge) {
            const score = password.strengthScore || 0;
            if (score >= 80) {
                strengthBadge.textContent = 'Muy fuerte';
                strengthBadge.style.background = '#4caf50'; // Verde
                strengthBadge.style.color = 'white';
            } else if (score >= 60) {
                strengthBadge.textContent = 'Fuerte';
                strengthBadge.style.background = '#ff9800'; // Naranja
                strengthBadge.style.color = 'white';
            } else if (score >= 40) {
                strengthBadge.textContent = 'Media';
                strengthBadge.style.background = '#ffeb3b'; // Amarillo
                strengthBadge.style.color = 'black';
            } else {
                strengthBadge.textContent = 'Débil';
                strengthBadge.style.background = '#f44336'; // Rojo
                strengthBadge.style.color = 'white';
            }
        }

        // Asignar eventos de forma segura
        const copyBtn = item.querySelector('.copy-password-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                this.copyToClipboard(password.password, 'Contraseña copiada');
            });
        }
        
        // Evento para mostrar/ocultar contraseña
        const toggleBtn = item.querySelector('.toggle-visibility');
        if (toggleBtn && valueElement) {
            toggleBtn.addEventListener('click', (e) => {
                if (valueElement.textContent === '••••••••') {
                    valueElement.textContent = password.password; // Mostrar contraseña real
                    e.target.textContent = '🙈'; // Cambiar icono
                } else {
                    valueElement.textContent = '••••••••'; // Ocultar contraseña
                    e.target.textContent = '👁️'; // Cambiar icono
                }
            });
        }
        
        // Evento para eliminar contraseña
        const deleteBtn = item.querySelector('.delete-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                this.deletePassword(password.id);
            });
        }

        return item;
    }

    /**
     * Filtra las contraseñas basado en el texto de búsqueda
     */
    filterPasswords() {
        const query = this.searchInput?.value?.toLowerCase() || '';
        // Filtrar por etiqueta que contenga el texto de búsqueda
        const filtered = this.savedPasswords.filter(password =>
            password.label.toLowerCase().includes(query)
        );
        this.displaySavedPasswords(filtered);
    }

    /**
     * Actualiza el display de la longitud de contraseña
     */
    updateLengthDisplay() {
        this.lengthValue.textContent = this.passwordLength.value;
    }

    /**
     * Muestra la contraseña generada y su análisis en la interfaz
     * @param {string} password - Contraseña generada
     * @param {number} strengthScore - Puntuación de fortaleza (0-100)
     * @param {Object} phoneticAnalysis - Análisis fonético de la contraseña
     */
    displayGeneratedPassword(password, strengthScore, phoneticAnalysis) {
        // Verificar elementos requeridos
        if (!this.generatedPassword || !this.passwordResult) {
            console.error('❌ Required DOM elements not found for password display');
            return;
        }

        try {
            // Mostrar la contraseña
            this.generatedPassword.textContent = password;
            this.passwordResult.classList.remove('hidden');

            // Actualizar análisis fonético de forma segura
            if (this.syllableCount) {
                this.syllableCount.textContent = phoneticAnalysis.syllables || 0;
            }
            
            if (this.pronounceable) {
                this.pronounceable.textContent = phoneticAnalysis.pronounceable ? 'Sí' : 'No';
                this.pronounceable.className = phoneticAnalysis.pronounceable ? 'pronounceable-yes' : 'pronounceable-no';
            }
            
            if (this.passwordLengthDisplay) {
                this.passwordLengthDisplay.textContent = phoneticAnalysis.length || password.length;
            }
            
            if (this.memorability) {
                this.memorability.textContent = phoneticAnalysis.memorability || 'Media';
            }

            // Actualizar indicador de fortaleza
            this.updateStrengthIndicator(strengthScore);
            
        } catch (error) {
            console.error('❌ Error displaying generated password:', error);
        }
    }

    /**
     * Actualiza el indicador visual de fortaleza de la contraseña
     * @param {number} score - Puntuación de fortaleza (0-100)
     */
    updateStrengthIndicator(score) {
        if (!this.strengthFill || !this.strengthText) {
            console.warn('⚠️ Strength indicator elements not found');
            return;
        }

        try {
            // Asegurar que el porcentaje esté entre 0 y 100
            const percentage = Math.min(Math.max(score, 0), 100);
            this.strengthFill.style.width = `${percentage}%`;
            
            let strengthLabel = '';
            let strengthClass = '';
            
            // Clasificar fortaleza y asignar colores
            if (score >= 80) {
                strengthLabel = 'Muy Fuerte';
                strengthClass = 'very-strong';
                this.strengthFill.style.backgroundColor = '#4caf50'; // Verde fuerte
            } else if (score >= 60) {
                strengthLabel = 'Fuerte';
                strengthClass = 'strong';
                this.strengthFill.style.backgroundColor = '#8bc34a'; // Verde claro
            } else if (score >= 40) {
                strengthLabel = 'Media';
                strengthClass = 'medium';
                this.strengthFill.style.backgroundColor = '#ff9800'; // Naranja
            } else if (score >= 20) {
                strengthLabel = 'Débil';
                strengthClass = 'weak';
                this.strengthFill.style.backgroundColor = '#ff5722'; // Rojo naranja
            } else {
                strengthLabel = 'Muy Débil';
                strengthClass = 'very-weak';
                this.strengthFill.style.backgroundColor = '#f44336'; // Rojo
            }
            
            // Actualizar texto y clase CSS
            this.strengthText.textContent = `${strengthLabel} (${Math.round(percentage)}%)`;
            this.strengthText.className = `strength-text ${strengthClass}`;
            
        } catch (error) {
            console.error('❌ Error updating strength indicator:', error);
        }
    }

    /**
     * Método principal para generar una contraseña
     * Coordina todo el proceso de generación
     */
    async generatePassword() {
        try {
            // Obtener longitud deseada (con valor por defecto)
            const length = parseInt(this.passwordLength?.value || 12);
            
            // Validar rango de longitud
            if (length < 4 || length > 50) {
                this.showToast('La longitud debe estar entre 4 y 50 caracteres', 'error');
                return;
            }

            // Recopilar opciones del usuario
            const options = {
                includeUppercase: this.includeUppercase?.checked || false,
                includeLowercase: this.includeLowercase?.checked || true,
                includeNumbers: this.includeNumbers?.checked || true,
                includeSymbols: this.includeSymbols?.checked || false,
                useComplexSyllables: this.useComplexSyllables?.checked || false,
                capitalizeFirst: this.capitalizeFirst?.checked || true,
                addEndings: this.addEndings?.checked || false,
                useRhythm: this.useRhythm?.checked || false
            };

            // Validar que al menos una opción esté seleccionada
            if (!options.includeUppercase && !options.includeLowercase && !options.includeNumbers && !options.includeSymbols) {
                this.showToast('Debe seleccionar al menos una opción de caracteres', 'error');
                return;
            }

            // Calcular espacio para caracteres de seguridad
            const securityCharsNeeded = (options.includeNumbers ? 2 : 0) + (options.includeSymbols ? 1 : 0);
            const baseWordLength = Math.max(4, length - securityCharsNeeded);
            
            // Generar palabra española con opciones avanzadas
            let readableWord = this.generateSpanishWord(baseWordLength);
            
            // Aplicar capitalización según preferencia del usuario
            if (options.includeUppercase) {
                if (options.capitalizeFirst) {
                    // Solo capitalizar primera letra para mejor legibilidad
                    readableWord = readableWord.charAt(0).toUpperCase() + readableWord.slice(1);
                } else {
                    // Capitalización aleatoria para mayor seguridad
                    readableWord = this.applyRandomCapitalization(readableWord);
                }
            }

            // Aplicar leet speak selectivo (30% de probabilidad)
            if (Math.random() < 0.3) {
                readableWord = this.applyReadableLeetSpeak(readableWord, 1);
            }

            // Construir contraseña final
            let password = readableWord;

            // Añadir caracteres de seguridad
            if (options.includeNumbers) {
                const numbers = this.generateMeaningfulNumbers();
                password = this.insertSecurityChars(password, numbers, length);
            }

            if (options.includeSymbols) {
                const symbol = this.getRandomElement(['!', '@', '#', '$', '%', '&', '*']);
                password = this.insertSecurityChars(password, symbol, length);
            }

            // Ajustar a longitud exacta
            password = this.adjustToExactLength(password, length, readableWord);

            // Calcular análisis de fortaleza y características fonéticas
            const strengthScore = this.calculateStrength(password);
            const phoneticAnalysis = this.analyzePhoneticCharacteristics(password, readableWord);

            // Mostrar resultado en la interfaz
            this.displayGeneratedPassword(password, strengthScore, phoneticAnalysis);
            
        } catch (error) {
            console.error('❌ Error generating password:', error);
            this.showToast('Error al generar la contraseña', 'error');
        }
    }

    /**
     * Genera una palabra española legible usando diferentes algoritmos
     * @param {number} targetLength - Longitud objetivo de la palabra
     * @returns {string} - Palabra generada
     */
    generateSpanishWord(targetLength) {
        // Obtener opciones de generación
        const options = {
            useComplexSyllables: this.useComplexSyllables?.checked || false,
            capitalizeFirst: this.capitalizeFirst?.checked || true,
            addEndings: this.addEndings?.checked || false,
            useRhythm: this.useRhythm?.checked || false
        };

        let word = '';
        
        // Seleccionar algoritmo de generación
        if (options.useRhythm && targetLength >= 6) {
            // Usar patrones rítmicos para palabras largas
            word = this.generateRhythmicWord(targetLength, options);
        } else if (options.useComplexSyllables && Math.random() < 0.4) {
            // Usar sílabas complejas (40% probabilidad)
            word = this.generateComplexSyllableWord(targetLength, options);
        } else {
            // Generación tradicional (método por defecto)
            word = this.generateTraditionalWord(targetLength, options);
        }

        // Añadir terminaciones si está habilitado y la palabra es suficientemente larga
        if (options.addEndings && word.length < targetLength && word.length >= 4) {
            word = this.addSpanishEnding(word, targetLength);
        }

        // Asegurar longitud correcta truncando si es necesario
        return word.substring(0, targetLength);
    }

    /**
     * Genera palabra usando patrones rítmicos (CVCV, etc.)
     * @param {number} targetLength - Longitud objetivo
     * @param {Object} options - Opciones de generación
     * @returns {string} - Palabra generada
     */
    generateRhythmicWord(targetLength, options) {
        // Seleccionar patrón rítmico aleatorio
        const pattern = this.getRandomElement(this.spanishSyllables.rhythmicPatterns);
        let word = '';
        
        // Construir palabra siguiendo el patrón
        for (let i = 0; i < pattern.length && word.length < targetLength; i++) {
            const char = pattern[i];
            if (char === 'C') {
                // Añadir consonante (posiblemente compleja si está habilitado)
                if (options.useComplexSyllables && Math.random() < 0.3 && word.length < targetLength - 2) {
                    const complexStart = this.getRandomElement(this.spanishSyllables.complexSyllables.start);
                    if (word.length + complexStart.length <= targetLength) {
                        word += complexStart;
                        i++; // Saltar siguiente carácter porque la sílaba compleja incluye vocal
                        continue;
                    }
                }
                word += this.getSafeConsonant(word);
            } else if (char === 'V') {
                word += this.getSafeVowel(word);
            }
        }
        
        return word;
    }

    /**
     * Genera palabra usando sílabas complejas predefinidas
     * @param {number} targetLength - Longitud objetivo
     * @param {Object} options - Opciones de generación
     * @returns {string} - Palabra generada
     */
    generateComplexSyllableWord(targetLength, options) {
        let word = '';
        const maxAttempts = 50;
        let attempts = 0;

        // Empezar con una sílaba compleja (70% probabilidad)
        if (Math.random() < 0.7) {
            const startSyllable = this.getRandomElement(this.spanishSyllables.complexSyllables.start);
            if (startSyllable.length <= targetLength) {
                word = startSyllable;
            }
        }

        // Continuar construyendo con lógica regular
        while (word.length < targetLength && attempts < maxAttempts) {
            attempts++;
            
            if (word.length === 0) {
                // Empezar con consonante si no hay palabra
                word += this.getRandomElement(this.spanishSyllables.consonants);
            } else {
                // Ocasionalmente añadir sílabas complejas del medio
                if (Math.random() < 0.3 && word.length < targetLength - 2) {
                    const middleSyllable = this.getRandomElement(this.spanishSyllables.complexSyllables.middle);
                    if (word.length + middleSyllable.length <= targetLength) {
                        word += middleSyllable;
                        continue;
                    }
                }
                
                // Usar lógica de caracteres válidos
                const addition = this.getNextValidCharacters(word, targetLength);
                if (addition) {
                    word += addition;
                } else {
                    word += this.getSafeVowel(word);
                }
            }
        }

        return word;
    }

    /**
     * Genera palabra usando el método tradicional letra por letra
     * @param {number} targetLength - Longitud objetivo
     * @param {Object} options - Opciones de generación
     * @returns {string} - Palabra generada
     */
    generateTraditionalWord(targetLength, options) {
        let word = '';
        const maxAttempts = 100;
        let attempts = 0;

        // Ocasionalmente empezar con una raíz de palabra para mayor naturalidad
        if (targetLength >= 8 && Math.random() < 0.3) {
            const root = this.getRandomElement(this.spanishSyllables.wordRoots);
            if (root.length < targetLength) {
                word = root;
            }
        }

        // Construir palabra letra por letra
        while (word.length < targetLength && attempts < maxAttempts) {
            attempts++;
            
            if (word.length === 0) {
                // Primer carácter: preferir consonantes comunes
                if (Math.random() < 0.75) {
                    const initialConsonants = this.spanishSyllables.consonants.filter(c => 
                        !this.spanishSyllables.rareInitial.includes(c)
                    );
                    word += this.getRandomElement(initialConsonants);
                } else {
                    word += this.getRandomElement(this.spanishSyllables.vowels);
                }
            } else {
                // Caracteres siguientes: usar reglas fonéticas
                const addition = this.getNextValidCharacters(word, targetLength);
                if (addition) {
                    word += addition;
                } else {
                    word += this.getSafeVowel(word); // Fallback seguro
                }
            }
        }

        return word;
    }

    /**
     * Añade terminaciones españolas típicas a una palabra
     * @param {string} word - Palabra base
     * @param {number} targetLength - Longitud objetivo
     * @returns {string} - Palabra con terminación
     */
    addSpanishEnding(word, targetLength) {
        const availableSpace = targetLength - word.length;
        if (availableSpace < 2) return word; // No hay espacio suficiente

        // Seleccionar tipo de terminación aleatoriamente
        const endingTypes = Object.keys(this.spanishSyllables.wordEndings);
        const selectedType = this.getRandomElement(endingTypes);
        const endings = this.spanishSyllables.wordEndings[selectedType];
        
        // Filtrar terminaciones que caben en el espacio disponible
        const validEndings = endings.filter(ending => ending.length <= availableSpace);
        if (validEndings.length === 0) return word;

        const selectedEnding = this.getRandomElement(validEndings);
        
        // Evitar hiatos: si la terminación empieza con vocal y la palabra termina con vocal
        const endingStartsWithVowel = this.spanishSyllables.vowels.includes(selectedEnding[0]);
        const wordEndsWithVowel = this.spanishSyllables.vowels.includes(word[word.length - 1]);
        
        if (endingStartsWithVowel && wordEndsWithVowel) {
            word = word.slice(0, -1); // Eliminar última vocal para evitar repetición
        }

        return word + selectedEnding;
    }

    /**
     * Aplica capitalización aleatoria pero legible
     * @param {string} word - Palabra a capitalizar
     * @returns {string} - Palabra con capitalización aplicada
     */
    applyRandomCapitalization(word) {
        let result = word.toLowerCase();
        const positions = [];
        
        // Siempre capitalizar primera letra
        positions.push(0);
        
        // Añadir 1-2 posiciones adicionales aleatorias
        const additionalCaps = Math.floor(Math.random() * 2) + 1;
        for (let i = 0; i < additionalCaps && positions.length < Math.min(3, result.length); i++) {
            let pos;
            do {
                pos = Math.floor(Math.random() * result.length);
            } while (positions.includes(pos)); // Evitar duplicados
            positions.push(pos);
        }
        
        // Aplicar capitalización en las posiciones seleccionadas
        positions.forEach(pos => {
            if (pos < result.length) {
                result = result.substring(0, pos) + result.charAt(pos).toUpperCase() + result.substring(pos + 1);
            }
        });
        
        return result;
    }

    /**
     * Aplica leet speak legible a una palabra
     * @param {string} word - Palabra a transformar
     * @param {number} maxReplacements - Máximo número de reemplazos
     * @returns {string} - Palabra con leet speak aplicado
     */
    applyReadableLeetSpeak(word, maxReplacements) {
        let result = word.toLowerCase();
        let replacements = 0;
        
        // Reemplazos legibles específicos para español
        const readableReplacements = {
            'a': ['4'],
            'e': ['3'],
            'o': ['0'],
            's': ['5']
        };
        
        for (let i = 0; i < result.length && replacements < maxReplacements; i++) {
            const char = result[i];
            if (readableReplacements[char] && Math.random() < 0.4) {
                const nextChar = result[i + 1];
                const prevChar = result[i - 1];
                
                // Evitar reemplazar consonantes dobles naturales
                if ((char === nextChar && this.spanishSyllables.naturalDoubles.includes(char + nextChar)) ||
                    (char === prevChar && this.spanishSyllables.naturalDoubles.includes(prevChar + char))) {
                    continue;
                }
                
                const replacement = readableReplacements[char][0];
                result = result.substring(0, i) + replacement + result.substring(i + 1);
                replacements++;
            }
        }
        
        return result;
    }

    /**
     * Inserta caracteres de seguridad en posiciones estratégicas de la contraseña
     * @param {string} basePassword - Contraseña base
     * @param {string} securityChars - Caracteres de seguridad a insertar
     * @param {number} targetLength - Longitud objetivo
     * @returns {string} - Contraseña con caracteres de seguridad insertados
     */
    insertSecurityChars(basePassword, securityChars, targetLength) {
        // Verificar que hay espacio para los caracteres de seguridad
        if (basePassword.length + securityChars.length > targetLength) {
            return basePassword;
        }

        // Posiciones posibles para insertar (final, 60%, 80% de la palabra)
        const insertPositions = [
            basePassword.length, // Al final (más común)
            Math.floor(basePassword.length * 0.6),
            Math.floor(basePassword.length * 0.8),
        ];

        let bestPosition = insertPositions[0];
        
        // Seleccionar posición (70% probabilidad al final para mejor legibilidad)
        if (basePassword.length + securityChars.length <= targetLength) {
            if (Math.random() < 0.7) {
                bestPosition = basePassword.length; // Al final
            } else {
                bestPosition = this.getRandomElement(insertPositions.slice(1));
            }
        }

        return basePassword.substring(0, bestPosition) + securityChars + basePassword.substring(bestPosition);
    }

    /**
     * Ajusta la contraseña a la longitud exacta requerida
     * @param {string} password - Contraseña actual
     * @param {number} targetLength - Longitud objetivo
     * @param {string} originalWord - Palabra original legible
     * @returns {string} - Contraseña ajustada
     */
    adjustToExactLength(password, targetLength, originalWord) {
        // Si ya tiene la longitud correcta, devolver tal como está
        if (password.length === targetLength) {
            return password;
        }

        // Si es muy larga, truncar preservando la parte legible
        if (password.length > targetLength) {
            const securityCharsCount = password.length - originalWord.length;
            const readablePartLength = Math.max(1, targetLength - securityCharsCount);
            const finalReadablePart = originalWord.substring(0, readablePartLength);
            const securityPart = password.substring(originalWord.length);
            
            return (finalReadablePart + securityPart).substring(0, targetLength);
        }

        // Si es muy corta, añadir caracteres hasta alcanzar la longitud
        while (password.length < targetLength) {
            if (Math.random() < 0.6) {
                // Preferir añadir vocales para mantener legibilidad
                password += this.getSafeVowel(password);
            } else {
                // Ocasionalmente añadir números
                password += Math.floor(Math.random() * 10);
            }
        }

        return password.substring(0, targetLength);
    }

    /**
     * Calcula la fortaleza de una contraseña usando múltiples criterios
     * @param {string} password - Contraseña a evaluar
     * @returns {number} - Puntuación de fortaleza (0-100)
     */
    calculateStrength(password) {
        let score = 0;
        
        // 1. Longitud (hasta 30 puntos)
        if (password.length >= 16) score += 30;
        else if (password.length >= 12) score += 25;
        else if (password.length >= 8) score += 15;
        else score += 5;

        // 2. Complejidad de caracteres (hasta 30 puntos)
        const hasLower = /[a-z]/.test(password);
        const hasUpper = /[A-Z]/.test(password);
        const hasDigit = /\d/.test(password);
        const hasSymbol = /[^a-zA-Z0-9]/.test(password);
        
        let charTypeCount = 0;
        if (hasLower) charTypeCount++;
        if (hasUpper) charTypeCount++;
        if (hasDigit) charTypeCount++;
        if (hasSymbol) charTypeCount++;
        
        score += charTypeCount * 7.5; // Más recompensa por diversidad de caracteres
        
        // 3. Distribución de caracteres (hasta 15 puntos)
        const lowerRatio = (password.match(/[a-z]/g) || []).length / password.length;
        const upperRatio = (password.match(/[A-Z]/g) || []).length / password.length;
        const digitRatio = (password.match(/\d/g) || []).length / password.length;
        const symbolRatio = (password.match(/[^a-zA-Z0-9]/g) || []).length / password.length;
        
        // Premiar distribución equilibrada (ningún tipo domina más del 70%)
        const isBalanced = lowerRatio <= 0.7 && upperRatio <= 0.7 && digitRatio <= 0.7 && symbolRatio <= 0.7;
        if (isBalanced) score += 15;
        
        // 4. Ausencia de patrones (hasta 10 puntos)
        if (!/(.)\1{2,}/.test(password)) score += 10; // Sin repeticiones de 3+ caracteres

        // 5. Cálculo básico de entropía (hasta 15 puntos)
        const entropy = this.calculatePasswordEntropy(password);
        if (entropy >= 60) score += 15;
        else if (entropy >= 40) score += 10;
        else if (entropy >= 28) score += 5;
        
        // 6. Penalizaciones por patrones débiles (hasta -40 puntos)
        // Patrones numéricos
        const numbers = password.match(/\d+/g);
        if (numbers) {
            const hasWeakPatterns = numbers.some(num => {
                return this.isSequential(num.split('').map(Number)) || 
                       /(\d)\1+/.test(num) || 
                       this.isPredictablePattern(num.split('').map(Number));
            });
            
            if (hasWeakPatterns) {
                score -= 20;
            }
        }
        
        // Patrones de teclado
        const keyboardPatterns = ['qwerty', 'asdfgh', 'zxcvbn', '123456', 'abcdef'];
        if (keyboardPatterns.some(pattern => password.toLowerCase().includes(pattern))) {
            score -= 20;
        }
        
        // 7. Verificar complejidad contextual
        const commonWords = ['password', 'contraseña', 'secret', 'admin', 'login', 'welcome', 'abc123'];
        const containsCommonWord = commonWords.some(word => 
            password.toLowerCase().includes(word) || 
            this.isLeetSpeakVariation(password.toLowerCase(), word)
        );
        
        if (containsCommonWord) {
            score -= 25;
        }
        
        return Math.min(Math.max(score, 0), 100);
    }

    /**
     * Calcula la entropía básica de una contraseña
     * @param {string} password - Contraseña a evaluar
     * @returns {number} - Entropía en bits
     */
    calculatePasswordEntropy(password) {
        // Tamaño del conjunto de caracteres posibles
        let poolSize = 0;
        if (/[a-z]/.test(password)) poolSize += 26;
        if (/[A-Z]/.test(password)) poolSize += 26;
        if (/\d/.test(password)) poolSize += 10;
        if (/[^a-zA-Z0-9]/.test(password)) poolSize += 33; // Estimación de símbolos comunes
        
        // Fórmula de entropía: log2(poolSize^length)
        // Simplificada como: length * log2(poolSize)
        const entropy = password.length * Math.log2(poolSize);
        return entropy;
    }

    /**
     * Detecta variaciones de leet speak en contraseñas
     * @param {string} password - Contraseña a verificar
     * @param {string} word - Palabra base
     * @returns {boolean} - true si contiene variaciones leet speak
     */
    isLeetSpeakVariation(password, word) {
        const leetMap = {
            'a': ['4', '@'],
            'e': ['3'],
            'i': ['1', '!'],
            'o': ['0'],
            's': ['$', '5'],
            't': ['7'],
            'l': ['1']
        };
        
        // Convertir la palabra a una expresión regular que incluya variaciones leet
        let regexPattern = '';
        for (const char of word) {
            if (leetMap[char]) {
                regexPattern += `[${char}${leetMap[char].join('')}]`;
            } else {
                regexPattern += char;
            }
        }
        
        const regex = new RegExp(regexPattern);
        return regex.test(password);
    }

    /**
     * Verifica si una secuencia de dígitos es secuencial
     * @param {Array} digits - Array de dígitos
     * @returns {boolean} - true si es secuencial
     */
    isSequential(digits) {
        if (!Array.isArray(digits) || digits.length < 2) return false;
        
        for (let i = 1; i < digits.length; i++) {
            if (Math.abs(digits[i] - digits[i-1]) !== 1) {
                return false;
            }
        }
        return true;
    }

    /**
     * Verifica si una secuencia tiene patrones predecibles
     * @param {Array} digits - Array de dígitos
     * @returns {boolean} - true si tiene patrones predecibles
     */
    isPredictablePattern(digits) {
        if (!Array.isArray(digits) || digits.length < 2) return false;
        
        // Verificar patrones predecibles comunes
        const digitStr = digits.join('');
        const predictablePatterns = [
            '123', '234', '345', '456', '567', '678', '789',
            '987', '876', '765', '654', '543', '432', '321',
            '111', '222', '333', '444', '555', '666', '777', '888', '999',
            '101', '121', '131', '141', '151', '161', '171', '181', '191',
            '010', '020', '030', '040', '050', '060', '070', '080', '090'
        ];
        
        return predictablePatterns.some(pattern => digitStr.includes(pattern));
    }

    /**
     * Analiza las características fonéticas de una contraseña
     * @param {string} password - Contraseña completa
     * @param {string} readableWord - Parte legible de la contraseña
     * @returns {Object} - Análisis fonético
     */
    analyzePhoneticCharacteristics(password, readableWord) {
        const syllables = this.countSyllables(readableWord);
        const pronounceable = this.isPronounceableInSpanish(readableWord);
        const memorability = this.calculateMemorability(password, readableWord, syllables);
        
        return {
            syllables,
            pronounceable,
            length: password.length,
            memorability
        };
    }

    /**
     * Cuenta las sílabas en una palabra española
     * @param {string} word - Palabra a analizar
     * @returns {number} - Número de sílabas
     */
    countSyllables(word) {
        const cleanWord = word.replace(/[^a-záéíóúñü]/gi, '');
        if (!cleanWord) return 0;
        
        let syllables = 0;
        const vowels = 'aeiouáéíóúü';
        let previousWasVowel = false;
        
        for (let i = 0; i < cleanWord.length; i++) {
            const char = cleanWord[i].toLowerCase();
            const isVowel = vowels.includes(char);
            
            if (isVowel && !previousWasVowel) {
                syllables++;
            }
            
            if (isVowel && previousWasVowel) {
                const prevChar = cleanWord[i - 1].toLowerCase();
                const strongVowels = 'aeoáéó';
                
                if (strongVowels.includes(prevChar) && strongVowels.includes(char)) {
                    syllables++;
                }
            }
            
            previousWasVowel = isVowel;
        }
        
        return Math.max(1, syllables);
    }

    /**
     * Determina si una palabra es pronunciable en español
     * @param {string} word - Palabra a evaluar
     * @returns {boolean} - true si es pronunciable
     */
    isPronounceableInSpanish(word) {
        const cleanWord = word.replace(/[^a-záéíóúñü]/gi, '');
        if (!cleanWord) return true;
        
        // Patrones que violan las reglas fonéticas del español
        const violations = [
            /[bcdfghjklmnpqrstvwxyz]{4,}/i, // 4+ consonantes seguidas
            /[aeiouáéíóúü]{4,}/i, // 4+ vocales seguidas
            /^[xyz]/i, // Palabras que empiezan con x, y, z (raras)
            /[qw][^u]/i, // Q o W no seguidas de U
        ];
        
        const hasViolations = violations.some(pattern => pattern.test(cleanWord));
        return !hasViolations;
    }

    /**
     * Calcula el nivel de memorabilidad de una contraseña
     * @param {string} password - Contraseña completa
     * @param {string} readableWord - Parte legible
     * @param {number} syllables - Número de sílabas
     * @returns {string} - Nivel de memorabilidad
     */
    calculateMemorability(password, readableWord, syllables) {
        let score = 0;
        
        // Factor longitud
        if (password.length <= 12) score += 30;
        else if (password.length <= 16) score += 20;
        else score += 10;
        
        // Factor sílabas (2-4 sílabas son óptimas)
        if (syllables >= 2 && syllables <= 4) score += 25;
        else if (syllables >= 1 && syllables <= 6) score += 15;
        else score += 5;
        
        // Ratio de parte legible
        const readableRatio = readableWord.length / password.length;
        if (readableRatio >= 0.7) score += 25;
        else if (readableRatio >= 0.5) score += 15;
        else score += 5;
        
        // Patrón reconocible (palabra + números + símbolo)
        const hasGoodPattern = /^[a-z]+\d+[!@#$%&*]?$/i.test(password);
        if (hasGoodPattern) score += 15;
        
        // Penalizar patrones numéricos débiles
        const numbers = password.match(/\d+/g);
        if (numbers) {
            const hasWeakPatterns = numbers.some(num => {
                return this.isSequential(num.split('').map(Number)) || 
                       /(\d)\1+/.test(num) || 
                       this.isPredictablePattern(num.split('').map(Number));
            });
            
            if (hasWeakPatterns) {
                score -= 15;
            }
        }
        
        // Clasificar memorabilidad
        if (score >= 85) return 'Muy Alta';
        else if (score >= 65) return 'Alta';
        else if (score >= 45) return 'Media';
        else return 'Baja';
    }

    /**
     * Guarda la contraseña generada actualmente en el servidor
     * Asocia una etiqueta y calcula la fortaleza
     */
    async saveCurrentPassword() {
        const password = this.generatedPassword.textContent;
        const label = this.passwordLabel.value || `Contraseña ${new Date().toLocaleDateString()}`;
        const strengthScore = this.calculateStrength(password);

        if (!password) {
            this.showToast('No hay contraseña para guardar', 'error');
            return;
        }

        this.savePassword.disabled = true;
        this.savePassword.textContent = '💾 Guardando...';

        try {
            console.log('💾 Saving password:', { label, passwordLength: password.length, strengthScore });

            const response = await fetch(`${this.apiBase}/passwords`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({
                    label,
                    password,
                    phoneticText: '',
                    strengthScore
                })
            });

            console.log('📊 Save response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Password saved:', data);
                this.showToast('Contraseña guardada correctamente', 'success');
                this.passwordLabel.value = '';
                this.loadSavedPasswords();
            } else {
                const errorText = await response.text();
                console.error('❌ Save error:', response.status, errorText);
                this.showToast(`Error del servidor (${response.status})`, 'error');
            }
        } catch (error) {
            console.error('❌ Network error saving:', error);
            this.showToast('Error de conexión con el servidor', 'error');
        } finally {
            this.savePassword.disabled = false;
            this.savePassword.textContent = '💾 Guardar Contraseña';
        }
    }

    /**
     * Elimina una contraseña guardada después de confirmar la acción
     * @param {string} passwordId - ID de la contraseña a eliminar
     */
    async deletePassword(passwordId) {
        if (!confirm('¿Estás seguro de que quieres eliminar esta contraseña?')) {
            return;
        }

        try {
            console.log('🗑️ Deleting password:', passwordId);

            const response = await fetch(`${this.apiBase}/passwords/${passwordId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                this.showToast('Contraseña eliminada', 'success');
                this.loadSavedPasswords();
            } else {
                const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                console.error('❌ Delete error:', response.status, errorData);
                this.showToast('Error al eliminar contraseña', 'error');
            }
        } catch (error) {
            console.error('❌ Network error deleting:', error);
            this.showToast('Error de conexión', 'error');
        }
    }

    // Utility methods
    /**
     * Selecciona un elemento aleatorio de un array
     * @param {Array} array - Array de donde seleccionar
     * @returns {*} - Elemento seleccionado
     */
    getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    /**
     * Copia texto al portapapeles y muestra un mensaje de éxito
     * @param {string} text - Texto a copiar
     * @param {string} message - Mensaje de éxito
     */
    copyToClipboard(text, message) {
        navigator.clipboard.writeText(text).then(() => {
            this.showToast(message, 'success');
        }).catch(() => {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                this.showToast(message, 'success');
            } catch (err) {
                this.showToast('Error al copiar al portapapeles', 'error');
            }
            document.body.removeChild(textArea);
        });
    }

    /**
     * Muestra un mensaje tipo toast en la interfaz
     * @param {string} message - Mensaje a mostrar
     * @param {string} [type='info'] - Tipo de mensaje (success, error, warning, info)
     */
    showToast(message, type = 'info') {
        if (this.toast && this.toastMessage) {
            this.toastMessage.textContent = message;
            this.toast.className = `toast ${type}`;
            this.toast.classList.remove('hidden');

            setTimeout(() => {
                this.toast.classList.add('hidden');
            }, 3000);
        } else {
            console.log('Toast:', message);
        }
    }

    /**
     * Cierra la sesión del usuario y redirige al login
     */
    async logout() {
        localStorage.removeItem('auth_token');
        window.location.href = 'index.html';
    }

    /**
     * Alterna la sección educativa mostrando u ocultando contenido técnico
     */
    toggleEducationalSection() {
        if (this.educationalContent) {
            if (this.educationalContent.classList.contains('hidden')) {
                this.educationalContent.classList.remove('hidden');
                this.toggleEducationBtn.textContent = '📚 Ocultar explicación técnica';
                
                // Add strength calculation explanation when showing educational content
                this.updateStrengthExplanation();
            } else {
                this.educationalContent.classList.add('hidden');
                this.toggleEducationBtn.textContent = '📚 ¿Cómo funciona esta aplicación?';
            }
        }
    }

    /**
     * Actualiza la explicación del cálculo de fortaleza en la sección educativa
     */
    updateStrengthExplanation() {
        // Find or create the strength explanation section
        let strengthSection = document.getElementById('strengthCalculationSection');
        
        if (!strengthSection) {
            strengthSection = document.createElement('div');
            strengthSection.id = 'strengthCalculationSection';
            strengthSection.className = 'strength-explanation';
            
            if (this.educationalContent) {
                this.educationalContent.appendChild(strengthSection);
            }
        }

        const currentPassword = this.generatedPassword?.textContent || '';
        const strengthDetails = this.getDetailedStrengthAnalysis(currentPassword);

        strengthSection.innerHTML = `
            <h3>🔒 Análisis Detallado de Fortaleza</h3>
            <div class="strength-breakdown">
                <h4>Criterios de Evaluación (Total: 100 puntos)</h4>
                
                <div class="criterion">
                    <h5>1. Longitud de la Contraseña (hasta 30 puntos)</h5>
                    <ul>
                        <li>16+ caracteres: 30 puntos ✅</li>
                        <li>12-15 caracteres: 25 puntos</li>
                        <li>8-11 caracteres: 15 puntos</li>
                        <li>Menos de 8: 5 puntos ⚠️</li>
                    </ul>
                    <div class="score-display">
                        <strong>Tu puntuación: ${strengthDetails.lengthScore} puntos</strong>
                        <span class="detail">(${currentPassword.length} caracteres)</span>
                    </div>
                </div>

                <div class="criterion">
                    <h5>2. Diversidad de Caracteres (hasta 30 puntos)</h5>
                    <ul>
                        <li>Minúsculas: ${strengthDetails.hasLower ? '✅ +7.5 puntos' : '❌ 0 puntos'}</li>
                        <li>Mayúsculas: ${strengthDetails.hasUpper ? '✅ +7.5 puntos' : '❌ 0 puntos'}</li>
                        <li>Números: ${strengthDetails.hasDigit ? '✅ +7.5 puntos' : '❌ 0 puntos'}</li>
                        <li>Símbolos: ${strengthDetails.hasSymbol ? '✅ +7.5 puntos' : '❌ 0 puntos'}</li>
                    </ul>
                    <div class="score-display">
                        <strong>Tu puntuación: ${strengthDetails.diversityScore} puntos</strong>
                        <span class="detail">(${strengthDetails.charTypeCount}/4 tipos de caracteres)</span>
                    </div>
                </div>

                <div class="criterion">
                    <h5>3. Distribución Equilibrada (hasta 15 puntos)</h5>
                    <p>Ningún tipo de carácter debe dominar más del 70% de la contraseña</p>
                    <ul>
                        <li>Minúsculas: ${strengthDetails.lowerRatio}% ${strengthDetails.lowerRatio <= 70 ? '✅' : '❌'}</li>
                        <li>Mayúsculas: ${strengthDetails.upperRatio}% ${strengthDetails.upperRatio <= 70 ? '✅' : '❌'}</li>
                        <li>Números: ${strengthDetails.digitRatio}% ${strengthDetails.digitRatio <= 70 ? '✅' : '❌'}</li>
                        <li>Símbolos: ${strengthDetails.symbolRatio}% ${strengthDetails.symbolRatio <= 70 ? '✅' : '❌'}</li>
                    </ul>
                    <div class="score-display">
                        <strong>Tu puntuación: ${strengthDetails.balanceScore} puntos</strong>
                        <span class="detail">${strengthDetails.isBalanced ? 'Distribución equilibrada' : 'Distribución desequilibrada'}</span>
                    </div>
                </div>

                <div class="criterion">
                    <h5>4. Ausencia de Repeticiones (hasta 10 puntos)</h5>
                    <p>Sin repeticiones de 3 o más caracteres consecutivos</p>
                    <div class="score-display">
                        <strong>Tu puntuación: ${strengthDetails.patternScore} puntos</strong>
                        <span class="detail">${strengthDetails.hasRepeatingChars ? 'Se detectaron repeticiones' : 'Sin repeticiones detectadas'}</span>
                    </div>
                </div>

                <div class="criterion">
                    <h5>5. Entropía de la Contraseña (hasta 15 puntos)</h5>
                    <p>Medida de la aleatoriedad y complejidad criptográfica</p>
                    <ul>
                        <li>60+ bits: 15 puntos ✅</li>
                        <li>40-59 bits: 10 puntos</li>
                        <li>28-39 bits: 5 puntos</li>
                        <li>Menos de 28 bits: 0 puntos ⚠️</li>
                    </ul>
                    <div class="score-display">
                        <strong>Tu puntuación: ${strengthDetails.entropyScore} puntos</strong>
                        <span class="detail">(${strengthDetails.entropy.toFixed(1)} bits de entropía)</span>
                    </div>
                </div>

                <div class="criterion penalties">
                    <h5>6. Penalizaciones por Patrones Débiles (hasta -40 puntos)</h5>
                    <ul>
                        <li>Secuencias numéricas (123, 987): ${strengthDetails.hasSequentialNumbers ? '❌ -20 puntos' : '✅ 0 puntos'}</li>
                        <li>Patrones de teclado (qwerty, 123456): ${strengthDetails.hasKeyboardPatterns ? '❌ -20 puntos' : '✅ 0 puntos'}</li>
                        <li>Palabras comunes (password, admin): ${strengthDetails.hasCommonWords ? '❌ -25 puntos' : '✅ 0 puntos'}</li>
                    </ul>
                    <div class="score-display">
                        <strong>Penalización total: ${strengthDetails.penaltyScore} puntos</strong>
                    </div>
                </div>

                <div class="final-score">
                    <h4>🎯 Puntuación Final</h4>
                    <div class="score-breakdown">
                        <div>Longitud: +${strengthDetails.lengthScore}</div>
                        <div>Diversidad: +${strengthDetails.diversityScore}</div>
                        <div>Equilibrio: +${strengthDetails.balanceScore}</div>
                        <div>Sin repeticiones: +${strengthDetails.patternScore}</div>
                        <div>Entropía: +${strengthDetails.entropyScore}</div>
                        <div>Penalizaciones: ${strengthDetails.penaltyScore}</div>
                        <hr>
                        <div class="total"><strong>Total: ${strengthDetails.finalScore}/100 puntos</strong></div>
                    </div>
                    
                    <div class="strength-rating ${strengthDetails.strengthClass}">
                        <strong>${strengthDetails.strengthLabel}</strong>
                    </div>
                </div>

                <div class="recommendations">
                    <h4>💡 Recomendaciones para Mejorar</h4>
                    <ul>
                        ${strengthDetails.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>
            </div>

            <style>
                .strength-explanation {
                    margin-top: 20px;
                    padding: 20px;
                    background: #f8f9fa;
                    border-radius: 8px;
                    border-left: 4px solid #007bff;
                }
                
                .strength-breakdown .criterion {
                    margin-bottom: 20px;
                    padding: 15px;
                    background: white;
                    border-radius: 6px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                
                .criterion.penalties {
                    border-left: 3px solid #dc3545;
                }
                
                .criterion h5 {
                    color: #495057;
                    margin-bottom: 10px;
                    font-size: 1.1em;
                }
                
                .criterion ul {
                    margin: 10px 0;
                    padding-left: 20px;
                }
                
                .criterion li {
                    margin: 5px 0;
                    font-size: 0.9em;
                }
                
                .score-display {
                    background: #e9ecef;
                    padding: 8px 12px;
                    border-radius: 4px;
                    margin-top: 10px;
                }
                
                .score-display .detail {
                    color: #6c757d;
                    font-size: 0.9em;
                    margin-left: 10px;
                }
                
                .final-score {
                    background: #007bff;
                    color: white;
                    padding: 20px;
                    border-radius: 8px;
                    margin-top: 20px;
                }
                
                .score-breakdown {
                    background: rgba(255,255,255,0.1);
                    padding: 15px;
                    border-radius: 6px;
                    margin: 15px 0;
                }
                
                .score-breakdown div {
                    padding: 3px 0;
                    display: flex;
                    justify-content: space-between;
                }
                
                .score-breakdown .total {
                    font-size: 1.2em;
                    margin-top: 10px;
                    padding-top: 10px;
                }
                
                .strength-rating {
                    text-align: center;
                    padding: 15px;
                    border-radius: 6px;
                    margin-top: 15px;
                    font-size: 1.3em;
                }
                
                .strength-rating.very-strong { background: #28a745; }
                .strength-rating.strong { background: #17a2b8; }
                .strength-rating.medium { background: #ffc107; color: #212529; }
                .strength-rating.weak { background: #fd7e14; }
                .strength-rating.very-weak { background: #dc3545; }
                
                .recommendations {
                    background: #d4edda;
                    border: 1px solid #c3e6cb;
                    border-radius: 6px;
                    padding: 15px;
                    margin-top: 20px;
                }
                
                .recommendations h4 {
                    color: #155724;
                    margin-bottom: 10px;
                }
                
                .recommendations ul {
                    margin: 0;
                    padding-left: 20px;
                }
                
                .recommendations li {
                    color: #155724;
                    margin: 8px 0;
                }
            </style>
        `;
    }

    /**
     * Obtiene el análisis detallado de fortaleza de una contraseña
     * @param {string} password - Contraseña a analizar
     * @returns {Object} - Detalles del análisis de fortaleza
     */
    getDetailedStrengthAnalysis(password) {
        if (!password) {
            return {
                lengthScore: 0,
                diversityScore: 0,
                balanceScore: 0,
                patternScore: 0,
                entropyScore: 0,
                penaltyScore: 0,
                finalScore: 0,
                strengthLabel: 'Sin contraseña',
                strengthClass: 'very-weak',
                recommendations: ['Genera una contraseña para ver el análisis detallado']
            };
        }

        // Calculate individual scores
        let lengthScore = 0;
        if (password.length >= 16) lengthScore = 30;
        else if (password.length >= 12) lengthScore = 25;
        else if (password.length >= 8) lengthScore = 15;
        else lengthScore = 5;

        // Character diversity
        const hasLower = /[a-z]/.test(password);
        const hasUpper = /[A-Z]/.test(password);
        const hasDigit = /\d/.test(password);
        const hasSymbol = /[^a-zA-Z0-9]/.test(password);
        
        let charTypeCount = 0;
        if (hasLower) charTypeCount++;
        if (hasUpper) charTypeCount++;
        if (hasDigit) charTypeCount++;
        if (hasSymbol) charTypeCount++;
        
        const diversityScore = charTypeCount * 7.5;

        // Distribution balance
        const lowerRatio = Math.round(((password.match(/[a-z]/g) || []).length / password.length) * 100);
        const upperRatio = Math.round(((password.match(/[A-Z]/g) || []).length / password.length) * 100);
        const digitRatio = Math.round(((password.match(/\d/g) || []).length / password.length) * 100);
        const symbolRatio = Math.round(((password.match(/[^a-zA-Z0-9]/g) || []).length / password.length) * 100);
        
        const isBalanced = lowerRatio <= 70 && upperRatio <= 70 && digitRatio <= 70 && symbolRatio <= 70;
        const balanceScore = isBalanced ? 15 : 0;

        // Pattern analysis
        const hasRepeatingChars = /(.)\1{2,}/.test(password);
        const patternScore = hasRepeatingChars ? 0 : 10;

        // Entropy calculation
        const entropy = this.calculatePasswordEntropy(password);
        let entropyScore = 0;
        if (entropy >= 60) entropyScore = 15;
        else if (entropy >= 40) entropyScore = 10;
        else if (entropy >= 28) entropyScore = 5;

        // Penalties
        let penaltyScore = 0;
        
        // Sequential numbers
        const numbers = password.match(/\d+/g);
        const hasSequentialNumbers = numbers ? numbers.some(num => {
            return this.isSequential(num.split('').map(Number)) || 
                   /(\d)\1+/.test(num) || 
                   this.isPredictablePattern(num.split('').map(Number));
        }) : false;
        
        if (hasSequentialNumbers) penaltyScore -= 20;

        // Keyboard patterns
        const keyboardPatterns = ['qwerty', 'asdfgh', 'zxcvbn', '123456', 'abcdef'];
        const hasKeyboardPatterns = keyboardPatterns.some(pattern => password.toLowerCase().includes(pattern));
        if (hasKeyboardPatterns) penaltyScore -= 20;

        // Common words
        const commonWords = ['password', 'contraseña', 'secret', 'admin', 'login', 'welcome', 'abc123'];
        const hasCommonWords = commonWords.some(word => 
            password.toLowerCase().includes(word) || 
            this.isLeetSpeakVariation(password.toLowerCase(), word)
        );
        if (hasCommonWords) penaltyScore -= 25;

        // Final score
        const finalScore = Math.min(Math.max(lengthScore + diversityScore + balanceScore + patternScore + entropyScore + penaltyScore, 0), 100);

        // Strength classification
        let strengthLabel = '';
        let strengthClass = '';
        
        if (finalScore >= 80) {
            strengthLabel = 'Muy Fuerte';
            strengthClass = 'very-strong';
        } else if (finalScore >= 60) {
            strengthLabel = 'Fuerte';
            strengthClass = 'strong';
        } else if (finalScore >= 40) {
            strengthLabel = 'Media';
            strengthClass = 'medium';
        } else if (finalScore >= 20) {
            strengthLabel = 'Débil';
            strengthClass = 'weak';
        } else {
            strengthLabel = 'Muy Débil';
            strengthClass = 'very-weak';
        }

        // Recommendations
        const recommendations = [];
        if (lengthScore < 25) recommendations.push('Aumenta la longitud a al menos 12 caracteres');
        if (charTypeCount < 3) recommendations.push('Incluye más tipos de caracteres (mayúsculas, números, símbolos)');
        if (!isBalanced) recommendations.push('Mejora la distribución de tipos de caracteres');
        if (hasRepeatingChars) recommendations.push('Evita repetir caracteres consecutivamente');
        if (entropyScore < 10) recommendations.push('Aumenta la aleatoriedad de la contraseña');
        if (hasSequentialNumbers) recommendations.push('Evita secuencias numéricas predecibles');
        if (hasKeyboardPatterns) recommendations.push('No uses patrones del teclado');
        if (hasCommonWords) recommendations.push('Evita palabras comunes o predecibles');
        
        if (recommendations.length === 0) {
            recommendations.push('¡Excelente! Tu contraseña cumple con todos los criterios de seguridad');
        }

        return {
            lengthScore,
            diversityScore,
            balanceScore,
            patternScore,
            entropyScore,
            penaltyScore,
            finalScore,
            strengthLabel,
            strengthClass,
            hasLower,
            hasUpper,
            hasDigit,
            hasSymbol,
            charTypeCount,
            lowerRatio,
            upperRatio,
            digitRatio,
            symbolRatio,
            isBalanced,
            hasRepeatingChars,
            entropy,
            hasSequentialNumbers,
            hasKeyboardPatterns,
            hasCommonWords,
            recommendations
        };
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing ReadablePasswordManager...');
    new ReadablePasswordManager();
});
