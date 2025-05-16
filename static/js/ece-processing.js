// ECE Signal Processing and Visualization Module

class ECEProcessor {
    constructor() {
        this.eegData = [];
        this.hrvData = [];
        this.sleepPosition = 'supine';
        this.respiratoryPattern = 'normal';
        this.isMonitoring = false;
        this.updateInterval = 100; // Update every 100ms
        this.probabilities = {
            normal: 0.50,  // Initialize with more accurate baseline probabilities
            insomnia: 0.25,
            apnea: 0.25,
            rls: 0
        };
        this.lastPrediction = null;
    }

    // Generate simulated EEG data with clinically accurate sleep stage characteristics based on disorder prediction
    generateEEGData() {
        const time = Date.now() / 1000;
        let signal = 0;
        
        // Base frequency components with enhanced clinical accuracy
        const delta = 25 * Math.sin(2 * Math.PI * 2 * time);  // Delta waves (0.5-4 Hz) - deep sleep
        const theta = 15 * Math.sin(2 * Math.PI * 6 * time);  // Theta waves (4-8 Hz) - drowsiness/light sleep
        const alpha = 35 * Math.sin(2 * Math.PI * 10 * time); // Alpha waves (8-13 Hz) - relaxed wakefulness
        const beta = 10 * Math.sin(2 * Math.PI * 20 * time);  // Beta waves (13-30 Hz) - alert wakefulness
        const gamma = 5 * Math.sin(2 * Math.PI * 35 * time);  // Gamma waves (>30 Hz) - cognitive processing
        
        // Adjust wave weights based on sleep disorder with clinical accuracy
        let deltaWeight = 0.4;
        let thetaWeight = 0.3;
        let alphaWeight = 0.2;
        let betaWeight = 0.1;
        let gammaWeight = 0.0;
        let artifactProbability = 0.0;
        
        if (this.lastPrediction) {
            if (this.lastPrediction.includes('No sleeping disorder')) {
                // Normal sleep: Clinically accurate wave distribution for healthy sleep cycles
                // Sleep cycles typically progress from N1→N2→N3→REM
                const sleepCycle = (time % 90) / 90; // 90-minute sleep cycle simulation
                
                if (sleepCycle < 0.1) { // N1 - Light sleep onset
                    deltaWeight = 0.1;
                    thetaWeight = 0.4; // Prominent theta in N1
                    alphaWeight = 0.3; // Alpha still present but diminishing
                    betaWeight = 0.2;
                    gammaWeight = 0.0;
                } else if (sleepCycle < 0.4) { // N2 - Established light sleep
                    deltaWeight = 0.3;
                    thetaWeight = 0.4; // Strong theta with sleep spindles
                    alphaWeight = 0.2;
                    betaWeight = 0.1;
                    gammaWeight = 0.0;
                    // Add sleep spindles (12-14 Hz bursts)
                    if (Math.random() < 0.2) {
                        signal += 20 * Math.sin(2 * Math.PI * 13 * time) * Math.exp(-((time % 1) * 10));
                    }
                } else if (sleepCycle < 0.7) { // N3 - Deep sleep
                    deltaWeight = 0.7; // Strong delta in deep sleep
                    thetaWeight = 0.2;
                    alphaWeight = 0.05;
                    betaWeight = 0.05;
                    gammaWeight = 0.0;
                } else { // REM sleep
                    deltaWeight = 0.1;
                    thetaWeight = 0.3;
                    alphaWeight = 0.3;
                    betaWeight = 0.3; // Increased beta during REM
                    gammaWeight = 0.0;
                }
            } else if (this.lastPrediction.includes('Insomnia')) {
                // Insomnia: Clinically accurate pattern showing hyperarousal
                // Features: Reduced slow waves, increased fast activity, sleep onset difficulties
                const stressLevel = Math.sin(time / 10) * 0.3 + 0.7; // Fluctuating stress/arousal
                
                deltaWeight = 0.1; // Significantly reduced delta (deep sleep deficit)
                thetaWeight = 0.2; // Reduced theta
                alphaWeight = 0.3 + (stressLevel * 0.1); // Intrusive alpha - alpha-delta intrusion
                betaWeight = 0.3 + (stressLevel * 0.1); // Elevated beta - hyperarousal
                gammaWeight = 0.1 * stressLevel; // Some gamma activity during stress peaks
                
                // Add micro-arousals characteristic of insomnia
                if (Math.random() < 0.15) {
                    signal += 25 * Math.sin(2 * Math.PI * 15 * time) * Math.exp(-((time % 0.5) * 5));
                }
                
                // Add alpha intrusions into delta (alpha-delta sleep)
                if (Math.random() < 0.3) {
                    signal += 15 * Math.sin(2 * Math.PI * 10 * time) * Math.sin(2 * Math.PI * 2 * time);
                }
            } else if (this.lastPrediction.includes('Sleep Apnea')) {
                // Sleep Apnea: Clinically accurate pattern showing respiratory disturbance
                // Features: Cyclic variation with arousals, sleep fragmentation
                const apneaCycle = time % 60; // Typical 1-minute apnea cycle
                const apneaPhase = apneaCycle / 60; // 0-1 range for cycle phase
                
                if (apneaPhase < 0.6) { // During apnea event - progressive hypoxia
                    // Gradual shift from normal sleep to disturbed pattern
                    const progressFactor = apneaPhase / 0.6; // 0-1 range for progression
                    
                    deltaWeight = 0.4 * (1 - progressFactor); // Delta decreases during apnea
                    thetaWeight = 0.3;
                    alphaWeight = 0.1 + (0.1 * progressFactor); // Alpha intrusion increases
                    betaWeight = 0.1 + (0.2 * progressFactor); // Beta increases with stress
                    gammaWeight = 0.1 * progressFactor; // Some gamma with arousal
                } else if (apneaPhase < 0.7) { // Arousal/awakening after apnea
                    // Sudden shift to arousal pattern
                    deltaWeight = 0.1; // Sharp drop in delta
                    thetaWeight = 0.2;
                    alphaWeight = 0.3; // Alpha surge during arousal
                    betaWeight = 0.3; // Beta surge during arousal
                    gammaWeight = 0.1; // Some gamma during arousal
                    
                    // Add arousal burst
                    signal += 30 * Math.sin(2 * Math.PI * 12 * time) * Math.exp(-((apneaPhase - 0.6) * 50));
                } else { // Recovery after arousal
                    // Gradual return to sleep pattern
                    const recoveryFactor = (apneaPhase - 0.7) / 0.3; // 0-1 range for recovery
                    
                    deltaWeight = 0.1 + (0.3 * recoveryFactor); // Delta gradually recovers
                    thetaWeight = 0.2 + (0.1 * recoveryFactor);
                    alphaWeight = 0.3 - (0.1 * recoveryFactor); // Alpha gradually decreases
                    betaWeight = 0.3 - (0.2 * recoveryFactor); // Beta gradually decreases
                    gammaWeight = 0.1 * (1 - recoveryFactor); // Gamma fades
                }
                
                // Add occasional K-complexes during lighter sleep phases
                if (apneaPhase > 0.8 && Math.random() < 0.1) {
                    signal += 40 * Math.exp(-((time % 0.3) * 15)) - 20;
                }
                
                // Higher artifact probability during apnea events
                artifactProbability = 0.2;
            } else if (this.lastPrediction.includes('RLS')) {
                // RLS: Clinically accurate pattern showing periodic limb movements
                // Features: Movement artifacts, sleep fragmentation, periodic patterns
                const rlsCycle = time % 30; // Typical 30-second periodicity in PLMS
                const rlsPhase = rlsCycle / 30; // 0-1 range for cycle phase
                
                if (rlsPhase < 0.1) { // During limb movement
                    deltaWeight = 0.1; // Reduced delta during movement
                    thetaWeight = 0.2;
                    alphaWeight = 0.3; // Alpha intrusion during arousal
                    betaWeight = 0.3; // Increased beta during movement/arousal
                    gammaWeight = 0.1; // Some gamma during movement
                    
                    // Add movement artifact
                    signal += 50 * Math.sin(2 * Math.PI * 5 * time) * Math.exp(-((rlsPhase) * 30));
                    artifactProbability = 0.5; // High artifact probability during movement
                } else { // Between movements
                    // More normal sleep pattern but still disrupted
                    deltaWeight = 0.3; // Reduced delta overall due to fragmentation
                    thetaWeight = 0.3;
                    alphaWeight = 0.2;
                    betaWeight = 0.2; // Elevated beta between movements
                    gammaWeight = 0.0;
                    artifactProbability = 0.1; // Some artifacts between movements
                }
            }
        }
        
        // Combine waves with disorder-specific weights
        signal = delta * deltaWeight + 
                 theta * thetaWeight + 
                 alpha * alphaWeight + 
                 beta * betaWeight + 
                 gamma * gammaWeight;
        
        // Add clinically realistic artifacts based on disorder
        if (Math.random() < artifactProbability) {
            // Simulate various artifacts: muscle, movement, electrode pop
            const artifactType = Math.floor(Math.random() * 3);
            if (artifactType === 0) { // Muscle artifact (high frequency)
                signal += 20 * Math.random() * Math.sin(2 * Math.PI * 50 * time);
            } else if (artifactType === 1) { // Movement artifact (large amplitude shift)
                signal += 40 * (Math.random() - 0.5);
            } else { // Electrode artifact (sudden jump)
                signal += 30 * Math.sign(Math.random() - 0.5);
            }
        }
        
        // Add physiologically appropriate noise level based on disorder
        const noiseFactor = this.lastPrediction && !this.lastPrediction.includes('No sleeping disorder') ? 15 : 8;
        signal += (Math.random() - 0.5) * noiseFactor;
        
        return signal;
    }

