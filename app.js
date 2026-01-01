// Global Variables
let currentUser = null;
let currentProgressView = 'overall';
let syllabusData = [];
let currentTopicId = null;
let progressChart = null;
let subjectChart = null;

// Complete Syllabus Data
// Complete Syllabus Data
const syllabus = [
    // Paper 1: FR
    { id: 'fr1', subject: 'Paper 1: FR', topic: 'Introduction to GPFS', subtopic: 'Ind AS 1 basics', weightage: '10-15%', priority: 'B', estTime: 4 },
    { id: 'fr2', subject: 'Paper 1: FR', topic: 'Introduction to GPFS', subtopic: 'Schedule III Div II', weightage: '10-15%', priority: 'B', estTime: 2 },
    { id: 'fr3', subject: 'Paper 1: FR', topic: 'Introduction to GPFS', subtopic: 'Applicability criteria', weightage: '10-15%', priority: 'B', estTime: 2 },
    { id: 'fr4', subject: 'Paper 1: FR', topic: 'Conceptual Framework', subtopic: 'Application to GPFS', weightage: '5-10%', priority: 'A', estTime: 6 },
    { id: 'fr5', subject: 'Paper 1: FR', topic: 'Presentation of Items', subtopic: 'Ind AS 1: Presentation', weightage: '5-10%', priority: 'A', estTime: 3 },
    { id: 'fr6', subject: 'Paper 1: FR', topic: 'Presentation of Items', subtopic: 'Ind AS 34: Interim', weightage: '5-10%', priority: 'A', estTime: 2 },
    { id: 'fr7', subject: 'Paper 1: FR', topic: 'Presentation of Items', subtopic: 'Ind AS 7: Cash Flows', weightage: '5-10%', priority: 'A', estTime: 3 },
    { id: 'fr8', subject: 'Paper 1: FR', topic: 'Measurement Policies', subtopic: 'Ind AS 8: Policies/Errors', weightage: '5-10%', priority: 'A', estTime: 3 },
    { id: 'fr9', subject: 'Paper 1: FR', topic: 'Measurement Policies', subtopic: 'Ind AS 10: Events', weightage: '5-10%', priority: 'A', estTime: 2 },
    { id: 'fr10', subject: 'Paper 1: FR', topic: 'Measurement Policies', subtopic: 'Ind AS 113: Fair Value', weightage: '5-10%', priority: 'A', estTime: 2 },
    { id: 'fr11', subject: 'Paper 1: FR', topic: 'Income Statement', subtopic: 'Ind AS 115: Revenue', weightage: '5-10%', priority: 'A', estTime: 12 },
    { id: 'fr12', subject: 'Paper 1: FR', topic: 'Assets', subtopic: 'Ind AS 2: Inventories', weightage: '15-25%', priority: 'A', estTime: 4 },
    { id: 'fr13', subject: 'Paper 1: FR', topic: 'Assets', subtopic: 'Ind AS 16: PPE', weightage: '15-25%', priority: 'A', estTime: 5 },
    { id: 'fr14', subject: 'Paper 1: FR', topic: 'Assets', subtopic: 'Ind AS 116: Leases', weightage: '15-25%', priority: 'A', estTime: 6 },
    { id: 'fr15', subject: 'Paper 1: FR', topic: 'Assets', subtopic: 'Ind AS 23: Borrowing Costs', weightage: '15-25%', priority: 'A', estTime: 2 },
    { id: 'fr16', subject: 'Paper 1: FR', topic: 'Assets', subtopic: 'Ind AS 36: Impairment', weightage: '15-25%', priority: 'A', estTime: 4 },
    { id: 'fr17', subject: 'Paper 1: FR', topic: 'Assets', subtopic: 'Ind AS 38: Intangibles', weightage: '15-25%', priority: 'A', estTime: 3 },
    { id: 'fr18', subject: 'Paper 1: FR', topic: 'Liabilities', subtopic: 'Ind AS 19: Employee Benefits', weightage: '15-25%', priority: 'A', estTime: 5 },
    { id: 'fr19', subject: 'Paper 1: FR', topic: 'Liabilities', subtopic: 'Ind AS 37: Provisions', weightage: '15-25%', priority: 'A', estTime: 5 },
    { id: 'fr20', subject: 'Paper 1: FR', topic: 'Items Impacting FS', subtopic: 'Ind AS 12: Income Taxes', weightage: '15-20%', priority: 'A', estTime: 8 },
    { id: 'fr21', subject: 'Paper 1: FR', topic: 'Items Impacting FS', subtopic: 'Ind AS 21: FX Rates', weightage: '15-20%', priority: 'A', estTime: 2 },
    { id: 'fr22', subject: 'Paper 1: FR', topic: 'Disclosures', subtopic: 'Ind AS 24: Related Parties', weightage: '15-20%', priority: 'B', estTime: 2 },
    { id: 'fr23', subject: 'Paper 1: FR', topic: 'Disclosures', subtopic: 'Ind AS 33: EPS', weightage: '15-20%', priority: 'B', estTime: 2 },
    { id: 'fr24', subject: 'Paper 1: FR', topic: 'Disclosures', subtopic: 'Ind AS 108: Segments', weightage: '15-20%', priority: 'B', estTime: 2 },
    { id: 'fr25', subject: 'Paper 1: FR', topic: 'Financial Instruments', subtopic: 'Ind AS 32/107/109 Classification', weightage: '10-15%', priority: 'A', estTime: 8 },
    { id: 'fr26', subject: 'Paper 1: FR', topic: 'Financial Instruments', subtopic: 'Derivatives/Hedge Accounting', weightage: '10-15%', priority: 'A', estTime: 8 },
    { id: 'fr27', subject: 'Paper 1: FR', topic: 'Group Accounting', subtopic: 'Ind AS 103: Business Combos', weightage: '10-20%', priority: 'A', estTime: 10 },
    { id: 'fr28', subject: 'Paper 1: FR', topic: 'Group Accounting', subtopic: 'Ind AS 110/111/28: Consolidation', weightage: '10-20%', priority: 'A', estTime: 8 },
    { id: 'fr29', subject: 'Paper 1: FR', topic: 'First-time Adoption', subtopic: 'Ind AS 101', weightage: '5-10%', priority: 'B', estTime: 4 },
    { id: 'fr30', subject: 'Paper 1: FR', topic: 'FS Analysis', subtopic: 'Ind AS based analysis', weightage: '5-10%', priority: 'B', estTime: 5 },
    { id: 'fr31', subject: 'Paper 1: FR', topic: 'Ethics & Tech', subtopic: 'Ethical issues', weightage: '5-10%', priority: 'C', estTime: 2 },
    { id: 'fr32', subject: 'Paper 1: FR', topic: 'Ethics & Tech', subtopic: 'Technology evolution', weightage: '5-10%', priority: 'C', estTime: 1 },
    
    // Paper 2: AFM
    { id: 'afm1', subject: 'Paper 2: AFM', topic: 'Financial Policy', subtopic: 'CFO role + Value creation', weightage: '8-15%', priority: 'B', estTime: 3 },
    { id: 'afm2', subject: 'Paper 2: AFM', topic: 'Financial Policy', subtopic: 'Strategic framework', weightage: '8-15%', priority: 'B', estTime: 3 },
    { id: 'afm3', subject: 'Paper 2: AFM', topic: 'Risk Management', subtopic: 'Risk types + VaR', weightage: '8-15%', priority: 'A', estTime: 10 },
    { id: 'afm4', subject: 'Paper 2: AFM', topic: 'Advanced Cap Budgeting', subtopic: 'Inflation/Tech impact', weightage: '20-30%', priority: 'A', estTime: 7 },
    { id: 'afm5', subject: 'Paper 2: AFM', topic: 'Advanced Cap Budgeting', subtopic: 'Risk methods + APV', weightage: '20-30%', priority: 'A', estTime: 7 },
    { id: 'afm6', subject: 'Paper 2: AFM', topic: 'Security Analysis', subtopic: 'Fundamental Analysis', weightage: '20-30%', priority: 'A', estTime: 6 },
    { id: 'afm7', subject: 'Paper 2: AFM', topic: 'Security Analysis', subtopic: 'Technical Analysis + EMH', weightage: '20-30%', priority: 'A', estTime: 6 },
    { id: 'afm8', subject: 'Paper 2: AFM', topic: 'Security Valuation', subtopic: 'Equity/Pref/Debentures', weightage: '20-30%', priority: 'A', estTime: 6 },
    { id: 'afm9', subject: 'Paper 2: AFM', topic: 'Security Valuation', subtopic: 'CAPM + Risk premium', weightage: '20-30%', priority: 'A', estTime: 6 },
    { id: 'afm10', subject: 'Paper 2: AFM', topic: 'Portfolio Management', subtopic: 'Analysis/Selection/Revision', weightage: '20-30%', priority: 'A', estTime: 8 },
    { id: 'afm11', subject: 'Paper 2: AFM', topic: 'Portfolio Management', subtopic: 'Securitization + Mutual Funds', weightage: '20-30%', priority: 'A', estTime: 4 },
    { id: 'afm12', subject: 'Paper 2: AFM', topic: 'Derivatives', subtopic: 'Forwards/Futures/Options', weightage: '20-25%', priority: 'A', estTime: 8 },
    { id: 'afm13', subject: 'Paper 2: AFM', topic: 'Derivatives', subtopic: 'Swaps + Greeks', weightage: '20-25%', priority: 'A', estTime: 8 },
    { id: 'afm14', subject: 'Paper 2: AFM', topic: 'Forex Risk', subtopic: 'FX factors + SWIFT', weightage: '20-25%', priority: 'A', estTime: 12 },
    { id: 'afm15', subject: 'Paper 2: AFM', topic: 'Business Valuation', subtopic: 'Asset/Earning/Cashflow models', weightage: '10-15%', priority: 'A', estTime: 7 },
    { id: 'afm16', subject: 'Paper 2: AFM', topic: 'Business Valuation', subtopic: 'CAPM/APT + EVA/MVA', weightage: '10-15%', priority: 'A', estTime: 7 },
    { id: 'afm17', subject: 'Paper 2: AFM', topic: 'Mergers', subtopic: 'M&A + Takeovers + LBO', weightage: '2-5%', priority: 'A', estTime: 6 },
    { id: 'afm18', subject: 'Paper 2: AFM', topic: 'Startup Finance', subtopic: 'Unicorns + Funding', weightage: '2-5%', priority: 'B', estTime: 6 },
    
    // Paper 3: Audit
    { id: 'audit1', subject: 'Paper 3: Audit', topic: 'Quality Control', subtopic: 'SQC 1 + SA 220', weightage: '45-55%', priority: 'A', estTime: 6 },
    { id: 'audit2', subject: 'Paper 3: Audit', topic: 'General Principles', subtopic: 'SA 240 (Fraud) + SA 250', weightage: '45-55%', priority: 'A', estTime: 4 },
    { id: 'audit3', subject: 'Paper 3: Audit', topic: 'General Principles', subtopic: 'SA 260 + SA 299 (Joint Audit)', weightage: '45-55%', priority: 'A', estTime: 4 },
    { id: 'audit4', subject: 'Paper 3: Audit', topic: 'Audit Planning', subtopic: 'SA 300/450/520/540', weightage: '45-55%', priority: 'A', estTime: 5 },
    { id: 'audit5', subject: 'Paper 3: Audit', topic: 'Materiality & Risk', subtopic: 'SA 265/315/320/330', weightage: '3-6%', priority: 'A', estTime: 6 },
    { id: 'audit6', subject: 'Paper 3: Audit', topic: 'Audit Evidence', subtopic: 'SA 500/501/505/530', weightage: '3-6%', priority: 'A', estTime: 5 },
    { id: 'audit7', subject: 'Paper 3: Audit', topic: 'Completion', subtopic: 'SA 560/570/580', weightage: '17-24%', priority: 'A', estTime: 4 },
    { id: 'audit8', subject: 'Paper 3: Audit', topic: 'Reporting', subtopic: 'SA 700/701/705/706', weightage: '17-24%', priority: 'A', estTime: 6 },
    { id: 'audit9', subject: 'Paper 3: Audit', topic: 'Special Audits', subtopic: 'Banks + NBFC + PSU', weightage: '17-24%', priority: 'A', estTime: 5 },
    { id: 'audit10', subject: 'Paper 3: Audit', topic: 'Digital Auditing', subtopic: 'CAATs + AI + Data Analytics', weightage: '3-6%', priority: 'A', estTime: 8 },
    { id: 'audit11', subject: 'Paper 3: Audit', topic: 'Professional Ethics', subtopic: 'CA Act + IESBA Code', weightage: '17-24%', priority: 'A', estTime: 10 },
    
    // Paper 4: DT
    { id: 'dt1', subject: 'Paper 4: DT', topic: 'Company Taxation', subtopic: 'Computation - General Provisions', weightage: '40-45%', priority: 'A', estTime: 12 },
    { id: 'dt2', subject: 'Paper 4: DT', topic: 'Company Taxation', subtopic: 'Special Regimes (115BAA/BAB)', weightage: '40-45%', priority: 'A', estTime: 8 },
    { id: 'dt3', subject: 'Paper 4: DT', topic: 'Company Taxation', subtopic: 'Charitable Trusts (Sec 11-13)', weightage: '40-45%', priority: 'A', estTime: 5 },
    { id: 'dt4', subject: 'Paper 4: DT', topic: 'Company Taxation', subtopic: 'GAAR + Business Trusts', weightage: '40-45%', priority: 'A', estTime: 5 },
    { id: 'dt5', subject: 'Paper 4: DT', topic: 'Tax Administration', subtopic: 'TDS/TCS (Sec 192-206C)', weightage: '20-30%', priority: 'B', estTime: 6 },
    { id: 'dt6', subject: 'Paper 4: DT', topic: 'Tax Administration', subtopic: 'Assessment Procedures', weightage: '20-30%', priority: 'B', estTime: 5 },
    { id: 'dt7', subject: 'Paper 4: DT', topic: 'Tax Administration', subtopic: 'Appeals + Revision', weightage: '20-30%', priority: 'B', estTime: 4 },
    { id: 'dt8', subject: 'Paper 4: DT', topic: 'International Taxation', subtopic: 'Transfer Pricing (Sec 92)', weightage: '30-35%', priority: 'A', estTime: 10 },
    { id: 'dt9', subject: 'Paper 4: DT', topic: 'International Taxation', subtopic: 'Non-Resident Taxation', weightage: '30-35%', priority: 'A', estTime: 8 },
    { id: 'dt10', subject: 'Paper 4: DT', topic: 'International Taxation', subtopic: 'DTAA + BEPS', weightage: '30-35%', priority: 'A', estTime: 7 },
    
    // Paper 5: IDT
    { id: 'idt1', subject: 'Paper 5: IDT', topic: 'GST - Core Concepts', subtopic: 'Levy/Collection CGST/IGST', weightage: '45-65%', priority: 'A', estTime: 5 },
    { id: 'idt2', subject: 'Paper 5: IDT', topic: 'GST - Core Concepts', subtopic: 'Supply (Sec 7 + Sch I/II/III)', weightage: '45-65%', priority: 'A', estTime: 4 },
    { id: 'idt3', subject: 'Paper 5: IDT', topic: 'GST - Core Concepts', subtopic: 'Charge of Tax + RCM', weightage: '45-65%', priority: 'A', estTime: 3 },
    { id: 'idt4', subject: 'Paper 5: IDT', topic: 'GST - Core Concepts', subtopic: 'ITC (Sec 16-18)', weightage: '45-65%', priority: 'A', estTime: 6 },
    { id: 'idt5', subject: 'Paper 5: IDT', topic: 'GST - Procedures', subtopic: 'Registration (Sec 22-29)', weightage: '10-30%', priority: 'B', estTime: 4 },
    { id: 'idt6', subject: 'Paper 5: IDT', topic: 'GST - Procedures', subtopic: 'Returns (GSTR 1/3B/9)', weightage: '10-30%', priority: 'B', estTime: 4 },
    { id: 'idt7', subject: 'Paper 5: IDT', topic: 'GST - Compliance', subtopic: 'Demands/Recovery (Sec 73-76)', weightage: '15-30%', priority: 'B', estTime: 4 },
    { id: 'idt8', subject: 'Paper 5: IDT', topic: 'GST - Compliance', subtopic: 'Appeals/Advance Ruling', weightage: '15-30%', priority: 'B', estTime: 3 },
    { id: 'idt9', subject: 'Paper 5: IDT', topic: 'Customs', subtopic: 'Levy + Classification', weightage: '40-65%', priority: 'B', estTime: 4 },
    { id: 'idt10', subject: 'Paper 5: IDT', topic: 'Customs', subtopic: 'Import/Export Procedures', weightage: '40-65%', priority: 'B', estTime: 3 },
    { id: 'idt11', subject: 'Paper 5: IDT', topic: 'FTP', subtopic: 'Export Promotion Schemes', weightage: '10-20%', priority: 'C', estTime: 4 },
    
    // Paper 6: IBS
    { id: 'ibs1', subject: 'Paper 6: IBS', topic: 'Multi-disciplinary Cases', subtopic: 'FR + AFM + Audit + DT + IDT', weightage: '100%', priority: 'A', estTime: 60 }
];
// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    // Set default start date to today
    const today = new Date().toISOString().split('T')[0];
    if (document.getElementById('startDate')) {
        document.getElementById('startDate').value = today;
    }
    
    // Check for saved credentials
    const savedId = localStorage.getItem('rememberedId');
    if (savedId && document.getElementById('loginId')) {
        document.getElementById('loginId').value = savedId;
        document.getElementById('rememberMe').checked = true;
    }
    
    // Hide loading screen after 1 second
    setTimeout(() => {
        if (document.getElementById('loadingScreen')) {
            document.getElementById('loadingScreen').style.display = 'none';
        }
        
        // Check authentication state
        checkAuthState();
    }, 1000);
});

