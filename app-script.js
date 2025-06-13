class ReadablePasswordManager {
    constructor() {
        this.token = localStorage.getItem('auth_token');
        // PRODUCTION: Updated URL for Render backend
        this.apiBase = 'https://readablepasswords.onrender.com/api';
        this.currentUser = null;
        this.savedPasswords = [];
        
        // Enhanced Spanish syllables and word patterns
        this.spanishSyllables = {
            consonants: ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z'],
            vowels: ['a', 'e', 'i', 'o', 'u'],
            commonCombos: ['br', 'cr', 'dr', 'fr', 'gr', 'pr', 'tr', 'bl', 'cl', 'fl', 'gl', 'pl', 'ch', 'll', 'rr', 'ñ'],
            
            // Complex syllables for advanced generation
            complexSyllables: {
                start: ['bra', 'bre', 'bri', 'bro', 'bru', 'cla', 'cle', 'cli', 'clo', 'clu', 'cra', 'cre', 'cri', 'cro', 'cru',
                       'dra', 'dre', 'dri', 'dro', 'dru', 'fra', 'fre', 'fri', 'fro', 'fru', 'gra', 'gre', 'gri', 'gro', 'gru',
                       'pla', 'ple', 'pli', 'plo', 'plu', 'pra', 'pre', 'pri', 'pro', 'pru', 'tra', 'tre', 'tri', 'tro', 'tru'],
                middle: ['bla', 'ble', 'bli', 'blo', 'blu', 'fla', 'fle', 'fli', 'flo', 'flu', 'gla', 'gle', 'gli', 'glo', 'glu'],
                end: ['ción', 'sión', 'tivo', 'tiva', 'mente', 'able', 'ible']
            },
            
            wordEndings: {
                verbs: ['ar', 'er', 'ir', 'ando', 'iendo', 'ado', 'ido'],
                nouns: ['o', 'a', 'e', 'or', 'ora', 'ero', 'era', 'ista'],
                adjectives: ['oso', 'osa', 'ivo', 'iva', 'able', 'ible', 'al', 'ante'],
                adverbs: ['mente']
            },
            
            // Allowed double letters in Spanish
            naturalDoubles: ['ll', 'rr', 'cc', 'nn', 'ss'], 
            
            // Spanish linguistic rules
            invalidCombinations: [
                // Consonant + V combinations that don't exist in Spanish
                'cv', 'kv', 'pv', 'bv', 'tv', 'dv', 'gv', 'fv', 'jv', 'lv', 'mv', 'nv', 'rv', 'sv', 'xv', 'zv',
                // Other uncommon combinations
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
            
            // Valid consonant clusters for Spanish
            validClusters: ['br', 'cr', 'dr', 'fr', 'gr', 'kr', 'pr', 'tr', 'bl', 'cl', 'fl', 'gl', 'kl', 'pl'],
            
            // Consonants that can appear before 'r' or 'l'
            canPrecedeR: ['b', 'c', 'd', 'f', 'g', 'k', 'p', 't'],
            canPrecedeL: ['b', 'c', 'f', 'g', 'k', 'p'],
            
            // Consonants that rarely start words in Spanish
            rareInitial: ['k', 'w', 'x'],
            
            // Common Spanish prefixes and suffixes for more natural words
            prefixes: ['pre', 'pro', 'sub', 'des', 'con', 'ex', 'in', 'un', 're'],
            suffixes: ['tion', 'sion', 'ado', 'ido', 'ero', 'era', 'oso', 'osa'],

            // Rhythmic patterns for better memorability
            rhythmicPatterns: [
                'CVCV', 'CVCVC', 'CVCVCV', 'CCVCV', 'CVCVC', 'CVCCV'
            ],
            
            // Common Spanish word roots
            wordRoots: ['amor', 'vida', 'casa', 'agua', 'luz', 'sol', 'mar', 'voz', 'paz', 'flor', 'pan', 'sal', 'rey', 'ley']
        };

        // Character replacements for leet speak (Spanish friendly)
        this.characterReplacements = {
            'a': ['4', '@'],
            'e': ['3'],
            'i': ['1', '!'],
            'o': ['0'],
            'u': ['v'],
            's': ['$', '5'],
            't': ['7'],
            'l': ['1'],
            'g': ['6', '9'],
            'b': ['8'],
            'z': ['2']
        };

        this.symbols = ['!', '@', '#', '$', '%', '&', '*', '+', '=', '?'];
        
        this.initializeElements(); // Asegúrate que esto se llama ANTES de bindEvents y checkAuth
        this.bindEvents();
        this.checkAuth();
    }

    initializeElements() {
        // User elements
        this.usernameSpan = document.getElementById('username');
        this.logoutBtn = document.getElementById('logoutBtn');
        
        // Generator elements
        this.passwordLabel = document.getElementById('passwordLabel');
        this.passwordLength = document.getElementById('passwordLength');
        this.lengthValue = document.getElementById('lengthValue');
        this.includeUppercase = document.getElementById('includeUppercase');
        this.includeLowercase = document.getElementById('includeLowercase');
        this.includeNumbers = document.getElementById('includeNumbers');
        this.includeSymbols = document.getElementById('includeSymbols');
        this.generateBtn = document.getElementById('generateBtn');
        
        // Result elements
        this.passwordResult = document.getElementById('passwordResult');
        this.generatedPassword = document.getElementById('generatedPassword');
        this.syllableCount = document.getElementById('syllableCount');
        this.pronounceable = document.getElementById('pronounceable');
        this.passwordLengthDisplay = document.getElementById('passwordLengthDisplay');
        this.memorability = document.getElementById('memorability');
        this.strengthFill = document.getElementById('strengthFill');
        this.strengthText = document.getElementById('strengthText');
        this.copyPassword = document.getElementById('copyPassword');
        this.savePassword = document.getElementById('savePassword');
        
        // Saved passwords elements
        this.refreshPasswords = document.getElementById('refreshPasswords');
        this.searchInput = document.getElementById('searchInput');
        this.passwordsList = document.getElementById('passwordsList');
        this.passwordItemTemplate = document.getElementById('passwordItemTemplate');
        
        // Toast
        this.toast = document.getElementById('toast');
        this.toastMessage = document.getElementById('toastMessage');

        // Advanced options
        this.useComplexSyllables = document.getElementById('useComplexSyllables');
        this.capitalizeFirst = document.getElementById('capitalizeFirst');
        this.addEndings = document.getElementById('addEndings');
        this.useRhythm = document.getElementById('useRhythm');

        // Educational section
        this.toggleEducationBtn = document.getElementById('toggleEducation');
        this.educationalContent = document.getElementById('educationalContent');
        
        // Log crucial elements
        console.log('🔍 initializeElements: passwordsList exists?', !!this.passwordsList);
        if (!this.passwordsList) console.error('🚨 FATAL: passwordsList element NOT FOUND in HTML.');
        
        console.log('🔍 initializeElements: passwordItemTemplate exists?', !!this.passwordItemTemplate);
        if (!this.passwordItemTemplate) console.error('🚨 FATAL: passwordItemTemplate element NOT FOUND in HTML.');
        else console.log('🔍 initializeElements: passwordItemTemplate.content exists?', !!this.passwordItemTemplate.content);
    }

    bindEvents() {
        // Auth events
        if (this.logoutBtn) this.logoutBtn.addEventListener('click', () => this.logout());
        else console.warn('logoutBtn not found');
        
        // Generator events
        if (this.passwordLength) this.passwordLength.addEventListener('input', () => this.updateLengthDisplay());
        else console.warn('passwordLength not found');

        if (this.generateBtn) this.generateBtn.addEventListener('click', () => this.generatePassword());
        else console.warn('generateBtn not found');
        
        if (this.copyPassword) this.copyPassword.addEventListener('click', () => this.copyToClipboard(this.generatedPassword.textContent, 'Contraseña copiada'));
        else console.warn('copyPassword not found');

        if (this.savePassword) this.savePassword.addEventListener('click', () => this.saveCurrentPassword());
        else console.warn('savePassword not found');
        
        // Saved passwords events
        if (this.refreshPasswords) this.refreshPasswords.addEventListener('click', () => this.loadSavedPasswords());
        else console.warn('refreshPasswords not found');

        if (this.searchInput) this.searchInput.addEventListener('input', () => this.filterPasswords());
        else console.warn('searchInput not found');

        // Educational section events
        if (this.toggleEducationBtn) {
            this.toggleEducationBtn.addEventListener('click', () => this.toggleEducationalSection());
        } else console.warn('toggleEducationBtn not found');
    }

    async loadSavedPasswords() {
        if (!this.token) {
            console.error('❌ No token available for loadSavedPasswords.');
            this.showToast('Error de autenticación. Intenta iniciar sesión de nuevo.', 'error');
            return;
        }
        try {
            console.log('🔄 Loading saved passwords...');
            this.passwordsList.innerHTML = '<div class="loading">Cargando contraseñas...</div>'; // Show loading state
            
            const response = await fetch(`${this.apiBase}/passwords`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('📊 Load Passwords - Response status:', response.status);
            console.log('📋 Load Passwords - Response ok:', response.ok);

            if (response.ok) {
                const data = await response.json();
                this.savedPasswords = data;
                console.log('✅ Contraseñas cargadas:', this.savedPasswords.length);
                console.log('📄 Datos recibidos:', JSON.stringify(this.savedPasswords, null, 2)); // Log full data
                this.displaySavedPasswords();
            } else {
                const errorText = await response.text();
                console.error('❌ Load Passwords - Error:', response.status, errorText);
                this.showToast(`Error del servidor al cargar: ${response.status}`, 'error');
                if (this.passwordsList) this.passwordsList.innerHTML = '<div class="loading">Error al cargar contraseñas. Intenta actualizar.</div>';
            }
        } catch (error) {
            console.error('❌ Network error loading passwords:', error);
            this.showToast('Error de conexión al cargar contraseñas', 'error');
            if (this.passwordsList) this.passwordsList.innerHTML = '<div class="loading">Error de red. Verifica tu conexión.</div>';
        }
    }

    displaySavedPasswords(passwordsToDisplay = this.savedPasswords) {
        console.log('🎨 Displaying passwords. Count:', passwordsToDisplay.length);
        
        if (!this.passwordsList) {
            console.error('❌ displaySavedPasswords: passwordsList element is null. Cannot display.');
            return;
        }

        this.passwordsList.innerHTML = ''; // Clear previous items

        if (passwordsToDisplay.length === 0) {
            this.passwordsList.innerHTML = '<div class="loading">No hay contraseñas guardadas.</div>';
            console.log('📝 No passwords to display.');
            return;
        }

        passwordsToDisplay.forEach((password, index) => {
            console.log(`🔧 Processing password item ${index}:`, password.label, password.id);
            if (!password.id || !password.password || !password.label) {
                console.warn(`⚠️ Password item ${index} is missing critical data:`, password);
            }
            try {
                const item = this.createPasswordItem(password);
                if (item) {
                    this.passwordsList.appendChild(item);
                } else {
                    console.error(`❌ Failed to create DOM element for password: ${password.label}`);
                }
            } catch (error) {
                console.error(`❌ Error creating or appending password item ${index} (${password.label}):`, error);
            }
        });
        console.log('✅ Finished displaying passwords.');
    }

    createPasswordItem(password) {
        console.log('🛠️ createPasswordItem for:', password.label, 'ID:', password.id);
        console.log('Password object received:', JSON.stringify(password));


        if (!this.passwordItemTemplate || !this.passwordItemTemplate.content) {
            console.error('❌ createPasswordItem: passwordItemTemplate or its content is invalid.');
            const fallbackDiv = document.createElement('div');
            fallbackDiv.textContent = `Error al mostrar: ${password.label || 'Contraseña sin etiqueta'}`;
            return fallbackDiv;
        }

        try {
            const templateContent = this.passwordItemTemplate.content.cloneNode(true);
            const item = templateContent.querySelector('.password-item');

            if (!item) {
                console.error('❌ .password-item class not found within template content.');
                const fallbackDiv = document.createElement('div');
                fallbackDiv.textContent = `Error de template para: ${password.label}`;
                return fallbackDiv;
            }
            
            // Set data safely
            const labelElement = item.querySelector('.password-label');
            const valueElement = item.querySelector('.field-value');
            const dateElement = item.querySelector('.created-date');
            const strengthBadge = item.querySelector('.strength-badge');

            if (labelElement) labelElement.textContent = password.label || 'Sin etiqueta';
            else console.warn('🏷️ .password-label not found in template item for', password.label);

            if (valueElement) valueElement.textContent = '••••••••';
            else console.warn('🔒 .field-value not found in template item for', password.label);
            
            if (dateElement) dateElement.textContent = new Date(password.createdAt).toLocaleDateString();
            else console.warn('📅 .created-date not found in template item for', password.label);
            
            if (strengthBadge) {
                const score = password.strengthScore || 0;
                // ... (código para setear el badge de fortaleza) ...
                if (score >= 80) { /* ... */ } else if (score >= 60) { /* ... */ } // etc.
            } else console.warn('💪 .strength-badge not found for', password.label);


            // Bind events safely
            const copyBtn = item.querySelector('.copy-password-btn');
            if (copyBtn) {
                if (password.password) {
                    copyBtn.addEventListener('click', () => {
                        this.copyToClipboard(password.password, 'Contraseña copiada');
                    });
                } else {
                    console.warn('📋 Copy button present, but password.password is missing for', password.label);
                    copyBtn.disabled = true;
                    copyBtn.title = "Error: Contraseña no disponible";
                }
            } else console.warn('📋 .copy-password-btn not found for', password.label);
            
            const toggleBtn = item.querySelector('.toggle-visibility');
            if (toggleBtn && valueElement) {
                 if (password.password) {
                    toggleBtn.addEventListener('click', (e) => {
                        if (valueElement.textContent === '••••••••') {
                            valueElement.textContent = password.password;
                            e.target.textContent = '🙈';
                        } else {
                            valueElement.textContent = '••••••••';
                            e.target.textContent = '👁️';
                        }
                    });
                } else {
                    console.warn('👁️ Toggle button present, but password.password is missing for', password.label);
                    toggleBtn.disabled = true;
                    toggleBtn.title = "Error: Contraseña no disponible";
                }
            } else console.warn('👁️ .toggle-visibility or .field-value not found for', password.label);
            
            const deleteBtn = item.querySelector('.delete-btn');
            if (deleteBtn) {
                if (password.id) {
                    deleteBtn.addEventListener('click', () => {
                        this.deletePassword(password.id);
                    });
                } else {
                     console.warn('🗑️ Delete button present, but password.id is missing for', password.label);
                    deleteBtn.disabled = true;
                    deleteBtn.title = "Error: ID no disponible";
                }
            } else console.warn('🗑️ .delete-btn not found for', password.label);

            return item;
        } catch (error) {
            console.error(`❌ Exception in createPasswordItem for ${password.label}:`, error);
            const fallbackDiv = document.createElement('div');
            fallbackDiv.textContent = `Excepción al mostrar: ${password.label}`;
            return fallbackDiv;
        }
    }

    filterPasswords() {
        const query = this.searchInput?.value?.toLowerCase() || '';
        const filtered = this.savedPasswords.filter(password =>
            password.label.toLowerCase().includes(query)
        );
        this.displaySavedPasswords(filtered);
    }

    async checkAuth() {
        if (!this.token) {
            console.log('❌ No token found, redirecting to login');
            window.location.href = 'index.html';
            return;
        }

        try {
            console.log('🔐 Checking authentication with token...');
            // Intenta obtener el nombre de usuario primero para validar el token
            // El endpoint /api/passwords es bueno para esto porque requiere autenticación
            const response = await fetch(`${this.apiBase}/passwords`, { // Usamos /passwords que es un endpoint protegido
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('📊 Auth check status:', response.status);

            if (response.ok) {
                // Token es válido, decodifiquemos para obtener info del usuario
                const payload = JSON.parse(atob(this.token.split('.')[1]));
                this.currentUser = {
                    id: payload.userId,
                    username: payload.username,
                    email: payload.email
                };
                
                if (this.usernameSpan) {
                    this.usernameSpan.textContent = this.currentUser.username;
                } else {
                    console.warn("usernameSpan element not found in initializeElements");
                }
                
                console.log('✅ User authenticated:', this.currentUser.username);
                // Ahora que el usuario está autenticado, carga sus contraseñas
                this.loadSavedPasswords();
            } else {
                console.log('❌ Authentication failed (token might be invalid/expired), logging out. Status:', response.status);
                const errorText = await response.text();
                console.log('❌ Auth error response:', errorText);
                this.logout(); // Token inválido o expirado
            }
        } catch (error) {
            console.error('❌ Network or other error during auth check:', error);
            this.showToast('Error de conexión durante la autenticación', 'error');
            // Considerar si redirigir a login o no, dependiendo de la política de errores
            // this.logout(); 
        }
    }

    updateLengthDisplay() {
        this.lengthValue.textContent = this.passwordLength.value;
    }

    generateSpanishWord(targetLength) {
        const options = {
            useComplexSyllables: this.useComplexSyllables?.checked || false,
            capitalizeFirst: this.capitalizeFirst?.checked || true,
            addEndings: this.addEndings?.checked || false,
            useRhythm: this.useRhythm?.checked || false
        };

        let word = '';
        
        // Use rhythmic pattern if enabled
        if (options.useRhythm && targetLength >= 6) {
            word = this.generateRhythmicWord(targetLength, options);
        } else if (options.useComplexSyllables && Math.random() < 0.4) {
            word = this.generateComplexSyllableWord(targetLength, options);
        } else {
            word = this.generateTraditionalWord(targetLength, options);
        }

        // Add endings if enabled and word is long enough
        if (options.addEndings && word.length <= targetLength - 3 && word.length >= 4) {
            word = this.addSpanishEnding(word, targetLength);
        }

        // Ensure proper length
        word = word.substring(0, targetLength - 2);
        
        return word;
    }

    generateRhythmicWord(targetLength, options) {
        const pattern = this.getRandomElement(this.spanishSyllables.rhythmicPatterns);
        let word = '';
        
        for (let i = 0; i < pattern.length && word.length < targetLength - 3; i++) {
            const char = pattern[i];
            if (char === 'C') {
                // Add consonant (possibly complex if enabled)
                if (options.useComplexSyllables && Math.random() < 0.3 && word.length < targetLength - 5) {
                    const complexStart = this.getRandomElement(this.spanishSyllables.complexSyllables.start);
                    if (word.length + complexStart.length <= targetLength - 2) {
                        word += complexStart;
                        i++; // Skip next character since complex syllable includes vowel
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

    generateComplexSyllableWord(targetLength, options) {
        let word = '';
        const maxAttempts = 50;
        let attempts = 0;

        // Start with a complex syllable
        if (Math.random() < 0.7) {
            const startSyllable = this.getRandomElement(this.spanishSyllables.complexSyllables.start);
            if (startSyllable.length <= targetLength - 3) {
                word = startSyllable;
            }
        }

        // Continue building with regular logic
        while (word.length < targetLength - 3 && attempts < maxAttempts) {
            attempts++;
            
            if (word.length === 0) {
                word += this.getRandomElement(this.spanishSyllables.consonants);
            } else {
                // Occasionally add complex middle syllables
                if (Math.random() < 0.3 && word.length < targetLength - 5) {
                    const middleSyllable = this.getRandomElement(this.spanishSyllables.complexSyllables.middle);
                    if (word.length + middleSyllable.length <= targetLength - 2) {
                        word += middleSyllable;
                        continue;
                    }
                }
                
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

    generateTraditionalWord(targetLength, options) {
        let word = '';
        const maxAttempts = 100;
        let attempts = 0;

        // Occasionally start with a word root for more natural feel
        if (targetLength >= 8 && Math.random() < 0.3) {
            const root = this.getRandomElement(this.spanishSyllables.wordRoots);
            if (root.length < targetLength - 3) {
                word = root;
            }
        }

        // Use existing generation logic
        while (word.length < targetLength - 2 && attempts < maxAttempts) {
            attempts++;
            
            if (word.length === 0) {
                if (Math.random() < 0.75) {
                    const initialConsonants = this.spanishSyllables.consonants.filter(c => 
                        !this.spanishSyllables.rareInitial.includes(c)
                    );
                    word += this.getRandomElement(initialConsonants);
                } else {
                    word += this.getRandomElement(this.spanishSyllables.vowels);
                }
            } else {
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

    addSpanishEnding(word, targetLength) {
        const availableSpace = targetLength - word.length - 2; // Reserve space for numbers/symbols
        if (availableSpace < 2) return word;

        const endingTypes = Object.keys(this.spanishSyllables.wordEndings);
        const selectedType = this.getRandomElement(endingTypes);
        const endings = this.spanishSyllables.wordEndings[selectedType];
        
        const validEndings = endings.filter(ending => ending.length <= availableSpace);
        if (validEndings.length === 0) return word;

        const selectedEnding = this.getRandomElement(validEndings);
        
        // Remove conflicting last vowel if ending starts with vowel
        const endingStartsWithVowel = this.spanishSyllables.vowels.includes(selectedEnding[0]);
        const wordEndsWithVowel = this.spanishSyllables.vowels.includes(word[word.length - 1]);
        
        if (endingStartsWithVowel && wordEndsWithVowel) {
            word = word.slice(0, -1); // Remove last vowel to avoid repetition
        }

        return word + selectedEnding;
    }

    generatePassword() {
        const length = parseInt(this.passwordLength.value);
        const options = {
            includeUppercase: this.includeUppercase.checked,
            includeLowercase: this.includeLowercase.checked,
            includeNumbers: this.includeNumbers.checked,
            includeSymbols: this.includeSymbols.checked,
            useComplexSyllables: this.useComplexSyllables?.checked || false,
            capitalizeFirst: this.capitalizeFirst?.checked || true,
            addEndings: this.addEndings?.checked || false,
            useRhythm: this.useRhythm?.checked || false
        };

        // Calculate space allocation
        const securityCharsNeeded = (options.includeNumbers ? 2 : 0) + (options.includeSymbols ? 1 : 0);
        const baseWordLength = Math.max(4, length - securityCharsNeeded);
        
        // Generate Spanish word with advanced options
        let readableWord = this.generateSpanishWord(baseWordLength);
        
        // Apply capitalization based on user preference
        if (options.includeUppercase) {
            if (options.capitalizeFirst) {
                // Only capitalize first letter for readability
                readableWord = readableWord.charAt(0).toUpperCase() + readableWord.slice(1);
            } else {
                // Random capitalization for more security
                readableWord = this.applyRandomCapitalization(readableWord);
            }
        }

        // Apply selective leet speak
        if (Math.random() < 0.3) {
            readableWord = this.applyReadableLeetSpeak(readableWord, 1);
        }

        // Build final password
        let password = readableWord;

        // Add security characters
        if (options.includeNumbers) {
            const numbers = this.generateMeaningfulNumbers();
            password = this.insertSecurityChars(password, numbers, length);
        }

        if (options.includeSymbols) {
            const symbol = this.getRandomElement(['!', '@', '#', '$', '%', '&', '*']);
            password = this.insertSecurityChars(password, symbol, length);
        }

        // Adjust to exact length
        password = this.adjustToExactLength(password, length, readableWord);

        const strengthScore = this.calculateStrength(password);
        const phoneticAnalysis = this.analyzePhoneticCharacteristics(password, readableWord);

        this.displayGeneratedPassword(password, strengthScore, phoneticAnalysis);
    }

    applyRandomCapitalization(word) {
        let result = word.toLowerCase();
        const positions = [];
        
        // Always capitalize first letter
        positions.push(0);
        
        // Add 1-2 more random positions
        const additionalCaps = Math.floor(Math.random() * 2) + 1;
        for (let i = 0; i < additionalCaps && positions.length < Math.min(3, result.length); i++) {
            let pos;
            do {
                pos = Math.floor(Math.random() * result.length);
            } while (positions.includes(pos));
            positions.push(pos);
        }
        
        // Apply capitalization
        positions.forEach(pos => {
            if (pos < result.length) {
                result = result.substring(0, pos) + result.charAt(pos).toUpperCase() + result.substring(pos + 1);
            }
        });
        
        return result;
    }

    generateMeaningfulNumbers() {
        const patterns = [
            () => Math.floor(Math.random() * 100).toString().padStart(2, '0'), // 00-99
            () => (new Date().getFullYear() - Math.floor(Math.random() * 30)).toString().slice(-2), // Recent years
            () => this.generateRandomTwoDigits(), // Random 2 digits avoiding patterns
            () => this.generateRandomThreeDigits(), // Random 3 digits avoiding patterns
            () => this.generateMixedNumbers() // Mixed single digits
        ];
        
        const pattern = this.getRandomElement(patterns);
        return pattern();
    }

    generateRandomTwoDigits() {
        let first, second;
        do {
            first = Math.floor(Math.random() * 9) + 1; // 1-9
            second = Math.floor(Math.random() * 10); // 0-9
        } while (
            first === second || // Avoid repeating digits (11, 22, etc.)
            Math.abs(first - second) === 1 || // Avoid sequential (12, 23, etc.)
            (first === 1 && second === 0) // Avoid 10 (too predictable)
        );
        
        return first.toString() + second.toString();
    }

    generateRandomThreeDigits() {
        let first, second, third;
        let attempts = 0;
        const maxAttempts = 20;
        
        do {
            first = Math.floor(Math.random() * 9) + 1; // 1-9
            second = Math.floor(Math.random() * 10); // 0-9
            third = Math.floor(Math.random() * 10); // 0-9
            attempts++;
        } while (
            attempts < maxAttempts && (
                first === second && second === third || // Avoid all same (111, 222, etc.)
                (first === second || second === third || first === third) || // Avoid any repeating pairs
                this.isSequential([first, second, third]) || // Avoid sequential patterns
                this.isPredictablePattern([first, second, third]) // Avoid other predictable patterns
            )
        );
        
        return first.toString() + second.toString() + third.toString();
    }

    generateMixedNumbers() {
        // Generate 2-3 separate single digits with good spacing
        const count = Math.floor(Math.random() * 2) + 2; // 2-3 digits
        const usedDigits = new Set();
        let result = '';
        
        for (let i = 0; i < count; i++) {
            let digit;
            let attempts = 0;
            
            do {
                digit = Math.floor(Math.random() * 10);
                attempts++;
            } while (usedDigits.has(digit) && attempts < 10);
            
            usedDigits.add(digit);
            result += digit.toString();
        }
        
        return result;
    }

    getNextValidCharacters(currentWord, targetLength) {
        const lastChar = currentWord[currentWord.length - 1];
        const secondLastChar = currentWord.length > 1 ? currentWord[currentWord.length - 2] : '';
        const isLastVowel = this.spanishSyllables.vowels.includes(lastChar);
        
        if (isLastVowel) {
            // After vowel, we can add:
            // 1. Single consonant
            // 2. Valid consonant cluster (br, cr, etc.)
            // 3. Special combinations (ch, ll, rr, ñ)
            
            const options = [];
            
            // Add single consonants (avoiding invalid combinations)
            this.spanishSyllables.consonants.forEach(consonant => {
                if (!this.isInvalidCombination(lastChar + consonant)) {
                    options.push(consonant);
                }
            });
            
            // Add valid clusters if there's enough space
            if (currentWord.length < targetLength - 4) {
                this.spanishSyllables.validClusters.forEach(cluster => {
                    if (!this.isInvalidCombination(lastChar + cluster[0])) {
                        options.push(cluster);
                    }
                });
            }
            
            // Add special Spanish combinations
            if (currentWord.length < targetLength - 3) {
                ['ch', 'll', 'ñ'].forEach(special => {
                    if (!this.isInvalidCombination(lastChar + special[0])) {
                        options.push(special);
                    }
                });
            }
            
            return options.length > 0 ? this.getRandomElement(options) : null;
            
        } else {
            // After consonant, we typically add a vowel
            // But we can also add 'r' or 'l' if the consonant allows it
            
            if (Math.random() < 0.8) {
                // Most commonly, add a vowel
                return this.getSafeVowel(currentWord);
            } else {
                // Sometimes add 'r' or 'l' if valid
                if (this.spanishSyllables.canPrecedeR.includes(lastChar) && Math.random() < 0.5) {
                    return 'r';
                } else if (this.spanishSyllables.canPrecedeL.includes(lastChar)) {
                    return 'l';
                } else {
                    return this.getSafeVowel(currentWord);
                }
            }
        }
    }

    isInvalidCombination(combination) {
        return this.spanishSyllables.invalidCombinations.includes(combination.toLowerCase());
    }

    getSafeConsonant(currentWord) {
        const lastChar = currentWord[currentWord.length - 1];
        const availableConsonants = this.spanishSyllables.consonants.filter(consonant => {
            // Don't repeat the same consonant unless it's naturally allowed in Spanish
            if (consonant === lastChar) {
                return this.spanishSyllables.naturalDoubles.includes(consonant + consonant);
            }
            
            // Avoid invalid combinations
            if (this.isInvalidCombination(lastChar + consonant)) {
                return false;
            }
            
            return true;
        });
        
        return availableConsonants.length > 0 ? 
            this.getRandomElement(availableConsonants) : 
            this.getRandomElement(['n', 'r', 's', 't']); // Safe fallbacks
    }

    getSafeVowel(currentWord) {
        const lastChar = currentWord[currentWord.length - 1];
        const availableVowels = this.spanishSyllables.vowels.filter(vowel => {
            // Avoid repeating the same vowel consecutively (except 'aa' in some cases)
            if (vowel === lastChar) {
                return vowel === 'a' && Math.random() < 0.1; // Very rare exception
            }
            return true;
        });
        
        return availableVowels.length > 0 ? 
            this.getRandomElement(availableVowels) : 
            this.getRandomElement(['a', 'e', 'o']); // Most common Spanish vowels
    }

    async logout() {
        localStorage.removeItem('auth_token');
        window.location.href = 'index.html';
    }

    toggleEducationalSection() {
        if (this.educationalContent) {
            if (this.educationalContent.classList.contains('hidden')) {
                this.educationalContent.classList.remove('hidden');
                this.toggleEducationBtn.textContent = '📚 Ocultar explicación técnica';
            } else {
                this.educationalContent.classList.add('hidden');
                this.toggleEducationBtn.textContent = '📚 ¿Cómo funciona esta aplicación?';
            }
        }
    }

    getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    copyToClipboard(text, message) {
        navigator.clipboard.writeText(text).then(() => {
            this.showToast(message, 'success');
        }).catch(() => {
            this.showToast('Error al copiar al portapapeles', 'error');
        });
    }

    showToast(message, type = 'info') {
        if (this.toast && this.toastMessage) {
            this.toastMessage.textContent = message;
            this.toast.className = `toast ${type}`; // Asegura que las clases base y de tipo se apliquen
            this.toast.classList.remove('hidden');

            // Clear any existing timeouts to prevent premature hiding
            if (this.toastTimer) {
                clearTimeout(this.toastTimer);
            }

            this.toastTimer = setTimeout(() => {
                this.toast.classList.add('hidden');
            }, 3000);
        } else {
            // Fallback si los elementos del toast no están disponibles
            console.log(`Toast (${type}):`, message);
            if (type === 'error') console.error(`Toast (error): ${message}`);
        }
    }

    async deletePassword(passwordId) {
        if (!confirm('¿Estás seguro de que quieres eliminar esta contraseña?')) {
            return;
        }

        try {
            console.log('🗑️ Deleting password ID:', passwordId);
            if (!passwordId) {
                console.error('❌ Cannot delete password: ID is undefined.');
                this.showToast('Error: ID de contraseña no válido.', 'error');
                return;
            }

            const response = await fetch(`${this.apiBase}/passwords/${passwordId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                this.showToast('Contraseña eliminada correctamente', 'success');
                this.loadSavedPasswords(); // Recargar la lista
            } else {
                const errorData = await response.json().catch(() => ({ error: 'Error desconocido al eliminar' }));
                console.error('❌ Delete error:', response.status, errorData);
                this.showToast(`Error al eliminar: ${errorData.error || response.status}`, 'error');
            }
        } catch (error) {
            console.error('❌ Network error deleting password:', error);
            this.showToast('Error de conexión al eliminar contraseña', 'error');
        }
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOMContentLoaded: Initializing ReadablePasswordManager...');
    new ReadablePasswordManager();
});