    // Generate simulated HRV data with enhanced sleep disorder characteristics and improved accuracy
    generateHRVData() {
        const baseInterval = 60000 / 75; // Base RR interval for 75 bpm
        let variation = 0;
        const time = Date.now() / 1000;
        
        // Get disorder probability weights for more accurate patterns
        const apneaWeight = this.probabilities.apnea;
        const insomniaWeight = this.probabilities.insomnia;
        const rlsWeight = this.probabilities.rls;
        
        // Ensure weights are valid numbers with improved validation
        const safeApneaWeight = isNaN(apneaWeight) || apneaWeight < 0 ? 0 : (apneaWeight > 1 ? 1 : apneaWeight);
        const safeInsomniaWeight = isNaN(insomniaWeight) || insomniaWeight < 0 ? 0 : (insomniaWeight > 1 ? 1 : insomniaWeight);
        const safeRlsWeight = isNaN(rlsWeight) || rlsWeight < 0 ? 0 : (rlsWeight > 1 ? 1 : rlsWeight);
        
        // Adjust HRV based on sleep disorder probabilities and prediction
        if (this.lastPrediction && this.lastPrediction.includes('Sleep Apnea')) {
            // Enhanced sleep apnea pattern simulation with more realistic patterns
            const apneaPhase = Math.sin(time / 4);
            const apneaCycle = Math.sin(time / 15); // Longer cycle for overall pattern
            const respiratoryOscillation = Math.sin(time * 0.8) * 20; // Respiratory sinus arrhythmia
            
            if (apneaPhase > 0.7) {
                // Severe apnea episode - longer RR intervals with characteristic pattern
                // During apnea, heart rate initially slows, then becomes erratic
                const apneaSeverity = 0.7 + (safeApneaWeight * 0.3); // Scale severity with probability
                variation = (
                    Math.sin(time / 2) * 200 * apneaSeverity + 
                    Math.sin(time * 3) * 50 * apneaSeverity + // High-frequency component
                    Math.random() * 50
                );
            } else if (apneaPhase < -0.7) {
                // Post-apnea compensation - rapid heart rate with increased variability
                // After apnea, heart rate typically increases rapidly
                variation = (
                    Math.sin(time / 3) * 50 + 
                    Math.sin(time * 5) * 80 + // Faster oscillation post-apnea
                    Math.random() * 30
                ) * (1 + safeApneaWeight);
            } else {
                // Transition phase with respiratory sinus arrhythmia
                variation = (
                    Math.sin(time / 5) * 80 + 
                    respiratoryOscillation +
                    Math.random() * 40
                ) * (1 + apneaCycle * safeApneaWeight);
            }
        } else if (this.lastPrediction && this.lastPrediction.includes('Insomnia')) {
            // Enhanced insomnia pattern with stress indicators and autonomic activation
            const stressFactor = Math.sin(time / 10) * 0.5 + 0.5; // Stress variation
            const arousalFactor = Math.cos(time / 8) * 0.3 + 0.7; // Arousal level
            const sympatheticTone = Math.sin(time / 6) * 0.4 + 0.6; // Sympathetic nervous system activation
            
            // Insomnia typically shows reduced HRV with higher frequency components
            variation = (
                Math.sin(time) * 100 * stressFactor + // Fast oscillation
                Math.cos(time * 2) * 50 * arousalFactor + // Even faster component
                Math.sin(time * 0.5) * 30 * sympatheticTone + // Slower background rhythm
                Math.random() * 70 * (0.5 + safeInsomniaWeight * 0.5) // Noise increases with severity
            );
        } else if (this.lastPrediction && this.lastPrediction.includes('RLS')) {
            // Enhanced RLS pattern with periodic leg movements and associated heart rate changes
            const movementPhase = Math.sin(time / 20); // Overall movement pattern
            const movementProbability = 0.15 + (safeRlsWeight * 0.2); // Increased probability with RLS severity
            
            if (Math.random() < movementProbability) {
                // Leg movement with characteristic heart rate response
                // Typically a brief acceleration followed by deceleration
                const movementIntensity = 150 + (safeRlsWeight * 100);
                const movementTime = time % 10; // Reset for each movement
                
                if (movementTime < 1) {
                    // Initial acceleration
                    variation = movementIntensity * (1 - movementTime) + Math.random() * 50;
                } else if (movementTime < 3) {
                    // Deceleration
                    variation = -movementIntensity * 0.5 * (movementTime - 1) / 2 + Math.random() * 70;
                } else {
                    // Return to baseline
                    variation = Math.sin(movementTime) * 50 + Math.random() * 40;
                }
            } else {
                // Baseline with subtle variations and occasional disruptions
                variation = (
                    Math.sin(time / 3) * 70 + 
                    Math.cos(time / 6) * 30 + 
                    Math.sin(time / 12) * 50 * movementPhase + // Slower oscillation
                    Math.random() * 50
                ) * (1 + movementPhase * safeRlsWeight);
            }
        } else {
            // Normal HRV pattern with natural variations including respiratory sinus arrhythmia
            const circadianFactor = Math.sin(time / 300) * 0.3 + 0.7; // Long-term variation
            const respiratoryComponent = Math.sin(time * 0.75) * 40; // Respiratory influence
            
            variation = (
                Math.sin(time / 6) * 60 + // Low frequency component
                Math.sin(time / 10) * 30 + // Very low frequency
                respiratoryComponent + // High frequency (respiratory)
                Math.random() * 20 // Small random component
            ) * circadianFactor;
        }
        
        return baseInterval + variation;
    }

