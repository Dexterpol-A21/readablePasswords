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
        
        this.initializeElements();
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
    }

    bindEvents() {
        // Auth events
        this.logoutBtn.addEventListener('click', () => this.logout());
        
        // Generator events
        this.passwordLength.addEventListener('input', () => this.updateLengthDisplay());
        this.generateBtn.addEventListener('click', () => this.generatePassword());
        this.copyPassword.addEventListener('click', () => this.copyToClipboard(this.generatedPassword.textContent, 'Contraseña copiada'));
        this.savePassword.addEventListener('click', () => this.saveCurrentPassword());
        
        // Saved passwords events
        this.refreshPasswords.addEventListener('click', () => this.loadSavedPasswords());
        this.searchInput.addEventListener('input', () => this.filterPasswords());

        // Educational section events
        if (this.toggleEducationBtn) {
            this.toggleEducationBtn.addEventListener('click', () => this.toggleEducationalSection());
        }
    }

    async loadSavedPasswords() {
        try {
            console.log('🔄 Loading saved passwords...');
            console.log('📡 API URL:', this.apiBase);
            console.log('🔑 Token present:', !!this.token);
            
            const response = await fetch(`${this.apiBase}/passwords`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('📊 Response status:', response.status);
            console.log('📋 Response headers:', Object.fromEntries(response.headers.entries()));

            if (response.ok) {
                const data = await response.json();
                this.savedPasswords = data;
                console.log('✅ Contraseñas cargadas:', this.savedPasswords.length);
                this.displaySavedPasswords();
            } else {
                const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                console.error('❌ Load error:', response.status, errorData);
                this.showToast(`Error del servidor: ${errorData.error || response.status}`, 'error');
            }
        } catch (error) {
            console.error('❌ Network error loading passwords:', error);
            this.showToast('Error de conexión con el servidor. Verifica que el backend esté funcionando.', 'error');
            
            // Show empty state instead of error state
            this.displaySavedPasswords([]);
        }
    }

    displaySavedPasswords(passwords = this.savedPasswords) {
        if (!this.passwordsList) {
            console.error('❌ passwordsList element not found');
            return;
        }

        this.passwordsList.innerHTML = '';

        if (passwords.length === 0) {
            this.passwordsList.innerHTML = '<div class="loading">No hay contraseñas guardadas</div>';
            return;
        }

        passwords.forEach((password, index) => {
            try {
                const item = this.createPasswordItem(password);
                this.passwordsList.appendChild(item);
            } catch (error) {
                console.error(`Error creating password item ${index}:`, error);
            }
        });
    }

    createPasswordItem(password) {
        if (!this.passwordItemTemplate) {
            console.error('❌ passwordItemTemplate not found');
            return document.createElement('div');
        }

        const template = this.passwordItemTemplate.content.cloneNode(true);
        const item = template.querySelector('.password-item');
        
        // Set data safely
        const labelElement = item.querySelector('.password-label');
        const valueElement = item.querySelector('.field-value');
        const dateElement = item.querySelector('.created-date');
        
        if (labelElement) labelElement.textContent = password.label || 'Sin etiqueta';
        if (valueElement) valueElement.textContent = '••••••••';
        if (dateElement) dateElement.textContent = new Date(password.createdAt).toLocaleDateString();
        
        // Set strength badge
        const strengthBadge = item.querySelector('.strength-badge');
        if (strengthBadge) {
            const score = password.strengthScore || 0;
            if (score >= 80) {
                strengthBadge.textContent = 'Muy fuerte';
                strengthBadge.style.background = '#4caf50';
                strengthBadge.style.color = 'white';
            } else if (score >= 60) {
                strengthBadge.textContent = 'Fuerte';
                strengthBadge.style.background = '#ff9800';
                strengthBadge.style.color = 'white';
            } else if (score >= 40) {
                strengthBadge.textContent = 'Media';
                strengthBadge.style.background = '#ffeb3b';
                strengthBadge.style.color = 'black';
            } else {
                strengthBadge.textContent = 'Débil';
                strengthBadge.style.background = '#f44336';
                strengthBadge.style.color = 'white';
            }
        }

        // Bind events safely
        const copyBtn = item.querySelector('.copy-password-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                this.copyToClipboard(password.password, 'Contraseña copiada');
            });
        }
        
        const toggleBtn = item.querySelector('.toggle-visibility');
        if (toggleBtn && valueElement) {
            toggleBtn.addEventListener('click', (e) => {
                if (valueElement.textContent === '••••••••') {
                    valueElement.textContent = password.password;
                    e.target.textContent = '🙈';
                } else {
                    valueElement.textContent = '••••••••';
                    e.target.textContent = '👁️';
                }
            });
        }
        
        const deleteBtn = item.querySelector('.delete-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                this.deletePassword(password.id);
            });
        }

        return item;
    }

    async checkAuth() {
        if (!this.token) {
            console.log('❌ No token found, redirecting to login');
            window.location.href = 'index.html';
            return;
        }

        try {
            console.log('🔐 Checking authentication...');
            
            const response = await fetch(`${this.apiBase}/passwords`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('📊 Auth check status:', response.status);

            if (response.ok) {
                // Decode user info from token
                const payload = JSON.parse(atob(this.token.split('.')[1]));
                this.currentUser = {
                    id: payload.userId,
                    username: payload.username,
                    email: payload.email
                };
                
                if (this.usernameSpan) {
                    this.usernameSpan.textContent = this.currentUser.username;
                }
                
                console.log('✅ User authenticated:', this.currentUser.username);
                this.loadSavedPasswords();
            } else {
                console.log('❌ Authentication failed, logging out');
                this.logout();
            }
        } catch (error) {
            console.error('❌ Auth check error:', error);
            this.showToast('Error de conexión con el servidor', 'error');
            
            // Don't logout immediately on network errors in production
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

    insertSecurityChars(basePassword, securityChars, targetLength) {
        if (basePassword.length + securityChars.length > targetLength) {
            return basePassword; // Don't add if it would exceed length
        }

        // Prefer adding at the end, or at syllable boundaries for readability
        const insertPositions = [
            basePassword.length, // End
            Math.floor(basePassword.length * 0.6), // After 60% of the word
            Math.floor(basePassword.length * 0.8), // After 80% of the word
        ];

        // Choose position that maintains readability
        let bestPosition = insertPositions[0]; // Default to end
        
        // If adding at end would exceed length, try middle positions
        if (basePassword.length + securityChars.length <= targetLength) {
            if (Math.random() < 0.7) {
                bestPosition = basePassword.length; // 70% chance at end
            } else {
                bestPosition = this.getRandomElement(insertPositions.slice(1));
            }
        }

        return basePassword.substring(0, bestPosition) + securityChars + basePassword.substring(bestPosition);
    }

    adjustToExactLength(password, targetLength, originalWord) {
        if (password.length === targetLength) {
            return password;
        }

        if (password.length > targetLength) {
            // Trim from the end, but try to preserve the readable part
            const readablePartLength = Math.min(originalWord.length, targetLength - 2);
            return password.substring(0, readablePartLength) + password.substring(password.length - (targetLength - readablePartLength));
        }

        // If too short, add vowels or simple numbers to maintain readability
        while (password.length < targetLength) {
            if (Math.random() < 0.6) {
                // Add vowels for readability
                password += this.getSafeVowel(password);
            } else {
                // Add single digits
                password += Math.floor(Math.random() * 10);
            }
        }

        return password.substring(0, targetLength);
    }

    applyReadableLeetSpeak(word, maxReplacements) {
        let result = word.toLowerCase();
        let replacements = 0;
        
        // Only use the most readable substitutions
        const readableReplacements = {
            'a': ['4'], // Most recognizable
            'e': ['3'], // Very common
            'o': ['0'], // Universally understood
            's': ['5']  // Common and readable
        };
        
        for (let i = 0; i < result.length && replacements < maxReplacements; i++) {
            const char = result[i];
            if (readableReplacements[char] && Math.random() < 0.4) {
                // Don't replace if it's part of a natural double letter or creates invalid combination
                const nextChar = result[i + 1];
                const prevChar = result[i - 1];
                
                if ((char === nextChar && this.spanishSyllables.naturalDoubles.includes(char + nextChar)) ||
                    (char === prevChar && this.spanishSyllables.naturalDoubles.includes(prevChar + char))) {
                    continue;
                }
                
                const replacement = readableReplacements[char][0]; // Use first (most readable) option
                result = result.substring(0, i) + replacement + result.substring(i + 1);
                replacements++;
            }
        }
        
        return result;
    }

    analyzePhoneticCharacteristics(password, readableWord) {
        // Count syllables in the readable part
        const syllables = this.countSyllables(readableWord);
        
        // Analyze pronounceability based on Spanish phonetic rules
        const pronounceable = this.isPronounceableInSpanish(readableWord);
        
        // Calculate memorability score based on various factors
        const memorability = this.calculateMemorability(password, readableWord, syllables);
        
        return {
            syllables,
            pronounceable,
            length: password.length,
            memorability
        };
    }

    countSyllables(word) {
        // Remove numbers and symbols for syllable counting
        const cleanWord = word.replace(/[^a-záéíóúñü]/gi, '');
        if (!cleanWord) return 0;
        
        // Spanish syllable counting logic
        let syllables = 0;
        const vowels = 'aeiouáéíóúü';
        let previousWasVowel = false;
        
        for (let i = 0; i < cleanWord.length; i++) {
            const char = cleanWord[i].toLowerCase();
            const isVowel = vowels.includes(char);
            
            if (isVowel && !previousWasVowel) {
                syllables++;
            }
            
            // Handle diphthongs and hiatus in Spanish
            if (isVowel && previousWasVowel) {
                const prevChar = cleanWord[i - 1].toLowerCase();
                // Strong vowels (a, e, o) + weak vowels (i, u) = diphthong (no extra syllable)
                // Strong vowel + strong vowel = hiatus (extra syllable)
                const strongVowels = 'aeoáéó';
                const weakVowels = 'iuíú';
                
                if (strongVowels.includes(prevChar) && strongVowels.includes(char)) {
                    syllables++; // Hiatus
                }
                // Diphthongs don't add extra syllables
            }
            
            previousWasVowel = isVowel;
        }
        
        return Math.max(1, syllables); // At least 1 syllable
    }

    isPronounceableInSpanish(word) {
        // Remove numbers and symbols for pronunciation analysis
        const cleanWord = word.replace(/[^a-záéíóúñü]/gi, '');
        if (!cleanWord) return true; // Numbers/symbols are pronounceable individually
        
        // Check for Spanish phonetic violations
        const violations = [
            /[bcdfghjklmnpqrstvwxyz]{4,}/i, // Too many consecutive consonants
            /[aeiouáéíóúü]{4,}/i, // Too many consecutive vowels
            /^[xyz]/i, // Starts with difficult consonants
            /[qw][^u]/i, // Q not followed by U, W in wrong context
        ];
        
        const hasViolations = violations.some(pattern => pattern.test(cleanWord));
        return !hasViolations;
    }

    isSequential(digits) {
        // Check for ascending sequences (123, 234, etc.)
        for (let i = 0; i < digits.length - 1; i++) {
            if (digits[i + 1] !== digits[i] + 1) {
                return false;
            }
        }
        return true;
    }

    isPredictablePattern(digits) {
        const str = digits.join('');
        const predictablePatterns = [
            '123', '234', '345', '456', '567', '678', '789', // Ascending
            '321', '432', '543', '654', '765', '876', '987', // Descending
            '147', '258', '369', // Keyboard patterns
            '159', '357', '246', '468', // Other patterns
            '100', '200', '300', '400', '500', '600', '700', '800', '900', // Round numbers
            '101', '202', '303', '404', '505', '606', '707', '808', '909'  // Palindromes
        ];
        
        return predictablePatterns.includes(str);
    }

    calculateMemorability(password, readableWord, syllables) {
        let score = 0;
        
        // Length factor
        if (password.length <= 12) score += 30;
        else if (password.length <= 16) score += 20;
        else score += 10;
        
        // Syllable factor
        if (syllables >= 2 && syllables <= 4) score += 25;
        else if (syllables >= 1 && syllables <= 6) score += 15;
        else score += 5;
        
        // Readable word proportion
        const readableRatio = readableWord.length / password.length;
        if (readableRatio >= 0.7) score += 25;
        else if (readableRatio >= 0.5) score += 15;
        else score += 5;
        
        // Pattern recognition bonus - good patterns only
        const hasGoodPattern = /^[a-z]+\d+[!@#$%&*]?$/i.test(password);
        if (hasGoodPattern) score += 15;
        
        // Complex syllables bonus
        const hasComplexSyllables = /(?:bra|cla|tri|pro|gra|fra|dra)/i.test(readableWord);
        if (hasComplexSyllables) score += 10;
        
        // Spanish endings bonus
        const hasSpanishEnding = /(?:ar|er|ir|ando|mente|oso|iva)$/i.test(readableWord);
        if (hasSpanishEnding) score += 10;
        
        // Penalty for predictable number patterns
        const numbers = password.match(/\d+/g);
        if (numbers) {
            const hasSequentialNumbers = numbers.some(num => this.isSequential(num.split('').map(Number)));
            const hasRepeatingNumbers = numbers.some(num => /(\d)\1+/.test(num));
            const hasPredictableNumbers = numbers.some(num => this.isPredictablePattern(num.split('').map(Number)));
            
            if (hasSequentialNumbers || hasRepeatingNumbers || hasPredictableNumbers) {
                score -= 15; // Penalty for predictable patterns
            }
        }
        
        // Convert to descriptive level
        if (score >= 85) return 'Muy Alta';
        else if (score >= 65) return 'Alta';
        else if (score >= 45) return 'Media';
        else return 'Baja';
    }

    calculateStrength(password) {
        let score = 0;
        
        // Length scoring
        if (password.length >= 12) score += 25;
        else if (password.length >= 8) score += 15;
        else score += 5;

        // Character variety
        if (/[a-z]/.test(password)) score += 15;
        if (/[A-Z]/.test(password)) score += 15;
        if (/\d/.test(password)) score += 15;
        if (/[^a-zA-Z0-9]/.test(password)) score += 20;

        // Patterns and complexity
        if (!/(.)\1{2,}/.test(password)) score += 10; // No repeated characters

        // Check for weak number patterns and penalize
        const numbers = password.match(/\d+/g);
        if (numbers) {
            const hasWeakPatterns = numbers.some(num => {
                return this.isSequential(num.split('').map(Number)) || 
                       /(\d)\1+/.test(num) || 
                       this.isPredictablePattern(num.split('').map(Number));
            });
            
            if (hasWeakPatterns) {
                score -= 20; // Significant penalty for weak number patterns
            }
        }

        // Bonus for good entropy in numbers
        if (numbers && numbers.length > 0) {
            const allNumbers = numbers.join('');
            const uniqueDigits = new Set(allNumbers.split('')).size;
            if (uniqueDigits >= 2 && allNumbers.length >= 2) {
                score += 5; // Small bonus for diverse digits
            }
        }

        return Math.min(Math.max(score, 0), 100); // Ensure score is between 0-100
    }

    displayGeneratedPassword(password, strengthScore, phoneticAnalysis) {
        this.generatedPassword.textContent = password;
        
        // Update phonetic characteristics
        this.syllableCount.textContent = phoneticAnalysis.syllables;
        this.pronounceable.textContent = phoneticAnalysis.pronounceable ? 'Sí' : 'No';
        this.passwordLengthDisplay.textContent = phoneticAnalysis.length;
        this.memorability.textContent = phoneticAnalysis.memorability;
        
        // Apply color coding for memorability
        this.memorability.className = 'char-value';
        if (phoneticAnalysis.memorability === 'Muy Alta' || phoneticAnalysis.memorability === 'Alta') {
            this.memorability.classList.add('high');
        } else if (phoneticAnalysis.memorability === 'Media') {
            this.memorability.classList.add('medium');
        } else {
            this.memorability.classList.add('low');
        }
        
        // Apply color coding for pronounceability
        this.pronounceable.className = 'char-value';
        if (phoneticAnalysis.pronounceable) {
            this.pronounceable.classList.add('high');
        } else {
            this.pronounceable.classList.add('low');
        }
        
        // Update strength meter
        this.strengthFill.style.width = `${strengthScore}%`;
        if (strengthScore >= 80) {
            this.strengthFill.style.background = '#4caf50';
            this.strengthText.textContent = `Muy fuerte (${strengthScore}%)`;
        } else if (strengthScore >= 60) {
            this.strengthFill.style.background = '#ff9800';
            this.strengthText.textContent = `Fuerte (${strengthScore}%)`;
        } else if (strengthScore >= 40) {
            this.strengthFill.style.background = '#ffeb3b';
            this.strengthText.textContent = `Media (${strengthScore}%)`;
        } else {
            this.strengthFill.style.background = '#f44336';
            this.strengthText.textContent = `Débil (${strengthScore}%)`;
        }

        this.passwordResult.classList.remove('hidden');
    }

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
                const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                console.error('❌ Save error:', response.status, errorData);
                this.showToast(errorData.error || `Error del servidor (${response.status})`, 'error');
            }
        } catch (error) {
            console.error('❌ Network error saving:', error);
            this.showToast('Error de conexión con el servidor', 'error');
        } finally {
            this.savePassword.disabled = false;
            this.savePassword.textContent = '💾 Guardar Contraseña';
        }
    }

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

    showToast(message, type = 'info') {
        this.toastMessage.textContent = message;
        this.toast.className = `toast ${type}`;
        this.toast.classList.remove('hidden');

        setTimeout(() => {
            this.toast.classList.add('hidden');
        }, 3000);
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing ReadablePasswordManager...');
    new ReadablePasswordManager();
});