// Check authentication state
function checkAuthState() {
    firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
            // User is signed in
            currentUser = user;
            console.log("User signed in:", user.uid);
            
            // Check if user exists in Firestore
            const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
            
            if (!userDoc.exists) {
                // Create user document if it doesn't exist
                await firebase.firestore().collection('users').doc(user.uid).set({
                    uid: user.uid,
                    email: user.email,
                    name: user.displayName || user.email.split('@')[0],
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            } else {
                currentUser = {
                    ...user,
                    ...userDoc.data()
                };
            }
            
            await loadUserData();
            showApp();
        } else {
            // User is signed out
            showLoginScreen();
        }
    });
}

// Utility Functions
function showNotification(message, type = 'info', duration = 3000) {
    const toast = document.getElementById('notificationToast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

function formatDate(date) {
    if (!date) return 'N/A';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('en-IN', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
    });
}

// Auth Functions
function showSignup() {
    document.getElementById('loginForm').classList.remove('active');
    document.getElementById('signupForm').classList.add('active');
}

function showLogin() {
    document.getElementById('signupForm').classList.remove('active');
    document.getElementById('loginForm').classList.add('active');
}

async function login() {
    const email = document.getElementById('loginId').value.trim();
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    if (!email || !password) {
        showNotification('Please enter email and password', 'error');
        return;
    }
    
    const loginBtn = document.getElementById('loginBtn');
    if (!loginBtn) return;
    
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
    loginBtn.disabled = true;
    
    try {
        // Handle demo login
        if (email === 'demo@example.com' && password === 'demo123') {
            // Sign in anonymously for demo
            const userCredential = await firebase.auth().signInAnonymously();
            const user = userCredential.user;
            
            // Create demo user in Firestore
            await firebase.firestore().collection('users').doc(user.uid).set({
                uid: user.uid,
                userId: 'demo',
                name: 'Demo User',
                email: 'demo@example.com',
                isDemo: true,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // Initialize demo progress
            await initializeUserProgress(user.uid);
            
            currentUser = {
                uid: user.uid,
                userId: 'demo',
                name: 'Demo User',
                isDemo: true
            };
            
            showNotification('Logged in as Demo User', 'success');
        } else {
            // Regular login with email/password
            const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
            showNotification('Login successful!', 'success');
        }
        
        // Remember email if checkbox is checked
        if (rememberMe) {
            localStorage.setItem('rememberedId', email);
        } else {
            localStorage.removeItem('rememberedId');
        }
        
    } catch (error) {
        console.error('Login error:', error);
        let errorMessage = 'Login failed. ';
        
        switch (error.code) {
            case 'auth/invalid-email':
                errorMessage += 'Invalid email address.';
                break;
            case 'auth/user-disabled':
                errorMessage += 'This account has been disabled.';
                break;
            case 'auth/user-not-found':
                errorMessage += 'No account found with this email.';
                break;
            case 'auth/wrong-password':
                errorMessage += 'Incorrect password.';
                break;
            case 'auth/too-many-requests':
                errorMessage += 'Too many failed attempts. Please try again later.';
                break;
            default:
                errorMessage += error.message;
        }
        
        showNotification(errorMessage, 'error');
    } finally {
        if (loginBtn) {
            loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
            loginBtn.disabled = false;
        }
    }
}

async function signup() {
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    const name = document.getElementById('signupName').value.trim();
    
    if (!email || !password || !confirmPassword || !name) {
        showNotification('Please fill all fields', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    const signupBtn = document.getElementById('signupBtn');
    if (!signupBtn) return;
    
    signupBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
    signupBtn.disabled = true;
    
    try {
        // Create user with email/password
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Update profile with name
        await user.updateProfile({
            displayName: name
        });
        
        // Create user document in Firestore
        await firebase.firestore().collection('users').doc(user.uid).set({
            uid: user.uid,
            email: email,
            name: name,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Initialize user progress
        await initializeUserProgress(user.uid);
        
        showNotification('Account created successfully!', 'success');
        
    } catch (error) {
        console.error('Signup error:', error);
        let errorMessage = 'Signup failed. ';
        
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage += 'Email already registered.';
                break;
            case 'auth/invalid-email':
                errorMessage += 'Invalid email address.';
                break;
            case 'auth/operation-not-allowed':
                errorMessage += 'Email/password accounts are not enabled.';
                break;
            case 'auth/weak-password':
                errorMessage += 'Password is too weak.';
                break;
            default:
                errorMessage += error.message;
        }
        
        showNotification(errorMessage, 'error');
    } finally {
        if (signupBtn) {
            signupBtn.innerHTML = '<i class="fas fa-user-plus"></i> Sign Up';
            signupBtn.disabled = false;
        }
    }
}

async function initializeUserProgress(uid) {
    const progress = {};
    
    // Initialize with syllabus data
    syllabus.forEach(item => {
        progress[item.id] = {
            status: 'not-started',
            actualHours: 0,
            plannedHours: item.estTime,
            notes: '',
            lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
            completedDate: null
        };
    });
    
    await firebase.firestore().collection('userProgress').doc(uid).set({ progress });
}

function showLoginScreen() {
    const loginScreen = document.getElementById('loginScreen');
    const appScreen = document.getElementById('appScreen');
    
    if (loginScreen) loginScreen.classList.add('active');
    if (appScreen) appScreen.classList.remove('active');
    
    // Clear sensitive data
    if (document.getElementById('loginPassword')) {
        document.getElementById('loginPassword').value = '';
    }
    if (document.getElementById('signupPassword')) {
        document.getElementById('signupPassword').value = '';
    }
    if (document.getElementById('signupConfirmPassword')) {
        document.getElementById('signupConfirmPassword').value = '';
    }
}

function showApp() {
    const loginScreen = document.getElementById('loginScreen');
    const appScreen = document.getElementById('appScreen');
    
    if (loginScreen) loginScreen.classList.remove('active');
    if (appScreen) appScreen.classList.add('active');
    
    // Update user welcome message
    const userWelcome = document.getElementById('userWelcome');
    if (userWelcome && currentUser) {
        userWelcome.textContent = currentUser.name || currentUser.email || 'User';
    }
    
    // Initialize app
    initializeApp();
}

async function logout() {
    try {
        await firebase.auth().signOut();
        currentUser = null;
        syllabusData = [];
        showNotification('Logged out successfully', 'success');
        showLoginScreen();
    } catch (error) {
        console.error('Logout error:', error);
        showNotification('Error logging out', 'error');
    }
}

// Data Loading Functions
async function loadUserData() {
    if (!currentUser) return;
    
    try {
        // Load user progress
        const progressDoc = await firebase.firestore().collection('userProgress').doc(currentUser.uid).get();
        
        // Initialize syllabus data with default values
        syllabusData = syllabus.map(item => {
            const defaultProgress = {
                status: 'not-started',
                actualHours: 0,
                plannedHours: item.estTime,
                notes: '',
                lastUpdated: null,
                completedDate: null
            };
            
            if (progressDoc.exists) {
                const userProgress = progressDoc.data().progress || {};
                return {
                    ...item,
                    ...defaultProgress,
                    ...userProgress[item.id]
                };
            }
            
            return {
                ...item,
                ...defaultProgress
            };
        });
        
        // Load custom topics if any
        const customQuery = firebase.firestore().collection('customTopics')
            .where('userId', '==', currentUser.uid);
        const customSnapshot = await customQuery.get();
            
        if (!customSnapshot.empty) {
            customSnapshot.forEach(doc => {
                const customTopic = doc.data();
                syllabusData.push({
                    ...customTopic,
                    id: doc.id,
                    isCustom: true
                });
            });
        }
        
    } catch (error) {
        console.error('Error loading user data:', error);
        showNotification('Error loading your data', 'error');
    }
}

// App Initialization
function initializeApp() {
    // Update dashboard
    updateDashboard();
    
    // Load tables
    loadSyllabusTable();
    
    // Calculate days left until exam
    calculateDaysLeft();
}

// Dashboard Functions
function updateDashboard() {
    calculateKPIs();
    updateCharts();
    loadRecentActivity();
    updateSidebarProgress();
}

function calculateKPIs() {
    const totalPlanned = syllabusData.reduce((sum, item) => sum + (item.plannedHours || item.estTime), 0);
    const totalActual = syllabusData.reduce((sum, item) => sum + (item.actualHours || 0), 0);
    const completedTopics = syllabusData.filter(item => item.status === 'completed').length;
    const totalTopics = syllabusData.length;
    const completionPercent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
    
    // Update KPI elements
    const plannedHoursElem = document.getElementById('plannedHours');
    const actualHoursElem = document.getElementById('actualHours');
    const completionPercentElem = document.getElementById('completionPercent');
    const topicsDoneElem = document.getElementById('topicsDone');
    const daysLeftElem = document.getElementById('daysLeft');
    
    if (plannedHoursElem) plannedHoursElem.textContent = totalPlanned;
    if (actualHoursElem) actualHoursElem.textContent = totalActual;
    if (completionPercentElem) completionPercentElem.textContent = `${completionPercent}%`;
    if (topicsDoneElem) topicsDoneElem.textContent = `${completedTopics}/${totalTopics}`;
    if (daysLeftElem) daysLeftElem.textContent = calculateDaysLeft();
}

function calculateDaysLeft() {
    const today = new Date();
    const examDate = new Date(today);
    examDate.setMonth(examDate.getMonth() + 6); // 6 months from now
    
    const timeDiff = examDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    return daysLeft > 0 ? daysLeft : 0;
}

function updateSidebarProgress() {
    const canvas = document.getElementById('overallProgressCircle');
    const textElem = document.getElementById('overallProgressText');
    const subtitleElem = document.getElementById('progressSubtitle');
    
    if (!canvas || !textElem || !subtitleElem) return;
    
    const completedTopics = syllabusData.filter(item => item.status === 'completed').length;
    const totalTopics = syllabusData.length;
    const percent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
    
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background circle
    ctx.beginPath();
    ctx.arc(40, 40, 36, 0, Math.PI * 2);
    ctx.strokeStyle = '#e9ecef';
    ctx.lineWidth = 6;
    ctx.stroke();
    
    // Draw progress arc
    const endAngle = (Math.PI * 2 * percent / 100) - Math.PI / 2;
    ctx.beginPath();
    ctx.arc(40, 40, 36, -Math.PI / 2, endAngle);
    ctx.strokeStyle = '#4361ee';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.stroke();
    
    textElem.textContent = `${percent}%`;
    subtitleElem.textContent = `${completedTopics} of ${totalTopics} topics`;
}

function updateCharts() {
    // Destroy existing charts
    if (progressChart) progressChart.destroy();
    if (subjectChart) subjectChart.destroy();
    
    // Progress Overview Chart
    const progressCtx = document.getElementById('progressChart');
    if (progressCtx) {
        progressChart = new Chart(progressCtx.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Completed', 'In Progress', 'Not Started'],
                datasets: [{
                    data: [
                        syllabusData.filter(item => item.status === 'completed').length,
                        syllabusData.filter(item => item.status === 'in-progress').length,
                        syllabusData.filter(item => item.status === 'not-started').length
                    ],
                    backgroundColor: ['#4cc9f0', '#f72585', '#e9ecef'],
                    borderWidth: 0,
                    borderRadius: 10
                }]
            },
            options: {
                cutout: '70%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            font: { size: 13 }
                        }
                    }
                }
            }
        });
    }
    
    // Subject Progress Chart
    const subjectCtx = document.getElementById('subjectChart');
    if (subjectCtx) {
        const subjects = ['Paper 1: FR', 'Paper 2: AFM', 'Paper 3: Audit', 'Paper 4: DT', 'Paper 5: IDT', 'Paper 6: IBS'];
        
        const subjectData = subjects.map(subject => {
            const subjectItems = syllabusData.filter(item => item.subject === subject);
            if (subjectItems.length === 0) return 0;
            const completed = subjectItems.filter(item => item.status === 'completed').length;
            return Math.round((completed / subjectItems.length) * 100);
        });
        
        subjectChart = new Chart(subjectCtx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: subjects.map(s => s.split(': ')[1]),
                datasets: [{
                    label: 'Completion %',
                    data: subjectData,
                    backgroundColor: [
                        'rgba(67, 97, 238, 0.8)',
                        'rgba(76, 201, 240, 0.8)',
                        'rgba(247, 37, 133, 0.8)',
                        'rgba(114, 9, 183, 0.8)',
                        'rgba(58, 12, 163, 0.8)',
                        'rgba(86, 11, 173, 0.8)'
                    ],
                    borderColor: [
                        '#4361ee',
                        '#4cc9f0',
                        '#f72585',
                        '#7209b7',
                        '#3a0ca3',
                        '#560bad'
                    ],
                    borderWidth: 2,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { callback: value => value + '%' }
                    }
                },
                plugins: { legend: { display: false } }
            }
        });
    }
}