    // Enhanced sleep position detection with disorder-specific patterns and stability
    detectSleepPosition() {
        const positions = ['supine', 'prone', 'left', 'right'];
        let weights;
        const time = Date.now();
        
        // Only change position occasionally to create stability
        // This prevents constant position changes and makes the display more realistic
        if (!this._lastPositionTime || (time - this._lastPositionTime) > 15000) {
            this._lastPositionTime = time;
            
            // Store current position to check if it changed
            const previousPosition = this._currentSleepPosition || 'supine';
            
            // Set weights based on sleep disorder with clinical accuracy
            if (this.lastPrediction) {
                if (this.lastPrediction.includes('Sleep Apnea')) {
                    // Sleep apnea patients often sleep supine - this position worsens apnea
                    const apneaSeverity = this.probabilities.apnea;
                    
                    // More severe apnea = higher chance of supine position
                    weights = [
                        0.5 + (apneaSeverity * 0.3), // supine - increases with severity
                        0.1,                        // prone
                        0.2,                        // left
                        0.2 - (apneaSeverity * 0.1)  // right - decreases with severity
                    ];
                    
                    // If already in supine position, high chance to stay there
                    if (previousPosition === 'supine') {
                        weights[0] += 0.2; // Even higher chance to remain supine
                    }
                    
                    // Occasional position change during severe apnea episodes
                    if (apneaSeverity > 0.7 && Math.random() < 0.3) {
                        // During severe apnea, patients sometimes shift position
                        weights = [0.2, 0.2, 0.3, 0.3]; // More likely to move to side
                    }
                } else if (this.lastPrediction.includes('Insomnia')) {
                    // Insomnia patients tend to change positions more frequently
                    const insomniaSeverity = this.probabilities.insomnia;
                    
                    // Base weights with more position changes
                    weights = [0.25, 0.25, 0.25, 0.25]; // Equal distribution
                    
                    // Severe insomnia has even more position changes
                    if (insomniaSeverity > 0.7) {
                        // Avoid staying in the same position
                        const currentIndex = positions.indexOf(previousPosition);
                        if (currentIndex >= 0) {
                            weights[currentIndex] -= 0.15; // Reduce chance of staying in same position
                            
                            // Redistribute the reduced probability
                            const redistAmount = 0.15 / 3;
                            for (let i = 0; i < weights.length; i++) {
                                if (i !== currentIndex) {
                                    weights[i] += redistAmount;
                                }
                            }
                        }
                    } else {
                        // Milder insomnia still has some position stability
                        const currentIndex = positions.indexOf(previousPosition);
                        if (currentIndex >= 0) {
                            weights[currentIndex] += 0.1; // Slight increase in staying in same position
                        }
                    }
                } else if (this.lastPrediction.includes('RLS')) {
                    // RLS patients often prefer side positions to allow leg movement
                    const rlsSeverity = this.probabilities.rls;
                    
                    // Base weights favoring side positions
                    weights = [
                        0.15 - (rlsSeverity * 0.1), // supine - decreases with severity
                        0.15 - (rlsSeverity * 0.1), // prone - decreases with severity
                        0.35 + (rlsSeverity * 0.1), // left - increases with severity
                        0.35 + (rlsSeverity * 0.1)  // right - increases with severity
                    ];
                    
                    // During RLS episodes, more likely to change position
                    if (rlsSeverity > 0.6 && Math.random() < 0.4) {
                        // If currently in supine or prone, very likely to move to side
                        if (previousPosition === 'supine' || previousPosition === 'prone') {
                            weights = [0.05, 0.05, 0.45, 0.45]; // Strong preference for sides
                        } else {
                            // If already on side, may switch to other side
                            weights = [0.05, 0.05, 0.45, 0.45];
                            if (previousPosition === 'left') {
                                weights[2] = 0.2;  // Less likely to stay on left
                                weights[3] = 0.7;  // More likely to move to right
                            } else if (previousPosition === 'right') {
                                weights[2] = 0.7;  // More likely to move to left
                                weights[3] = 0.2;  // Less likely to stay on right
                            }
                        }
                    }
                } else {
                    // No disorder - natural distribution with some stability
                    weights = [0.3, 0.2, 0.25, 0.25];
                    
                    // Tendency to maintain position during normal sleep
                    const currentIndex = positions.indexOf(previousPosition);
                    if (currentIndex >= 0) {
                        weights[currentIndex] += 0.2; // Higher chance to stay in same position
                    }
                }
            } else {
                // Default weights if no prediction is available
                weights = [0.25, 0.25, 0.25, 0.25];
            }
            
            // Normalize weights to ensure they sum to 1.0
            const weightSum = weights.reduce((sum, weight) => sum + weight, 0);
            weights = weights.map(weight => weight / weightSum);
            
            // Select position based on weighted probability
            const random = Math.random();
            let sum = 0;
            for (let i = 0; i < weights.length; i++) {
                sum += weights[i];
                if (random <= sum) {
                    this._currentSleepPosition = positions[i];
                    break;
                }
            }
            
            // Fallback to supine if no position was selected
            if (!this._currentSleepPosition) {
                this._currentSleepPosition = 'supine';
            }
        }
        
        // Return the current position (which changes less frequently now)
        return this._currentSleepPosition || 'supine';
    }

