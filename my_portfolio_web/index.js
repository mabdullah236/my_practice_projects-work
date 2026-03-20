 // --- EMAILJS CONFIGURATION (PLACEHOLDERS) ---
        // IMPORTANT: All three keys are now set using user-provided values.
        const SERVICE_ID = 'service_m9yowd7'; 
        const TEMPLATE_ID = 'template_g9refdo'; 
        const PUBLIC_KEY = 'zrjj0krqcIgDqZ_1B'; 
        
        // --- GEMINI API CONFIGURATION ---
        const apiKey = "";
        const TEXT_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
        const TTS_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;
        
        let originalBioText = "";
        let aboutTextObserver; // For observing About Section visibility

        // --- GENERAL UTILITY FUNCTIONS ---
        
        /** Converts base64 PCM data to ArrayBuffer. */
        function base64ToArrayBuffer(base64) {
            const binaryString = atob(base64);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            return bytes.buffer;
        }

        /** Writes a string to the DataView at a specific offset. */
        function writeString(view, offset, str) {
            for (let i = 0; i < str.length; i++) {
                view.setUint8(offset + i, str.charCodeAt(i));
            }
        }

        /** Converts 16-bit PCM audio data to a WAV Blob. */
        function pcmToWav(pcm16, sampleRate = 24000) {
            const numChannels = 1;
            const bytesPerSample = 2; // 16-bit PCM

            // Create WAV header
            const buffer = new ArrayBuffer(44 + pcm16.byteLength);
            const view = new DataView(buffer);

            let offset = 0;
            writeString(view, offset, 'RIFF'); offset += 4;
            view.setUint32(offset, 36 + pcm16.byteLength, true); offset += 4;
            writeString(view, offset, 'WAVE'); offset += 4;
            writeString(view, offset, 'fmt '); offset += 4;
            view.setUint32(offset, 16, true); offset += 4; // Format chunk length
            view.setUint16(offset, 1, true); offset += 2;  // Sample format (1 = PCM)
            view.setUint16(offset, numChannels, true); offset += 2;
            view.setUint32(offset, sampleRate, true); offset += 4;
            view.setUint32(offset, sampleRate * numChannels * bytesPerSample, true); offset += 4; // Byte rate
            view.setUint16(offset, numChannels * bytesPerSample, true); offset += 2; // Block align
            view.setUint16(offset, bytesPerSample * 8, true); offset += 2; // Bits per sample
            writeString(view, offset, 'data'); offset += 4;
            view.setUint32(offset, pcm16.byteLength, true); offset += 4; // Data chunk length

            // Write PCM data
            const pcmDataView = new DataView(pcm16.buffer);
            for (let i = 0; i < pcm16.byteLength; i++) {
                view.setUint8(offset + i, pcmDataView.getUint8(i), false);
            }

            return new Blob([buffer], { type: 'audio/wav' });
        }
        
        /** Fetches with exponential backoff for reliability. */
        async function exponentialBackoffFetch(url, options, maxRetries = 5) {
            for (let i = 0; i < maxRetries; i++) {
                try {
                    const response = await fetch(url, options);
                    if (!response.ok) {
                        if (response.status === 429 || response.status >= 500) {
                            throw new Error(`Server error: ${response.status}. Retrying...`);
                        }
                        return response;
                    }
                    return response;
                } catch (error) {
                    if (i === maxRetries - 1) {
                        console.error("Fetch failed after max retries:", error);
                        throw error;
                    }
                    const delay = Math.pow(2, i) * 1000 + Math.random() * 1000;
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }

        // --- GEMINI LLM TEXT GENERATION FUNCTION ---
        async function generateNewBio(tone) {
            const bioDisplayContainer = document.getElementById('bio-display-text');
            const loadingSpinner = document.getElementById('loading-spinner');
            const loadingMessage = document.getElementById('loading-message');
            const buttons = document.querySelectorAll('.llm-button');

            loadingMessage.textContent = `Generating '${tone}' bio...`;
            loadingSpinner.classList.remove('hidden');
            buttons.forEach(btn => btn.disabled = true);
            
            // System instruction guides the model's behavior
            const systemPrompt = `You are a professional copywriter. Your task is to rewrite the provided developer biography. You must strictly adopt a '${tone}' tone. The rewritten bio must be a single cohesive paragraph and should not include any headings or bullet points. Preserve the core technical facts about their skills (React, Angular, Node.js, WebGL, three.js).`;
            const userQuery = `Rewrite the following developer bio in a ${tone} tone:\n\n${originalBioText}`;

            const payload = {
                contents: [{ parts: [{ text: userQuery }] }],
                systemInstruction: { parts: [{ text: systemPrompt }] },
            };

            try {
                const response = await exponentialBackoffFetch(TEXT_API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const result = await response.json();
                const newBio = result.candidates?.[0]?.content?.parts?.[0]?.text;

                if (newBio) {
                    // Update originalBioText and re-animate the new text
                    originalBioText = newBio.trim().replace(/(\r\n|\n|\r)/gm, ' ').replace(/\s\s+/g, ' ');
                    animateAboutText(originalBioText); 
                } else {
                    bioDisplayContainer.textContent = "Error: Could not generate content. Please try again.";
                }

            } catch (error) {
                console.error("Gemini Bio Generation Error:", error);
                bioDisplayContainer.textContent = `An error occurred during generation: ${error.message}.`;
            } finally {
                loadingSpinner.classList.add('hidden');
                buttons.forEach(btn => btn.disabled = false);
            }
        }


        // --- GEMINI TTS GENERATION FUNCTION ---
        let audioPlayer = null;

        async function readBioAloud() {
            const bioText = document.getElementById('bio-display-text').textContent.trim(); // Read from the displayed text
            const loadingSpinner = document.getElementById('loading-spinner');
            const loadingMessage = document.getElementById('loading-message');
            const ttsButton = document.getElementById('btn-tts');

            if (!bioText) return;

            // Stop existing audio if playing
            if (audioPlayer) {
                audioPlayer.pause();
                audioPlayer.currentTime = 0;
            }

            loadingMessage.textContent = "Synthesizing audio...";
            loadingSpinner.classList.remove('hidden');
            ttsButton.disabled = true;

            const payload = {
                contents: [{
                    parts: [{ text: `Say in a clear, professional tone: ${bioText}` }]
                }],
                generationConfig: {
                    responseModalities: ["AUDIO"],
                    speechConfig: {
                        voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } }
                    }
                },
            };

            try {
                const response = await exponentialBackoffFetch(TTS_API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const result = await response.json();
                const part = result?.candidates?.[0]?.content?.parts?.[0];
                const audioData = part?.inlineData?.data;
                const mimeType = part?.inlineData?.mimeType;

                if (audioData && mimeType && mimeType.startsWith("audio/L16")) {
                    const sampleRateMatch = mimeType.match(/rate=(\d+)/);
                    const sampleRate = sampleRateMatch ? parseInt(sampleRateMatch[1], 10) : 24000;
                    
                    const pcmData = base64ToArrayBuffer(audioData);
                    const pcm16 = new Int16Array(pcmData);
                    const wavBlob = pcmToWav(pcm16, sampleRate);
                    const audioUrl = URL.createObjectURL(wavBlob);
                    
                    audioPlayer = new Audio(audioUrl);
                    audioPlayer.play();

                    audioPlayer.onended = () => {
                        ttsButton.textContent = '🔊 Read Bio Aloud';
                        URL.revokeObjectURL(audioUrl);
                    };
                    ttsButton.textContent = '⏸️ Stop Reading';
                    ttsButton.onclick = () => {
                        audioPlayer.pause();
                        audioPlayer.currentTime = 0;
                        ttsButton.textContent = '🔊 Read Bio Aloud';
                        ttsButton.onclick = readBioAloud;
                    };

                } else {
                    console.error("Invalid audio response structure or format.");
                }

            } catch (error) {
                console.error("Gemini TTS Error:", error);
            } finally {
                loadingSpinner.classList.add('hidden');
                ttsButton.disabled = false;
            }
        }


        // --- THREE.JS 3D ANIMATION SETUP (Main Scene) ---
        let scene, camera, renderer, geometry, material, mesh, container;

        function initThreeJS() {
            container = document.getElementById('three-canvas');

            // 1. Scene
            scene = new THREE.Scene();
            scene.fog = new THREE.Fog(0x0f172a, 1, 15); // Add a subtle fog effect

            // 2. Camera
            camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
            camera.position.z = 5;

            // 3. Renderer
            renderer = new THREE.WebGLRenderer({ antialias: true, canvas: container, alpha: true });
            renderer.setSize(container.clientWidth, container.clientHeight);
            renderer.setPixelRatio(window.devicePixelRatio);

            // 4. Geometry and Material (Abstract Rotating Object)
            geometry = new THREE.IcosahedronGeometry(2, 0); // Using Icosahedron for abstract look
            material = new THREE.MeshPhongMaterial({
                color: 0x3b82f6, // Accent Neon Blue
                emissive: 0x0000ff,
                emissiveIntensity: 0.1,
                shininess: 10,
                specular: 0x5a86ff,
                wireframe: true, // Wireframe for high-tech look
                transparent: true,
                opacity: 0.6
            });

            mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);

            // 5. Lighting
            const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
            scene.add(ambientLight);

            const pointLight1 = new THREE.PointLight(0x4f46e5, 2, 50); // Indigo
            pointLight1.position.set(5, 5, 5);
            scene.add(pointLight1);

            const pointLight2 = new THREE.PointLight(0x3b82f6, 1, 50); // Blue
            pointLight2.position.set(-5, -5, -5);
            scene.add(pointLight2);

            // Handle mouse interaction for subtle camera movement
            document.addEventListener('mousemove', onMouseMove);
        }

        function onMouseMove(event) {
            const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

            // Subtle camera rotation based on mouse position
            camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
            camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.05;
            camera.lookAt(scene.position);
        }

        // --- THREE.JS 3D ANIMATION SETUP (Profile Image) ---
        let profileScene, profileCamera, profileRenderer, profileMesh, profileTexture;

        function initProfileImage3D() {
            const container = document.getElementById('profile-image-container');
            const canvas = document.createElement('canvas');
            canvas.id = 'profile-image-canvas';
            container.appendChild(canvas);

            const size = 60; // Match container size
            
            profileScene = new THREE.Scene();
            profileCamera = new THREE.PerspectiveCamera(70, size / size, 0.1, 100);
            profileCamera.position.z = 1.5;

            profileRenderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
            profileRenderer.setSize(size, size);

            // Placeholder image texture (A simple solid color cube with a texture applied)
            const textureLoader = new THREE.TextureLoader();
            // Using a simple placeholder image: 60x60 dark blue with 'USER' text
            profileTexture = textureLoader.load(
                'https://drive.google.com/file/d/1thEWacT0u8duDxI-q5wdJAF7tYtv0vw-/view?usp=drive_link', 
                function(texture) {
                    // Success callback: texture is loaded
                    const profileGeometry = new THREE.BoxGeometry(1, 1, 1);
                    const profileMaterial = new THREE.MeshBasicMaterial({ map: texture });
                    profileMesh = new THREE.Mesh(profileGeometry, profileMaterial);
                    profileScene.add(profileMesh);
                },
                undefined, // Progress callback
                function(err) {
                    console.error('An error happened loading the profile image texture.', err);
                    // Fallback to basic colored cube if image fails
                    const profileGeometry = new THREE.BoxGeometry(1, 1, 1);
                    const profileMaterial = new THREE.MeshPhongMaterial({ color: 0x4f46e5 });
                    profileMesh = new THREE.Mesh(profileGeometry, profileMaterial);
                    profileScene.add(profileMesh);
                }
            );

            // Lighting for the profile cube
            const light = new THREE.AmbientLight(0xffffff, 0.5); 
            profileScene.add(light);
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
            directionalLight.position.set(1, 1, 1);
            profileScene.add(directionalLight);
        }


        // Animation Loop (Combined for efficiency)
        function animate() {
            requestAnimationFrame(animate);

            // --- Main Scene Animation ---
            if (mesh) {
                mesh.rotation.x += 0.001;
                mesh.rotation.y += 0.002;
            }
            const time = Date.now() * 0.0005;
            if (scene.children[1] && scene.children[2]) {
                scene.children[1].position.x = Math.sin(time * 0.7) * 5;
                scene.children[1].position.y = Math.cos(time * 0.5) * 5;
                scene.children[2].position.x = Math.cos(time * 0.3) * 7;
                scene.children[2].position.z = Math.sin(time * 0.9) * 7;
            }
            renderer.render(scene, camera);

            // --- Profile Image Animation ---
            if (profileMesh && profileRenderer) {
                profileMesh.rotation.x += 0.01;
                profileMesh.rotation.y += 0.005;
                profileRenderer.render(profileScene, profileCamera);
            }
        }

        // Handle Window Resize (Crucial for responsiveness)
        function onWindowResize() {
            const width = container.clientWidth;
            const height = container.clientHeight;

            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
            
            // Profile image canvas does not need resizing as it's fixed size
        }

        // --- Custom Hero Text Animation Function (Character-by-Character Typing & Drop-down) ---
        function animateHeroText() {
            const titleContainer = document.getElementById('hero-title');
            
            // Define the full text content including line break
            const fullText = "Hello, I'm Muhammad Abdullah \n Web Developer & Quality Assurance Analyst"; 
            
            titleContainer.innerHTML = ''; // Clear existing content
            let delay = 0;

            for (let i = 0; i < fullText.length; i++) {
                let char = fullText[i];
                
                // Handle line break manually
                if (char === '\n') {
                    const br = document.createElement('br');
                    titleContainer.appendChild(br);
                    continue; 
                }
                
                // Use a span for each character to control its individual animation
                const span = document.createElement('span');
                span.textContent = char === ' ' ? '\u00A0' : char; // Use non-breaking space for visibility of spaces
                span.className = `animated-char ${i < fullText.indexOf('\n') ? 'line-1' : 'line-2'}`;
                
                titleContainer.appendChild(span);
                
                // Trigger the animation after a small delay (80ms for slower typing)
                setTimeout(() => {
                    span.classList.add('visible');
                }, delay);
                
                // Increase delay for next character
                delay += 80; // Slowed down character typing speed (80ms)
            }
        }
        
        // --- Custom About Text Animation Function (Character-by-Character Zoom-in) ---
        function animateAboutText(text) {
            const container = document.getElementById('bio-display-text');
            container.innerHTML = ''; // Clear existing content
            let delay = 0;

            // Handle line breaks and spaces for structure and animation
            const formattedText = text.replace(/<br\s*\/?>/gi, '\n');
            
            for (let i = 0; i < formattedText.length; i++) {
                let char = formattedText[i];

                if (char === '\n') {
                    container.appendChild(document.createElement('br'));
                    continue;
                }
                
                const span = document.createElement('span');
                
                if (char === ' ' || char === '\u00A0') {
                    // Space should be visible (opacity: 1) and not animated, but must take up space
                    span.textContent = '\u00A0';
                    span.className = `about-char space`;
                    container.appendChild(span);
                    // No delay increase for spaces
                    continue;
                }
                
                span.textContent = char;
                span.className = `about-char`;
                container.appendChild(span);

                setTimeout(() => {
                    span.classList.add('visible');
                }, delay);
                
                // Typing/Reveal speed for about text
                delay += 30; // Faster than Hero text for a smoother paragraph reveal
            }
        }
        
        // --- Form Input Typing Animation ---
        function addInputFlickerAnimation() {
            const inputs = document.querySelectorAll('.form-input-custom');
            
            inputs.forEach(input => {
                // Add keypress event listener
                input.addEventListener('keypress', (e) => {
                    // Temporarily add a class to trigger the CSS animation
                    input.classList.add('typing-flicker');
                    
                    // Remove the class after the animation duration (0.2s + slight buffer)
                    setTimeout(() => {
                        input.classList.remove('typing-flicker');
                    }, 250);
                });
            });
        }

        // --- EMAILJS SUBMISSION LOGIC ---
        function handleEmailJSSubmission(event) {
            event.preventDefault(); // Prevent default form submission

            const form = event.target;
            const submitBtn = document.getElementById('submit-btn');
            const feedbackDiv = document.getElementById('contact-feedback');

            // Check if all keys are set
            if (SERVICE_ID === 'YOUR_SERVICE_ID' || TEMPLATE_ID === 'YOUR_TEMPLATE_ID' || PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
                feedbackDiv.className = 'text-center mt-6 p-4 rounded-lg bg-red-900/50 text-red-400';
                feedbackDiv.textContent = 'Error: EmailJS keys are missing. Please ensure all three IDs (Service, Template, Public) are correctly updated in the script.';
                feedbackDiv.classList.remove('hidden');
                return;
            }

            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            feedbackDiv.classList.add('hidden');

            // Collect form data for the email template
            const templateParams = {
                from_name: form.elements['from_name'].value,
                reply_to: form.elements['reply_to'].value,
                message: form.elements['message'].value,
                // Add a field for the recipient's email
                to_email: 'mabdullahsb36@gmail.com' 
            };

            emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
                .then((response) => {
                    feedbackDiv.className = 'text-center mt-6 p-4 rounded-lg bg-emerald-900/50 text-emerald-400';
                    feedbackDiv.textContent = 'Message sent successfully! I will be in touch soon.';
                    form.reset(); // Clear the form fields
                }, (error) => {
                    feedbackDiv.className = 'text-center mt-6 p-4 rounded-lg bg-red-900/50 text-red-400';
                    feedbackDiv.textContent = `Error sending message: ${error.text || error.status}. Please check your template settings on EmailJS.`;
                    console.error('EmailJS Error:', error);
                })
                .finally(() => {
                    submitBtn.textContent = 'Send Message';
                    submitBtn.disabled = false;
                    feedbackDiv.classList.remove('hidden');
                    // Hide feedback after 5 seconds
                    setTimeout(() => { feedbackDiv.classList.add('hidden'); }, 5000);
                });
        }
        
        // --- AOS Initialisation and Navbar Visibility Observer ---
        let navbarObserver;

        function initializeAOS() {
            // Re-initialize AOS with 'once: false' to repeat animations
            AOS.init({
                once: false, 
                duration: 1000,
            });

            // Set the initial originalBioText from the hidden paragraph
            const bioSourceElement = document.getElementById('bio-source-text');
            if (bioSourceElement) {
                originalBioText = bioSourceElement.textContent.trim().replace(/(\r\n|\n|\r)/gm, ' ').replace(/\s\s+/g, ' ');
            }
            
            // --- Navbar Animation Repeat Logic (Same as before) ---
            const header = document.getElementById('main-header');
            const heroSection = document.getElementById('hero');
            const headerLeft = document.getElementById('header-left');
            const headerRight = document.getElementById('header-right');

            if (header && heroSection && headerLeft && headerRight) {
                if (navbarObserver) navbarObserver.disconnect(); 

                navbarObserver = new IntersectionObserver(([entry]) => {
                    if (entry.isIntersecting) {
                        // When scrolling up and hero section comes into view
                        header.classList.remove('aos-animate');
                        // Only trigger desktop animations if screen size is appropriate
                        if (window.innerWidth >= 768) { 
                            headerLeft.classList.remove('aos-animate');
                            headerRight.classList.remove('aos-animate');
                        }
                        animateHeroText(); // Re-run the Hero text animation when scrolling back to the top
                        AOS.refreshHard(); // Force AOS to recalculate visibility and re-trigger all animations
                    } else {
                        AOS.refreshHard();
                    }
                }, {
                    root: null, 
                    rootMargin: '0px',
                    threshold: 0.1 
                });
                navbarObserver.observe(heroSection);
            }

            // --- About Text Animation Trigger ---
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                if (aboutTextObserver) aboutTextObserver.disconnect();
                aboutTextObserver = new IntersectionObserver(([entry]) => {
                    if (entry.isIntersecting) {
                        // Trigger the animation when the About section comes into view
                        animateAboutText(originalBioText);
                        // Disconnect after the first time to avoid re-triggering unless LLM changes the text
                        // We will rely on generateNewBio to manually call animateAboutText() later.
                        aboutTextObserver.unobserve(aboutSection);
                    }
                }, {
                    root: null,
                    rootMargin: '0px',
                    threshold: 0.2 // Trigger when 20% of the section is visible
                });
                aboutTextObserver.observe(aboutSection);
            }

            // Initial Hero Text Animation (must be run on load)
            animateHeroText();
        }

        // --- Mobile Menu Toggle Functionality ---
        function setupMobileMenu() {
            const toggleButton = document.getElementById('mobile-menu-toggle');
            const mobileMenu = document.getElementById('mobile-menu');

            toggleButton.addEventListener('click', () => {
                mobileMenu.classList.toggle('active');
            });
        }

        // --- Success Message Display Logic (Now handled by EmailJS logic) ---
        function setupContactForm() {
             // 1. Initialize EmailJS with your Public Key
            emailjs.init(PUBLIC_KEY);
            
            // 2. Attach the new submission handler
            const contactForm = document.getElementById('contact-form');
            if (contactForm) {
                contactForm.addEventListener('submit', handleEmailJSSubmission);
            }
            
            // 3. Remove old success section if it exists
            const oldSuccessDiv = document.getElementById('contact-success');
            if (oldSuccessDiv) oldSuccessDiv.remove();
        }


        window.onload = function() {
            
            if (typeof THREE !== 'undefined') {
                initThreeJS();
                initProfileImage3D(); // Initialize the separate profile image 3D scene
                animate(); // Single combined animation loop
                window.addEventListener('resize', onWindowResize, false);

                // Initialize scroll behavior for smooth navigation
                document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                    anchor.addEventListener('click', function (e) {
                        e.preventDefault();
                        document.querySelector(this.getAttribute('href')).scrollIntoView({
                            behavior: 'smooth'
                        });
                    });
                });
            } else {
                console.error("Three.js not loaded. Check CDN link.");
                // If 3D fails, ensure content is still readable
                document.getElementById('three-canvas').remove();
                document.body.classList.remove('bg-primary-dark');
                document.body.classList.add('bg-gray-900');
            }

            initializeAOS(); // Custom initialization with repeat logic
            addInputFlickerAnimation(); // Add typing animation to inputs
            setupMobileMenu(); // Setup mobile menu toggle logic
            setupContactForm(); // Setup new EmailJS form handler
        };