function loadRecentActivity() {
    const activityList = document.getElementById('recentActivity');
    if (!activityList) return;
    
    activityList.innerHTML = '';
    
    // Sort by lastUpdated date
    const recentItems = [...syllabusData]
        .filter(item => item.lastUpdated)
        .sort((a, b) => {
            const dateA = a.lastUpdated ? (a.lastUpdated.toDate ? a.lastUpdated.toDate() : new Date(a.lastUpdated)) : new Date(0);
            const dateB = b.lastUpdated ? (b.lastUpdated.toDate ? b.lastUpdated.toDate() : new Date(b.lastUpdated)) : new Date(0);
            return dateB - dateA;
        })
        .slice(0, 5);
    
    if (recentItems.length === 0) {
        activityList.innerHTML = `
            <div class="activity-item">
                <i class="fas fa-info-circle text-info"></i>
                <span>No recent activity. Start studying!</span>
            </div>
        `;
        return;
    }
    
    recentItems.forEach(item => {
        const date = item.lastUpdated ? formatDate(item.lastUpdated) : 'Recently';
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        
        let icon = 'fa-info-circle';
        let colorClass = 'text-info';
        
        if (item.status === 'completed') {
            icon = 'fa-check-circle';
            colorClass = 'text-success';
        } else if (item.status === 'in-progress') {
            icon = 'fa-play-circle';
            colorClass = 'text-warning';
        }
        
        activityItem.innerHTML = `
            <i class="fas ${icon} ${colorClass}"></i>
            <div>
                <strong>${item.subtopic}</strong>
                <div class="activity-details">
                    <span>${item.subject} • ${formatStatus(item.status)} • ${item.actualHours || 0} hrs</span>
                    <small>${date}</small>
                </div>
            </div>
        `;
        activityList.appendChild(activityItem);
    });
}