    // Enhanced respiratory pattern detection with disorder-specific characteristics and stability
    detectRespiratoryPattern() {
        const patterns = ['normal', 'periodic', 'cheyne-stokes', 'irregular', 'shallow'];
        let weights;
        const time = Date.now();
        
        // Get disorder probability weights with enhanced accuracy
        const apneaWeight = Math.min(1, this.probabilities.apnea * 1.2); // Amplify apnea influence
        const insomniaWeight = Math.min(1, this.probabilities.insomnia * 1.15); // Slightly increase insomnia weight
        const rlsWeight = this.probabilities.rls;
        
        // Increase stability by extending the pattern duration
        // This creates more realistic and clinically accurate breathing patterns
        if (!this._lastRespiratoryTime || (time - this._lastRespiratoryTime) > 12000) {
            this._lastRespiratoryTime = time;
            
            // Store current pattern to check if it changed
            const previousPattern = this._currentRespiratoryPattern || 'normal';
            
            // Set weights based on sleep disorder with strong bias and clinical accuracy
            if (this.lastPrediction) {
                if (this.lastPrediction.includes('Sleep Apnea')) {
                    // Sleep apnea has characteristic breathing patterns that cycle with distinct phases
                    // Create a clinically accurate pattern sequence for sleep apnea with enhanced realism
                    const apneaSeverity = 0.5 + (apneaWeight * 0.5); // More balanced severity scale
                    
                    // Determine pattern based on apnea cycle phase with optimized timing
                    const apneaCyclePhase = Math.floor((time / 25000) % 4); // Longer cycles for more natural transitions
                    
                    if (apneaCyclePhase === 0) {
                        // Initial apnea episode - refined periodic patterns
                        weights = [
                            0.1,   // normal - slightly increased for realism
                            0.5 + (apneaWeight * 0.3),  // periodic - dominant in early apnea
                            0.3 + (apneaWeight * 0.1),  // cheyne-stokes - more prominent
                            0.05,  // irregular
                            0.05   // shallow
                        ];
                    } else if (apneaCyclePhase === 1) {
                        // Peak apnea phase - enhanced cheyne-stokes pattern
                        weights = [
                            0.05,  // normal
                            0.25,  // periodic - reduced for more distinct phases
                            0.6 + (apneaWeight * 0.25),  // cheyne-stokes - stronger peak
                            0.05,  // irregular
                            0.05   // shallow
                        ];
                    } else if (apneaCyclePhase === 2) {
                        // Recovery phase - optimized irregular patterns
                        weights = [
                            0.15,  // normal - increased for better recovery
                            0.2,   // periodic - maintained for stability
                            0.15,  // cheyne-stokes
                            0.4 + (apneaWeight * 0.25),  // irregular - refined recovery
                            0.1    // shallow
                        ];
                    } else {
                        // Temporary stabilization phase
                        weights = [
                            0.35 - (apneaWeight * 0.2),  // normal - improves but limited by severity
                            0.25,  // periodic
                            0.15,  // cheyne-stokes
                            0.15,  // irregular
                            0.1    // shallow
                        ];
                    }
                    
                    // If severe apnea, bias even more toward characteristic patterns
                    if (apneaWeight > 0.7) {
                        if (previousPattern === 'periodic' || previousPattern === 'cheyne-stokes') {
                            // Increase chance to maintain these characteristic patterns
                            const index = patterns.indexOf(previousPattern);
                            weights[index] += 0.2;
                        }
                    }
                } else if (this.lastPrediction.includes('Insomnia')) {
                    // Insomnia often has irregular breathing with anxiety-related patterns
                    // Create a more realistic pattern for insomnia with stress-related breathing
                    const insomniaSeverity = 0.5 + (insomniaWeight * 0.5);
                    
                    // Determine pattern based on anxiety/arousal cycle
                    const arousalLevel = Math.sin(time / 22000) * 0.6 + 0.5; // 0.1 to 1.1 for wider range
                    
                    if (arousalLevel > 0.7) {
                        // High arousal/anxiety phase - enhanced irregular and shallow breathing
                        weights = [
                            0.1,   // normal - reduced during anxiety
                            0.05,  // periodic
                            0.0,   // cheyne-stokes (not typical for insomnia)
                            0.5 + (insomniaWeight * 0.3),   // irregular - more pronounced during anxiety
                            0.35 + (insomniaWeight * 0.2)   // shallow - enhanced anxiety response
                        ];
                    } else {
                        // Lower arousal phase - more balanced but still affected by insomnia
                        weights = [
                            0.35 - (insomniaWeight * 0.15),  // normal - moderately affected
                            0.1,   // periodic
                            0.0,   // cheyne-stokes
                            0.35 + (insomniaWeight * 0.15),  // irregular - maintained influence
                            0.2 + (insomniaWeight * 0.15)   // shallow - stress response
                        ];
                    }
                    
                    // Maintain some pattern stability for realism
                    if (previousPattern === 'irregular' || previousPattern === 'shallow') {
                        const index = patterns.indexOf(previousPattern);
                        weights[index] += 0.15;
                    }
                } else if (this.lastPrediction.includes('RLS')) {
                    // RLS may have normal breathing with occasional disruptions during leg movements
                    // Create a more realistic pattern for RLS with movement-related disruptions
                    const rlsSeverity = 0.5 + (rlsWeight * 0.5);
                    
                    // Determine if currently in a leg movement episode
                    const inMovementEpisode = Math.random() < (0.2 * rlsSeverity);
                    
                    if (inMovementEpisode) {
                        // During leg movement - breathing becomes irregular
                        weights = [
                            0.2,  // normal
                            0.1,  // periodic
                            0.0,  // cheyne-stokes
                            0.6 + (rlsWeight * 0.2),  // irregular - during movement
                            0.1   // shallow
                        ];
                    } else {
                        // Between movements - more normal breathing
                        weights = [
                            0.6 - (rlsWeight * 0.2),  // normal - decreases with severity
                            0.1,  // periodic
                            0.0,  // cheyne-stokes
                            0.2 + (rlsWeight * 0.1),  // irregular
                            0.1 + (rlsWeight * 0.1)   // shallow
                        ];
                    }
                    
                    // Maintain pattern stability between changes
                    if (previousPattern === 'normal' || previousPattern === 'irregular') {
                        const index = patterns.indexOf(previousPattern);
                        weights[index] += 0.2;
                    }
                } else {
                    // No sleep disorder - normal breathing patterns with natural variations
                    weights = [0.8, 0.1, 0.0, 0.05, 0.05]; // Predominantly normal
                    
                    // High stability for normal breathing
                    if (previousPattern === 'normal') {
                        weights[0] += 0.15;
                    }
                }
            } else {
                // Default weights if no prediction is available
                weights = [0.7, 0.15, 0.05, 0.05, 0.05];
                
                // Maintain some stability
                if (previousPattern && patterns.includes(previousPattern)) {
                    const index = patterns.indexOf(previousPattern);
                    weights[index] += 0.1;
                }
            }
            
            // Normalize weights to ensure they sum to 1.0
            const weightSum = weights.reduce((sum, weight) => sum + weight, 0);
            weights = weights.map(weight => weight / weightSum);
            
            // Select pattern based on weighted probability
            const random = Math.random();
            let sum = 0;
            for (let i = 0; i < weights.length; i++) {
                sum += weights[i];
                if (random <= sum) {
                    this._currentRespiratoryPattern = patterns[i];
                    break;
                }
            }
            
            // Fallback to normal if no pattern was selected
            if (!this._currentRespiratoryPattern) {
                this._currentRespiratoryPattern = 'normal';
            }
        }
        
        // Return the current pattern (which changes less frequently now)
        return this._currentRespiratoryPattern || 'normal';
    }

    // Start monitoring with enhanced state management and visual indicators
    startMonitoring() {
        if (this.isMonitoring) return;
        this.isMonitoring = true;
        this.monitoringInterval = setInterval(() => this.updateData(), this.updateInterval);
        
        // Update UI to reflect monitoring state
        const startBtn = document.getElementById('start-monitoring');
        const stopBtn = document.getElementById('stop-monitoring');
        if (startBtn) startBtn.disabled = true;
        if (stopBtn) stopBtn.disabled = false;
        
        // Add active class to container for visual enhancement
        const container = document.querySelector('.ece-monitoring-container');
        if (container) {
            container.classList.add('active');
        }
        
        // Add monitoring active indicator
        const controlPanel = document.querySelector('.control-panel');
        if (controlPanel) {
            let indicator = document.querySelector('.monitoring-active-indicator');
            if (!indicator) {
                indicator = document.createElement('div');
                indicator.className = 'monitoring-active-indicator';
                indicator.textContent = 'MONITORING ACTIVE';
                controlPanel.appendChild(indicator);
            }
            indicator.classList.add('visible');
        }
        
        // Initialize with current prediction
        if (this.lastPrediction) {
            this.updateData();
        }
    }

    // Stop monitoring with cleanup and visual state reset
    stopMonitoring() {
        if (!this.isMonitoring) return;
        this.isMonitoring = false;
        clearInterval(this.monitoringInterval);
        
        // Update UI to reflect stopped state
        const startBtn = document.getElementById('start-monitoring');
        const stopBtn = document.getElementById('stop-monitoring');
        if (startBtn) startBtn.disabled = false;
        if (stopBtn) stopBtn.disabled = true;
        
        // Remove active class from container
        const container = document.querySelector('.ece-monitoring-container');
        if (container) {
            container.classList.remove('active');
        }
        
        // Hide monitoring active indicator
        const indicator = document.querySelector('.monitoring-active-indicator');
        if (indicator) {
            indicator.classList.remove('visible');
        }
    }