// Study Progress Table
function loadSyllabusTable() {
    const tableBody = document.getElementById('syllabusTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    const subjectFilter = document.getElementById('subjectFilter');
    const statusFilter = document.getElementById('statusFilter');
    const priorityFilter = document.getElementById('priorityFilter');
    
    let filteredData = syllabusData;
    
    if (subjectFilter && subjectFilter.value !== 'all') {
        filteredData = filteredData.filter(item => item.subject === subjectFilter.value);
    }
    
    if (statusFilter && statusFilter.value !== 'all') {
        filteredData = filteredData.filter(item => item.status === statusFilter.value);
    }
    
    if (priorityFilter && priorityFilter.value !== 'all') {
        filteredData = filteredData.filter(item => item.priority === priorityFilter.value);
    }
    
    if (filteredData.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="9" class="text-center">
                    <div class="empty-state">
                        <i class="fas fa-search"></i>
                        <h4>No topics found</h4>
                        <p>Try changing your filters</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    filteredData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.subject}</td>
            <td>${item.topic}</td>
            <td>${item.subtopic}</td>
            <td>${item.weightage}</td>
            <td><span class="priority-badge priority-${item.priority}">${item.priority}</span></td>
            <td>${item.plannedHours || item.estTime}</td>
            <td>${item.actualHours || 0}</td>
            <td><span class="status-badge status-${item.status}">${formatStatus(item.status)}</span></td>
            <td>
                <button class="btn-update" onclick="openProgressModal('${item.id}')">
                    <i class="fas fa-edit"></i> Update
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function formatStatus(status) {
    const statusMap = {
        'not-started': 'Not Started',
        'in-progress': 'In Progress',
        'completed': 'Completed'
    };
    return statusMap[status] || status;
}

// Modal Functions
function openProgressModal(itemId) {
    currentTopicId = itemId;
    const item = syllabusData.find(i => i.id === itemId);
    if (!item) return;
    
    const modal = document.getElementById('progressModal');
    if (!modal) return;
    
    const topicName = document.getElementById('modalTopicName');
    const subtopicName = document.getElementById('modalSubtopicName');
    const plannedHoursInput = document.getElementById('plannedHoursInput');
    const actualHoursInput = document.getElementById('actualHoursInput');
    const progressNotes = document.getElementById('progressNotes');
    
    if (topicName) topicName.textContent = item.topic;
    if (subtopicName) subtopicName.textContent = item.subtopic;
    if (plannedHoursInput) plannedHoursInput.value = item.plannedHours || item.estTime;
    if (actualHoursInput) actualHoursInput.value = item.actualHours || 0;
    if (progressNotes) progressNotes.value = item.notes || '';
    
    // Set status buttons
    document.querySelectorAll('.status-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.classList.contains(item.status)) {
            btn.classList.add('active');
        }
    });
    
    modal.classList.add('active');
}