    // Update all data points
    updateData() {
        // Update EEG data
        this.eegData.push(this.generateEEGData());
        if (this.eegData.length > 100) this.eegData.shift();

        // Update HRV data
        this.hrvData.push(this.generateHRVData());
        if (this.hrvData.length > 50) this.hrvData.shift();

        // Update position and respiratory pattern less frequently
        if (Math.random() < 0.1) { // 10% chance each update
            this.sleepPosition = this.detectSleepPosition();
            this.respiratoryPattern = this.detectRespiratoryPattern();
        }

        // Trigger visualization update
        this.updateVisualizations();
    }

    // Update visualizations with enhanced display and improved accuracy
    updateVisualizations() {
        // Update EEG waveform with sleep-stage-appropriate colors
        const eegCanvas = document.getElementById('eeg-canvas');
        if (eegCanvas) {
            // Color coding based on predominant sleep disorder
            let eegColor = '#00ff00'; // Default green for normal
            
            if (this.probabilities.insomnia > 0.5) {
                eegColor = '#ff9900'; // Orange for insomnia (higher beta activity)
            } else if (this.probabilities.apnea > 0.5) {
                eegColor = '#ff5500'; // Red-orange for apnea
            } else if (this.probabilities.rls > 0.5) {
                eegColor = '#aa77ff'; // Purple for RLS
            }
            
            this.drawWaveform(eegCanvas, this.eegData, eegColor);
        }

        // Update HRV waveform with disorder-specific patterns and enhanced visualization
        const hrvCanvas = document.getElementById('hrv-canvas');
        if (hrvCanvas) {
            // Color coding based on HRV characteristics
            let hrvColor = '#00aaff'; // Default blue for normal HRV
            
            // Determine color based on predominant disorder and HRV characteristics
            if (this.probabilities.apnea > 0.5) {
                // Red for apnea - indicates potentially dangerous HRV patterns
                hrvColor = '#ff0000';
            } else if (this.probabilities.insomnia > 0.5) {
                // Yellow-orange for insomnia - indicates stress-related HRV
                hrvColor = '#ffaa00';
            } else if (this.probabilities.rls > 0.5) {
                // Purple-blue for RLS - indicates movement-related HRV changes
                hrvColor = '#7755ff';
            }
            
            // Enhanced HRV visualization with better scaling and normalization
            this.drawEnhancedHRV(hrvCanvas, this.hrvData, hrvColor);
        }

        // Update position and pattern displays with explanations
        const positionElement = document.getElementById('sleep-position');
        const positionReasonElement = document.getElementById('position-reason');
        if (positionElement) {
            positionElement.textContent = this.sleepPosition;
            if (positionReasonElement) {
                let positionReason = '';
                switch(this.sleepPosition) {
                    case 'supine':
                        positionReason = 'Sleeping on back - may increase apnea risk';
                        break;
                    case 'prone':
                        positionReason = 'Sleeping on stomach - may help reduce snoring';
                        break;
                    case 'left':
                        positionReason = 'Left side - optimal for circulation';
                        break;
                    case 'right':
                        positionReason = 'Right side - may reduce acid reflux';
                        break;
                }
                positionReasonElement.textContent = positionReason;
            }
        }

        const patternElement = document.getElementById('respiratory-pattern');
        const patternReasonElement = document.getElementById('pattern-reason');
        if (patternElement) {
            patternElement.textContent = this.respiratoryPattern;
            if (patternReasonElement) {
                let patternReason = '';
                switch(this.respiratoryPattern) {
                    case 'normal':
                        patternReason = 'Regular breathing pattern - indicates stable sleep';
                        break;
                    case 'periodic':
                        patternReason = 'Alternating deep and shallow breathing - possible sleep apnea';
                        break;
                    case 'cheyne-stokes':
                        patternReason = 'Gradual increase and decrease in breathing - severe sleep disorder';
                        break;
                    case 'irregular':
                        patternReason = 'Inconsistent breathing - may indicate sleep disruption';
                        break;
                    case 'shallow':
                        patternReason = 'Reduced breath depth - possible anxiety or discomfort';
                        break;
                }
                patternReasonElement.textContent = patternReason;
            }
        }

        // Update probability bars
        this.updateProbabilityBars();
    }

    // Draw waveform on canvas with improved error handling
    drawWaveform(canvas, data, color) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Safety check for empty data
        if (!data || data.length < 2) {
            // Draw a flat line if no data
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.moveTo(0, height / 2);
            ctx.lineTo(width, height / 2);
            ctx.stroke();
            return;
        }

        // Draw waveform
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;

        const step = width / (data.length - 1);
        data.forEach((value, index) => {
            const x = index * step;
            const y = (height / 2) + (value * height / 200);
            if (index === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });

        ctx.stroke();
    }
    
    // Enhanced HRV visualization with better scaling, normalization and clinical relevance
    drawEnhancedHRV(canvas, data, color) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Safety check for empty data
        if (!data || data.length < 2) {
            // Draw a flat line with message if no data
            ctx.beginPath();
            ctx.strokeStyle = '#888888';
            ctx.lineWidth = 1;
            ctx.moveTo(0, height / 2);
            ctx.lineTo(width, height / 2);
            ctx.stroke();
            
            // Add text message
            ctx.font = '12px Arial';
            ctx.fillStyle = '#aaaaaa';
            ctx.textAlign = 'center';
            ctx.fillText('Collecting HRV data...', width / 2, height / 2 - 15);
            return;
        }
        
        // Calculate statistics for better visualization
        const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
        const baselineHR = 60000 / mean; // Convert to HR in BPM
        
        // Calculate min/max for scaling
        let min = Math.min(...data);
        let max = Math.max(...data);
        
        // Ensure reasonable range even with outliers
        const range = max - min;
        const padding = range * 0.1; // 10% padding
        min -= padding;
        max += padding;
        
        // Draw baseline grid
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        
        // Horizontal grid lines (HR values)
        const hrValues = [60, 70, 80, 90, 100];
        hrValues.forEach(hr => {
            const rrInterval = 60000 / hr; // Convert HR to RR interval
            const y = height - ((rrInterval - min) / (max - min) * height);
            if (y >= 0 && y <= height) {
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                
                // Label the grid line with HR value
                ctx.font = '10px Arial';
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.textAlign = 'left';
                ctx.fillText(`${hr} bpm`, 5, y - 3);
            }
        });
        ctx.stroke();
        
        // Draw time markers
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        for (let i = 1; i < 5; i++) {
            const x = width * (i / 5);
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
        }
        ctx.stroke();
        
        // Draw HRV waveform with enhanced visualization
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;

        const step = width / (data.length - 1);
        data.forEach((value, index) => {
            const x = index * step;
            // Invert Y axis since lower RR interval = higher heart rate
            const y = height - ((value - min) / (max - min) * height);
            if (index === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();
        
        // Add HRV metrics display
        ctx.font = '11px Arial';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'right';
        
        // Calculate SDNN (Standard Deviation of NN intervals) - a key HRV metric
        const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
        const sdnn = Math.sqrt(variance);
        
        // Calculate RMSSD (Root Mean Square of Successive Differences) - another key HRV metric
        let rmssd = 0;
        if (data.length > 1) {
            let sumSquaredDiffs = 0;
            for (let i = 1; i < data.length; i++) {
                sumSquaredDiffs += Math.pow(data[i] - data[i-1], 2);
            }
            rmssd = Math.sqrt(sumSquaredDiffs / (data.length - 1));
        }
        
        // Display metrics
        ctx.fillText(`HR: ${Math.round(baselineHR)} bpm`, width - 10, 20);
        ctx.fillText(`SDNN: ${Math.round(sdnn)} ms`, width - 10, 40);
        ctx.fillText(`RMSSD: ${Math.round(rmssd)} ms`, width - 10, 60);
        
        // Add clinical interpretation based on disorder
        let hrvStatus = 'Normal';
        let statusColor = '#00ff00';
        
        if (this.lastPrediction) {
            if (this.lastPrediction.includes('Sleep Apnea') && this.probabilities.apnea > 0.5) {
                if (sdnn < 30 || rmssd < 15) {
                    hrvStatus = 'Reduced HRV - Apnea Pattern';
                    statusColor = '#ff0000';
                } else if (sdnn > 100 || rmssd > 80) {
                    hrvStatus = 'Erratic HRV - Apnea Pattern';
                    statusColor = '#ff5500';
                }
            } else if (this.lastPrediction.includes('Insomnia') && this.probabilities.insomnia > 0.5) {
                if (sdnn < 25 || rmssd < 20) {
                    hrvStatus = 'Reduced HRV - Insomnia Pattern';
                    statusColor = '#ffaa00';
                }
            } else if (this.lastPrediction.includes('RLS') && this.probabilities.rls > 0.5) {
                if (rmssd > 50) {
                    hrvStatus = 'Elevated HRV - RLS Pattern';
                    statusColor = '#7755ff';
                }
            }
        }
        
        // Display HRV status
        ctx.font = 'bold 12px Arial';
        ctx.fillStyle = statusColor;
        ctx.textAlign = 'left';
        ctx.fillText(hrvStatus, 10, 20);
    }
    
    // Update probability bars with improved non-sleeping disorder visualization
    updateProbabilityBars() {
        const disorders = ['insomnia', 'apnea', 'rls'];
        disorders.forEach(disorder => {
            const prob = Math.round(this.probabilities[disorder] * 100);
            const barElement = document.getElementById(`${disorder}-bar`);
            const probElement = document.getElementById(`${disorder}-prob`);
            if (barElement) barElement.style.width = `${prob}%`;
            if (probElement) probElement.textContent = `${prob}%`;
        });
        
        // Handle non-sleeping disorder indicator with enhanced visibility
        const noDisorderIndicator = document.querySelector('.no-disorder-indicator');
        if (noDisorderIndicator) {
            if (this.lastPrediction && this.lastPrediction.includes('No sleeping disorder')) {
                noDisorderIndicator.classList.add('visible');
                
                // Add normal sleep probability percentage if not already present
                if (!document.getElementById('normal-sleep-probability')) {
                    const normalProb = Math.round((this.probabilities.normal || 0) * 100);
                    const probText = document.createElement('div');
                    probText.id = 'normal-sleep-probability';
                    probText.className = 'normal-sleep-probability';
                    probText.textContent = `Normal Sleep: ${normalProb}%`;
                    probText.style.color = '#00ff00';
                    probText.style.fontWeight = 'bold';
                    probText.style.marginTop = '5px';
                    noDisorderIndicator.appendChild(probText);
                } else {
                    // Update existing probability display
                    const normalProb = Math.round((this.probabilities.normal || 0) * 100);
                    const probText = document.getElementById('normal-sleep-probability');
                    probText.textContent = `Normal Sleep: ${normalProb}%`;
                }
            } else {
                noDisorderIndicator.classList.remove('visible');
                // Remove normal sleep probability if present
                const probText = document.getElementById('normal-sleep-probability');
                if (probText) {
                    probText.remove();
                }
            }
        }
    }

    // Update probabilities based on ML prediction and start monitoring
    updateProbabilities(prediction, probabilities = null) {
        console.log('Updating probabilities with prediction:', prediction);
        this.lastPrediction = prediction;
        
        // If explicit probabilities are provided (from ML model), use them
        if (probabilities) {
            // Make a copy to avoid reference issues
            this.probabilities = {
                normal: 1.0 - (probabilities.insomnia + probabilities.apnea + probabilities.rls),
                insomnia: probabilities.insomnia,
                apnea: probabilities.apnea,
                rls: probabilities.rls
            };
            
            // Ensure normal probability is properly set
            if (prediction.includes('No sleeping disorder')) {
                // Boost normal probability for non-sleeping disorder cases
                this.probabilities.normal = Math.max(0.85, this.probabilities.normal);
                // Reduce disorder probabilities proportionally
                const totalDisorderProb = this.probabilities.insomnia + this.probabilities.apnea + this.probabilities.rls;
                if (totalDisorderProb > 0.15) {
                    const scaleFactor = 0.15 / totalDisorderProb;
                    this.probabilities.insomnia *= scaleFactor;
                    this.probabilities.apnea *= scaleFactor;
                    this.probabilities.rls *= scaleFactor;
                }
            }
        } else {
            // Otherwise, set default probabilities based on prediction
            // Reset all probabilities first
            this.probabilities.normal = 0.0;
            this.probabilities.insomnia = 0.05;
            this.probabilities.apnea = 0.05;
            this.probabilities.rls = 0.05;
            
            // Set probabilities based on prediction text with some randomness for realism
            if (prediction.includes('Insomnia')) {
                // Primary disorder with high probability
                this.probabilities.insomnia = 0.7 + (Math.random() * 0.2); // 70-90%
                
                // Secondary possibilities with lower probabilities
                this.probabilities.apnea = 0.05 + (Math.random() * 0.15); // 5-20%
                this.probabilities.rls = 0.05 + (Math.random() * 0.1); // 5-15%
                
                // Set normal probability as the remainder
                this.probabilities.normal = 1.0 - (this.probabilities.insomnia + this.probabilities.apnea + this.probabilities.rls);
                
                console.log('Detected Insomnia pattern');
            } else if (prediction.includes('Sleep Apnea')) {
                // Primary disorder with high probability
                this.probabilities.apnea = 0.7 + (Math.random() * 0.2); // 70-90%
                
                // Secondary possibilities with lower probabilities
                this.probabilities.insomnia = 0.1 + (Math.random() * 0.15); // 10-25%
                this.probabilities.rls = 0.05 + (Math.random() * 0.1); // 5-15%
                
                // Set normal probability as the remainder
                this.probabilities.normal = 1.0 - (this.probabilities.insomnia + this.probabilities.apnea + this.probabilities.rls);
                
                console.log('Detected Sleep Apnea pattern');
            } else if (prediction.includes('RLS') || prediction.includes('Restless')) {
                // Primary disorder with high probability
                this.probabilities.rls = 0.7 + (Math.random() * 0.2); // 70-90%
                
                // Secondary possibilities with lower probabilities
                this.probabilities.insomnia = 0.1 + (Math.random() * 0.15); // 10-25%
                this.probabilities.apnea = 0.05 + (Math.random() * 0.1); // 5-15%
                
                // Set normal probability as the remainder
                this.probabilities.normal = 1.0 - (this.probabilities.insomnia + this.probabilities.apnea + this.probabilities.rls);
                
                console.log('Detected RLS pattern');
            } else if (prediction.includes('No sleeping disorder')) {
                // No sleep disorder - high normal probability, very low disorder probabilities
                this.probabilities.normal = 0.85 + (Math.random() * 0.1); // 85-95%
                
                // Very low probabilities for disorders
                this.probabilities.insomnia = 0.05 + (Math.random() * 0.05); // 5-10%
                this.probabilities.apnea = 0.03 + (Math.random() * 0.04);   // 3-7%
                this.probabilities.rls = 0.02 + (Math.random() * 0.03);     // 2-5%
                
                // Normalize to ensure sum is 1.0
                const total = this.probabilities.normal + this.probabilities.insomnia + 
                              this.probabilities.apnea + this.probabilities.rls;
                this.probabilities.normal /= total;
                this.probabilities.insomnia /= total;
                this.probabilities.apnea /= total;
                this.probabilities.rls /= total;
                
                console.log('Detected non-sleeping disorder pattern');
            } else {
                // Default case or unrecognized pattern
                const baseProb = 0.05 + (Math.random() * 0.15); // 5-20% base probability
                
                // Distribute probabilities more evenly for normal sleep
                this.probabilities.insomnia = baseProb;
                this.probabilities.apnea = baseProb * 0.8;
                this.probabilities.rls = baseProb * 0.6;
                this.probabilities.normal = 1.0 - (this.probabilities.insomnia + this.probabilities.apnea + this.probabilities.rls);
                
                console.log('Detected normal sleep pattern');
            }
            
            // Ensure probabilities are within valid range
            Object.keys(this.probabilities).forEach(key => {
                this.probabilities[key] = Math.min(Math.max(this.probabilities[key], 0), 1);
            });
        }
        
        console.log('Updated probabilities:', this.probabilities);
        
        // Update respiratory pattern based on prediction
        this.respiratoryPattern = this.detectRespiratoryPattern();
        console.log('Respiratory pattern:', this.respiratoryPattern);
        
        // Update sleep position
        this.sleepPosition = this.detectSleepPosition();
        console.log('Sleep position:', this.sleepPosition);
        
        // Clear existing data to start fresh
        this.eegData = [];
        this.hrvData = [];
        
        // Generate initial data points
        for (let i = 0; i < 50; i++) {
            this.eegData.push(this.generateEEGData());
            if (i % 2 === 0) { // Generate HRV at half the rate of EEG
                this.hrvData.push(this.generateHRVData());
            }
        }
        
        // Start monitoring automatically when probabilities are updated
        this.startMonitoring();
        
        // Update visualizations immediately
        this.updateVisualizations();
    }
}

// Initialize ECE processor when document is ready
document.addEventListener('DOMContentLoaded', () => {
    window.eceProcessor = new ECEProcessor();
    
    // Set up event listeners for monitoring controls
    const startBtn = document.getElementById('start-monitoring');
    const stopBtn = document.getElementById('stop-monitoring');
    
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            window.eceProcessor.startMonitoring();
        });
    }
    
    if (stopBtn) {
        stopBtn.addEventListener('click', () => {
            window.eceProcessor.stopMonitoring();
        });
    }
    
    // Check if there's a prediction already available
    const predictionElement = document.querySelector('.prediction-status strong');
    if (predictionElement && predictionElement.textContent) {
        window.eceProcessor.updateProbabilities(predictionElement.textContent);
    } else {
        // Initialize with default values for demonstration
        window.eceProcessor.updateProbabilities('No sleeping disorder');
    }
});