function closeProgressModal() {
    const modal = document.getElementById('progressModal');
    if (modal) modal.classList.remove('active');
    currentTopicId = null;
}

function setStatus(status) {
    document.querySelectorAll('.status-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

async function saveProgress() {
    if (!currentTopicId || !currentUser) return;
    
    const item = syllabusData.find(i => i.id === currentTopicId);
    if (!item) return;
    
    const statusBtn = document.querySelector('.status-btn.active');
    const plannedHoursInput = document.getElementById('plannedHoursInput');
    const actualHoursInput = document.getElementById('actualHoursInput');
    const progressNotes = document.getElementById('progressNotes');
    
    if (!statusBtn || !plannedHoursInput || !actualHoursInput) return;
    
    const status = statusBtn.classList[1];
    const plannedHours = parseFloat(plannedHoursInput.value) || item.estTime;
    const actualHours = parseFloat(actualHoursInput.value) || 0;
    const notes = progressNotes ? progressNotes.value : '';
    const completedDate = status === 'completed' ? new Date().toISOString().split('T')[0] : null;
    
    try {
        const progressRef = firebase.firestore().collection('userProgress').doc(currentUser.uid);
        const doc = await progressRef.get();
        const currentProgress = doc.exists ? doc.data().progress : {};
        
        currentProgress[currentTopicId] = {
            status: status,
            actualHours: actualHours,
            plannedHours: plannedHours,
            notes: notes,
            lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
            completedDate: completedDate
        };
        
        await progressRef.set({ progress: currentProgress }, { merge: true });
        
        // Update local data
        const itemIndex = syllabusData.findIndex(i => i.id === currentTopicId);
        if (itemIndex !== -1) {
            syllabusData[itemIndex] = {
                ...syllabusData[itemIndex],
                status,
                actualHours,
                plannedHours,
                notes,
                lastUpdated: new Date(),
                completedDate
            };
        }
        
        closeProgressModal();
        loadSyllabusTable();
        updateDashboard();
        
        showNotification('Progress saved successfully!', 'success');
        
    } catch (error) {
        console.error('Error saving progress:', error);
        showNotification('Error saving progress', 'error');
    }
}

// UI Functions
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    
    if (sidebar) sidebar.classList.toggle('collapsed');
    if (mainContent) mainContent.classList.toggle('expanded');
}

function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(navItem => {
        navItem.classList.remove('active');
    });
    
    // Show selected tab
    const tab = document.getElementById(tabName + 'Tab');
    if (tab) tab.classList.add('active');
    
    // Set active nav item
    const navItem = document.querySelector(`.nav-item[onclick*="${tabName}"]`);
    if (navItem) navItem.classList.add('active');
    
    // Load data for specific tabs
    switch(tabName) {
        case 'dashboard':
            updateDashboard();
            break;
        case 'progress':
            loadSyllabusTable();
            break;
    }
}

// Expose functions to global scope
window.showSignup = showSignup;
window.showLogin = showLogin;
window.login = login;
window.signup = signup;
window.logout = logout;
window.toggleSidebar = toggleSidebar;
window.showTab = showTab;
window.openProgressModal = openProgressModal;
window.closeProgressModal = closeProgressModal;
window.setStatus = setStatus;
window.saveProgress = saveProgress;
