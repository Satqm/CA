// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { 
  getAuth, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInAnonymously,
  signOut 
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBVUi-vAyvE-g_iK4W9zbTTa5Ps8MwZEtg",
  authDomain: "ca-final-537aa.firebaseapp.com",
  projectId: "ca-final-537aa",
  storageBucket: "ca-final-537aa.firebasestorage.app",
  messagingSenderId: "156489737512",
  appId: "1:156489737512:web:f8b06ec7cba71ddfe99c1d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Global Variables
let currentUser = null;
let currentProgressView = 'overall';
let syllabusData = [];
let currentTopicId = null;
let progressChart = null;
let subjectChart = null;
let overallProgressChart = null;

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
    document.getElementById('startDate').value = today;
    
    // Hide loading screen after 1.5 seconds
    setTimeout(() => {
        document.getElementById('loadingScreen').style.display = 'none';
        
        // Check auth state
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                currentUser = user;
                await loadUserData();
                showApp();
            } else {
                showLoginScreen();
            }
        });
        
        // Check for saved credentials
        const savedId = localStorage.getItem('rememberedId');
        if (savedId) {
            document.getElementById('loginId').value = savedId;
            document.getElementById('rememberMe').checked = true;
        }
    }, 1500);
});

// Utility Functions
function showNotification(message, type = 'info', duration = 3000) {
    const toast = document.getElementById('notificationToast');
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
    const id = document.getElementById('loginId').value.trim();
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    if (!id || !password) {
        showNotification('Please enter ID and password', 'error');
        return;
    }
    
    const loginBtn = document.getElementById('loginBtn');
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
    loginBtn.disabled = true;
    
    try {
        // Check if it's demo login
        if (id === 'demo' && password === 'demo123') {
            // Create demo user
            const userCredential = await signInAnonymously(auth);
            const user = userCredential.user;
            
            // Check if demo user exists
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (!userDoc.exists()) {
                await setDoc(doc(db, 'users', user.uid), {
                    uid: user.uid,
                    userId: 'demo',
                    name: 'Demo User',
                    email: 'demo@cafinal.com',
                    isDemo: true,
                    createdAt: serverTimestamp()
                });
                
                // Initialize demo progress
                await initializeUserProgress(user.uid);
            }
            
            currentUser = {
                uid: user.uid,
                userId: 'demo',
                name: 'Demo User',
                isDemo: true
            };
            
            showNotification('Logged in as Demo User', 'success');
        } else {
            // Regular login - find user by ID
            const usersQuery = query(
                collection(db, 'users'),
                where('userId', '==', id),
                limit(1)
            );
            const usersSnapshot = await getDocs(usersQuery);
            
            if (usersSnapshot.empty) {
                throw new Error('User ID not found');
            }
            
            const userDoc = usersSnapshot.docs[0];
            const userData = userDoc.data();
            
            // Sign in with email and password
            const userCredential = await signInWithEmailAndPassword(
                auth, 
                userData.email, 
                password
            );
            
            currentUser = {
                uid: userCredential.user.uid,
                ...userData
            };
            
            showNotification(`Welcome back, ${userData.name}!`, 'success');
        }
        
        // Remember ID if checkbox is checked
        if (rememberMe) {
            localStorage.setItem('rememberedId', id);
        } else {
            localStorage.removeItem('rememberedId');
        }
        
        await loadUserData();
        showApp();
        
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Login failed: ' + error.message, 'error');
    } finally {
        loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
        loginBtn.disabled = false;
    }
}

async function signup() {
    const id = document.getElementById('signupId').value.trim();
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    
    if (!id || !name || !email || !password) {
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
    signupBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
    signupBtn.disabled = true;
    
    try {
        // Check if ID already exists
        const idQuery = query(
            collection(db, 'users'),
            where('userId', '==', id),
            limit(1)
        );
        const idCheck = await getDocs(idQuery);
        
        if (!idCheck.empty) {
            throw new Error('User ID already taken');
        }
        
        // Check if email already exists
        const emailQuery = query(
            collection(db, 'users'),
            where('email', '==', email),
            limit(1)
        );
        const emailCheck = await getDocs(emailQuery);
        
        if (!emailCheck.empty) {
            throw new Error('Email already registered');
        }
        
        // Create user with email/password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Create user document
        await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            userId: id,
            name: name,
            email: email,
            createdAt: serverTimestamp()
        });
        
        // Initialize progress
        await initializeUserProgress(user.uid);
        
        currentUser = {
            uid: user.uid,
            userId: id,
            name: name,
            email: email
        };
        
        showNotification('Account created successfully!', 'success');
        await loadUserData();
        showApp();
        
    } catch (error) {
        console.error('Signup error:', error);
        showNotification('Signup failed: ' + error.message, 'error');
    } finally {
        signupBtn.innerHTML = '<i class="fas fa-user-plus"></i> Sign Up';
        signupBtn.disabled = false;
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
            lastUpdated: serverTimestamp(),
            completedDate: null
        };
    });
    
    await setDoc(doc(db, 'userProgress', uid), { progress });
}

function showLoginScreen() {
    document.getElementById('loadingScreen').style.display = 'none';
    document.getElementById('loginScreen').classList.add('active');
    document.getElementById('appScreen').classList.remove('active');
    
    // Clear sensitive data
    document.getElementById('loginPassword').value = '';
    document.getElementById('signupPassword').value = '';
    document.getElementById('signupConfirmPassword').value = '';
}

function showApp() {
    document.getElementById('loginScreen').classList.remove('active');
    document.getElementById('appScreen').classList.add('active');
    
    document.getElementById('userWelcome').textContent = currentUser.name || currentUser.userId;
    
    // Initialize app
    initializeApp();
}

async function logout() {
    try {
        await signOut(auth);
        currentUser = null;
        syllabusData = [];
        showLoginScreen();
        showNotification('Logged out successfully', 'success');
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
        const progressDoc = await getDoc(doc(db, 'userProgress', currentUser.uid));
        
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
            
            if (progressDoc.exists()) {
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
        const customQuery = query(
            collection(db, 'customTopics'),
            where('userId', '==', currentUser.uid)
        );
        const customTopics = await getDocs(customQuery);
            
        if (!customTopics.empty) {
            customTopics.forEach(doc => {
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
    
    // Set up event listeners
    setupEventListeners();
    
    // Calculate days left until exam (assuming 6 months from now)
    calculateDaysLeft();
}

function setupEventListeners() {
    // Auto-save for tracker inputs
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('auto-save')) {
            const itemId = e.target.dataset.id;
            saveProgressDebounced(itemId);
        }
    });
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
    
    document.getElementById('plannedHours').textContent = totalPlanned;
    document.getElementById('actualHours').textContent = totalActual;
    document.getElementById('completionPercent').textContent = `${completionPercent}%`;
    document.getElementById('topicsDone').textContent = `${completedTopics}/${totalTopics}`;
    
    // Update days left
    const daysLeft = calculateDaysLeft();
    document.getElementById('daysLeft').textContent = daysLeft;
}

function updateSidebarProgress() {
    const completedTopics = syllabusData.filter(item => item.status === 'completed').length;
    const totalTopics = syllabusData.length;
    const percent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
    
    const canvas = document.getElementById('overallProgressCircle');
    const ctx = canvas.getContext('2d');
    const textElem = document.getElementById('overallProgressText');
    const subtitleElem = document.getElementById('progressSubtitle');
    
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

function calculateDaysLeft() {
    const today = new Date();
    const examDate = new Date(today);
    examDate.setMonth(examDate.getMonth() + 6); // 6 months from now
    
    const timeDiff = examDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    return daysLeft > 0 ? daysLeft : 0;
}

function updateCharts() {
    // Destroy existing charts
    if (progressChart) progressChart.destroy();
    if (subjectChart) subjectChart.destroy();
    
    // Progress Overview Chart
    const progressCtx = document.getElementById('progressChart').getContext('2d');
    progressChart = new Chart(progressCtx, {
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
                        font: {
                            size: 13
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.raw;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${context.label}: ${value} topics (${percentage}%)`;
                        }
                    }
                }
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    });
    
    // Subject Progress Chart
    const subjectCtx = document.getElementById('subjectChart').getContext('2d');
    const subjects = ['Paper 1: FR', 'Paper 2: AFM', 'Paper 3: Audit', 'Paper 4: DT', 'Paper 5: IDT', 'Paper 6: IBS'];
    
    const subjectData = subjects.map(subject => {
        const subjectItems = syllabusData.filter(item => item.subject === subject);
        if (subjectItems.length === 0) return 0;
        const completed = subjectItems.filter(item => item.status === 'completed').length;
        return Math.round((completed / subjectItems.length) * 100);
    });
    
    subjectChart = new Chart(subjectCtx, {
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
                borderRadius: 8,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: value => value + '%'
                    },
                    grid: {
                        display: false
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeOutQuart'
            }
        }
    });
}

function setProgressView(view) {
    currentProgressView = view;
    
    // Update button states
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Show/hide subject dropdown
    const subjectDropdown = document.getElementById('subjectFilterDashboard');
    if (view === 'subject') {
        subjectDropdown.style.display = 'inline-block';
    } else {
        subjectDropdown.style.display = 'none';
    }
    
    updateDashboardCharts();
}

function updateDashboardCharts() {
    // This function would update charts based on selected subject
    // For now, just update the main charts
    updateCharts();
}

function loadRecentActivity() {
    const activityList = document.getElementById('recentActivity');
    activityList.innerHTML = '';
    
    // Sort by lastUpdated date
    const recentItems = [...syllabusData]
        .filter(item => item.lastUpdated)
        .sort((a, b) => {
            const dateA = a.lastUpdated ? (a.lastUpdated.toDate ? a.lastUpdated.toDate() : new Date(a.lastUpdated)) : new Date(0);
            const dateB = b.lastUpdated ? (b.lastUpdated.toDate ? b.lastUpdated.toDate() : new Date(b.lastUpdated)) : new Date(0);
            return dateB - dateA;
        })
        .slice(0, 10);
    
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
    tableBody.innerHTML = '';
    
    const subjectFilter = document.getElementById('subjectFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    const priorityFilter = document.getElementById('priorityFilter').value;
    
    let filteredData = syllabusData;
    
    if (subjectFilter !== 'all') {
        filteredData = filteredData.filter(item => item.subject === subjectFilter);
    }
    
    if (statusFilter !== 'all') {
        filteredData = filteredData.filter(item => item.status === statusFilter);
    }
    
    if (priorityFilter !== 'all') {
        filteredData = filteredData.filter(item => item.priority === priorityFilter);
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
                ${item.isCustom ? `
                    <button class="btn-delete" onclick="deleteCustomTopic('${item.id}')" style="margin-left: 8px;">
                        <i class="fas fa-trash"></i>
                    </button>
                ` : ''}
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

// Progress Tracker Functions
async function loadSubjectForTracker() {
    const subject = document.getElementById('trackerSubject').value;
    if (!subject) return;
    
    const trackerContent = document.getElementById('trackerContent');
    trackerContent.innerHTML = '<div class="loading">Loading topics...</div>';
    
    try {
        const subjectItems = syllabusData.filter(item => item.subject === subject);
        
        if (subjectItems.length === 0) {
            trackerContent.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-book"></i>
                    <h3>No topics found for ${subject}</h3>
                    <p>Add custom topics or check back later</p>
                    <button class="btn-primary" onclick="openCustomPlanModal()">
                        <i class="fas fa-plus"></i> Add Custom Topic
                    </button>
                </div>
            `;
            return;
        }
        
        let html = `
            <div class="subject-header">
                <h3>${subject}</h3>
                <p>Track your progress for each topic</p>
            </div>
            
            <div class="topic-tracker">
        `;
        
        // Group by topic
        const topics = {};
        subjectItems.forEach(item => {
            if (!topics[item.topic]) {
                topics[item.topic] = [];
            }
            topics[item.topic].push(item);
        });
        
        // Generate HTML for each topic
        Object.entries(topics).forEach(([topicName, subtopics]) => {
            html += `
                <div class="topic-item">
                    <div class="topic-header">
                        <h4>${topicName}</h4>
                        <span class="topic-weightage">${subtopics[0].weightage}</span>
                    </div>
            `;
            
            // Add subtopics
            subtopics.forEach(subtopic => {
                html += `
                    <div class="subtopic-item">
                        <div class="subtopic-info">
                            <div class="subtopic-name">${subtopic.subtopic}</div>
                            <div class="subtopic-meta">
                                <span><i class="fas fa-weight"></i> ${subtopic.weightage}</span>
                                <span><i class="fas fa-flag"></i> ${subtopic.priority}</span>
                                <span><i class="fas fa-clock"></i> Est: ${subtopic.estTime}h</span>
                            </div>
                        </div>
                        <div class="subtopic-actions">
                            <input type="number" 
                                   class="hours-input planned-hours auto-save" 
                                   data-id="${subtopic.id}"
                                   value="${subtopic.plannedHours || subtopic.estTime}"
                                   placeholder="Planned hrs"
                                   min="0" step="0.5">
                            <input type="number" 
                                   class="hours-input actual-hours auto-save" 
                                   data-id="${subtopic.id}"
                                   value="${subtopic.actualHours || 0}"
                                   placeholder="Actual hrs"
                                   min="0" step="0.5">
                            <select class="status-select auto-save" data-id="${subtopic.id}">
                                <option value="not-started" ${subtopic.status === 'not-started' ? 'selected' : ''}>Not Started</option>
                                <option value="in-progress" ${subtopic.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                                <option value="completed" ${subtopic.status === 'completed' ? 'selected' : ''}>Completed</option>
                            </select>
                            <button class="btn-mark" onclick="saveProgress('${subtopic.id}')">
                                <i class="fas fa-save"></i> Save
                            </button>
                        </div>
                    </div>
                `;
            });
            
            html += `</div>`;
        });
        
        // Add progress summary
        const summary = calculateSubjectSummary(subjectItems);
        html += `
            </div>
            
            <div class="progress-summary">
                <div class="summary-item">
                    <div class="summary-value">${summary.totalPlanned}</div>
                    <div class="summary-label">Planned Hours</div>
                </div>
                <div class="summary-item">
                    <div class="summary-value">${summary.totalActual}</div>
                    <div class="summary-label">Actual Hours</div>
                </div>
                <div class="summary-item">
                    <div class="summary-value">${summary.completionRate}%</div>
                    <div class="summary-label">Completion Rate</div>
                </div>
                <div class="summary-item">
                    <div class="summary-value">${summary.completedTopics}/${summary.totalTopics}</div>
                    <div class="summary-label">Topics Done</div>
                </div>
            </div>
        `;
        
        trackerContent.innerHTML = html;
        
    } catch (error) {
        console.error('Error loading subject:', error);
        trackerContent.innerHTML = '<div class="error">Error loading subject data</div>';
    }
}

function calculateSubjectSummary(subjectItems) {
    let totalPlanned = 0;
    let totalActual = 0;
    let completedTopics = 0;
    
    subjectItems.forEach(item => {
        totalPlanned += item.plannedHours || item.estTime;
        totalActual += item.actualHours || 0;
        if (item.status === 'completed') {
            completedTopics++;
        }
    });
    
    const completionRate = subjectItems.length > 0 ? 
        Math.round((completedTopics / subjectItems.length) * 100) : 0;
    
    return {
        totalPlanned,
        totalActual,
        completedTopics,
        totalTopics: subjectItems.length,
        completionRate
    };
}

function showAllTopics() {
    const trackerContent = document.getElementById('trackerContent');
    trackerContent.innerHTML = '<div class="loading">Loading all topics...</div>';
    
    // Group by subject
    const subjects = {};
    syllabusData.forEach(item => {
        if (!subjects[item.subject]) {
            subjects[item.subject] = [];
        }
        subjects[item.subject].push(item);
    });
    
    let html = '<div class="all-topics">';
    
    Object.entries(subjects).forEach(([subjectName, items]) => {
        const summary = calculateSubjectSummary(items);
        
        html += `
            <div class="subject-summary">
                <h4>${subjectName}</h4>
                <div class="summary-stats">
                    <span>${summary.completedTopics}/${summary.totalTopics} topics</span>
                    <span>${summary.completionRate}% complete</span>
                    <span>${summary.totalActual}/${summary.totalPlanned} hours</span>
                </div>
                <button class="btn-secondary" onclick="document.getElementById('trackerSubject').value='${subjectName}'; loadSubjectForTracker();">
                    <i class="fas fa-arrow-right"></i> View Details
                </button>
            </div>
        `;
    });
    
    html += '</div>';
    trackerContent.innerHTML = html;
}

// Modal Functions
function openProgressModal(itemId) {
    currentTopicId = itemId;
    const item = syllabusData.find(i => i.id === itemId);
    if (!item) return;
    
    document.getElementById('modalTopicName').textContent = item.topic;
    document.getElementById('modalSubtopicName').textContent = item.subtopic;
    document.getElementById('plannedHoursInput').value = item.plannedHours || item.estTime;
    document.getElementById('actualHoursInput').value = item.actualHours || 0;
    document.getElementById('progressNotes').value = item.notes || '';
    document.getElementById('completionDate').value = item.completedDate ? 
        formatDate(item.completedDate).split(' ').reverse().join('-') : '';
    
    // Set status buttons
    document.querySelectorAll('.status-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.status-btn.${item.status}`).classList.add('active');
    
    document.getElementById('progressModal').classList.add('active');
}

function closeProgressModal() {
    document.getElementById('progressModal').classList.remove('active');
    currentTopicId = null;
}

function setStatus(status) {
    document.querySelectorAll('.status-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

async function saveProgress(itemId = null) {
    const targetId = itemId || currentTopicId;
    if (!targetId || !currentUser) return;
    
    const item = syllabusData.find(i => i.id === targetId);
    if (!item) return;
    
    let status, plannedHours, actualHours, notes;
    
    if (itemId) {
        // From tracker tab
        const plannedInput = document.querySelector(`.planned-hours[data-id="${itemId}"]`);
        const actualInput = document.querySelector(`.actual-hours[data-id="${itemId}"]`);
        const statusSelect = document.querySelector(`.status-select[data-id="${itemId}"]`);
        
        status = statusSelect.value;
        plannedHours = parseFloat(plannedInput.value) || item.estTime;
        actualHours = parseFloat(actualInput.value) || 0;
        notes = item.notes || '';
    } else {
        // From modal
        status = document.querySelector('.status-btn.active').classList[1];
        plannedHours = parseFloat(document.getElementById('plannedHoursInput').value) || item.estTime;
        actualHours = parseFloat(document.getElementById('actualHoursInput').value) || 0;
        notes = document.getElementById('progressNotes').value;
    }
    
    const completedDate = status === 'completed' ? new Date().toISOString().split('T')[0] : null;
    
    try {
        const progressRef = doc(db, 'userProgress', currentUser.uid);
        const docSnap = await getDoc(progressRef);
        const currentProgress = docSnap.exists() ? docSnap.data().progress : {};
        
        currentProgress[targetId] = {
            status: status,
            actualHours: actualHours,
            plannedHours: plannedHours,
            notes: notes,
            lastUpdated: serverTimestamp(),
            completedDate: completedDate
        };
        
        await updateDoc(progressRef, { progress: currentProgress });
        
        // Update local data
        const itemIndex = syllabusData.findIndex(i => i.id === targetId);
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
        
        // Update UI
        if (!itemId) {
            closeProgressModal();
        }
        
        loadSyllabusTable();
        updateDashboard();
        
        if (document.getElementById('trackerSubject').value === item.subject) {
            loadSubjectForTracker();
        }
        
        showNotification('Progress saved successfully!', 'success');
        
    } catch (error) {
        console.error('Error saving progress:', error);
        showNotification('Error saving progress', 'error');
    }
}

// Debounced save function
let saveTimeout;
function saveProgressDebounced(itemId) {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => saveProgress(itemId), 1000);
}

// Custom Topic Functions
function openCustomPlanModal() {
    document.getElementById('customPlanModal').classList.add('active');
}

function closeCustomPlanModal() {
    document.getElementById('customPlanModal').classList.remove('active');
    document.getElementById('customSubject').value = '';
    document.getElementById('customPriority').value = 'A';
    document.getElementById('customTopicName').value = '';
    document.getElementById('customSubtopicName').value = '';
    document.getElementById('customWeightage').value = '';
    document.getElementById('customPlannedHours').value = '';
    document.getElementById('customDescription').value = '';
}

async function saveCustomTopic() {
    const subject = document.getElementById('customSubject').value;
    const priority = document.getElementById('customPriority').value;
    const topicName = document.getElementById('customTopicName').value.trim();
    const subtopicName = document.getElementById('customSubtopicName').value.trim();
    const weightage = document.getElementById('customWeightage').value.trim() || '5-10%';
    const plannedHours = parseFloat(document.getElementById('customPlannedHours').value) || 1;
    const description = document.getElementById('customDescription').value.trim();
    
    if (!subject || !topicName || !subtopicName) {
        showNotification('Please fill required fields', 'error');
        return;
    }
    
    try {
        const customTopic = {
            userId: currentUser.uid,
            subject: subject,
            topic: topicName,
            subtopic: subtopicName,
            weightage: weightage,
            priority: priority,
            estTime: plannedHours,
            plannedHours: plannedHours,
            description: description,
            status: 'not-started',
            actualHours: 0,
            notes: '',
            isCustom: true,
            createdAt: serverTimestamp()
        };
        
        const docRef = await addDoc(collection(db, 'customTopics'), customTopic);
        
        // Add to local data
        syllabusData.push({
            id: docRef.id,
            ...customTopic
        });
        
        // Update progress
        const progressRef = doc(db, 'userProgress', currentUser.uid);
        const docSnap = await getDoc(progressRef);
        const currentProgress = docSnap.exists() ? docSnap.data().progress : {};
        
        currentProgress[docRef.id] = {
            status: 'not-started',
            actualHours: 0,
            plannedHours: plannedHours,
            notes: '',
            lastUpdated: serverTimestamp()
        };
        
        await updateDoc(progressRef, { progress: currentProgress });
        
        closeCustomPlanModal();
        showNotification('Custom topic added successfully!', 'success');
        
        // Update UI
        loadSyllabusTable();
        updateDashboard();
        
        if (document.getElementById('trackerSubject').value === subject) {
            loadSubjectForTracker();
        }
        
    } catch (error) {
        console.error('Error saving custom topic:', error);
        showNotification('Error saving custom topic', 'error');
    }
}

async function deleteCustomTopic(itemId) {
    if (!confirm('Are you sure you want to delete this custom topic?')) return;
    
    try {
        await deleteDoc(doc(db, 'customTopics', itemId));
        
        // Remove from progress
        const progressRef = doc(db, 'userProgress', currentUser.uid);
        const docSnap = await getDoc(progressRef);
        if (docSnap.exists()) {
            const currentProgress = docSnap.data().progress;
            delete currentProgress[itemId];
            await updateDoc(progressRef, { progress: currentProgress });
        }
        
        // Remove from local data
        syllabusData = syllabusData.filter(item => item.id !== itemId);
        
        showNotification('Custom topic deleted successfully!', 'success');
        
        // Update UI
        loadSyllabusTable();
        updateDashboard();
        
        if (document.getElementById('trackerSubject').value) {
            loadSubjectForTracker();
        }
        
    } catch (error) {
        console.error('Error deleting custom topic:', error);
        showNotification('Error deleting custom topic', 'error');
    }
}

// Video Functions
function openVideoForm() {
    document.getElementById('videoForm').style.display = 'block';
}

function closeVideoForm() {
    document.getElementById('videoForm').style.display = 'none';
    document.getElementById('videoTitle').value = '';
    document.getElementById('videoLink').value = '';
    document.getElementById('videoDescription').value = '';
}

async function loadVideos() {
    const videosList = document.getElementById('videosList');
    videosList.innerHTML = '<div class="loading">Loading videos...</div>';
    
    try {
        const videosQuery = query(
            collection(db, 'videos'),
            orderBy('createdAt', 'desc'),
            limit(50)
        );
        const videosSnapshot = await getDocs(videosQuery);
        
        if (videosSnapshot.empty) {
            videosList.innerHTML = `
                <div class="resource-card placeholder">
                    <i class="fas fa-video"></i>
                    <h4>No videos added yet</h4>
                    <p>Add your first video to get started</p>
                    <button class="btn-primary" onclick="openVideoForm()" style="margin-top: 20px;">
                        <i class="fas fa-plus"></i> Add Video
                    </button>
                </div>
            `;
            return;
        }
        
        videosList.innerHTML = '';
        videosSnapshot.forEach(doc => {
            const video = doc.data();
            const videoCard = document.createElement('div');
            videoCard.className = 'resource-card';
            videoCard.innerHTML = `
                <div class="resource-badge">${video.subject}</div>
                <div class="resource-type">
                    <i class="fas fa-${video.type === 'playlist' ? 'list' : 'play-circle'}"></i>
                    ${video.type}
                </div>
                <h4>${video.title}</h4>
                <p>${video.description || ''}</p>
                <div class="resource-meta">
                    <span><i class="fas fa-user"></i> ${video.addedByName || 'User'}</span>
                    <span><i class="fas fa-clock"></i> ${formatDate(video.createdAt)}</span>
                </div>
                <div class="resource-actions">
                    <a href="${video.link}" target="_blank" class="btn-play">
                        <i class="fas fa-play"></i> Play Video
                    </a>
                    ${video.addedBy === currentUser.uid ? 
                        `<button class="btn-delete" onclick="deleteVideo('${doc.id}')">
                            <i class="fas fa-trash"></i>
                        </button>` : ''
                    }
                </div>
            `;
            videosList.appendChild(videoCard);
        });
    } catch (error) {
        console.error('Error loading videos:', error);
        videosList.innerHTML = '<div class="error">Error loading videos</div>';
    }
}

async function addVideo() {
    const subject = document.getElementById('videoSubject').value;
    const type = document.getElementById('videoType').value;
    const title = document.getElementById('videoTitle').value.trim();
    const link = document.getElementById('videoLink').value.trim();
    const description = document.getElementById('videoDescription').value.trim();
    
    if (!title || !link) {
        showNotification('Please fill required fields', 'error');
        return;
    }
    
    try {
        await addDoc(collection(db, 'videos'), {
            subject: subject,
            type: type,
            title: title,
            link: link,
            description: description,
            addedBy: currentUser.uid,
            addedByName: currentUser.name || currentUser.userId,
            createdAt: serverTimestamp()
        });
        
        closeVideoForm();
        loadVideos();
        showNotification('Video added successfully!', 'success');
    } catch (error) {
        console.error('Error adding video:', error);
        showNotification('Error adding video', 'error');
    }
}

async function deleteVideo(videoId) {
    if (!confirm('Are you sure you want to delete this video?')) return;
    
    try {
        await deleteDoc(doc(db, 'videos', videoId));
        loadVideos();
        showNotification('Video deleted successfully!', 'success');
    } catch (error) {
        console.error('Error deleting video:', error);
        showNotification('Error deleting video', 'error');
    }
}

// Notes Functions
function openNotesForm() {
    document.getElementById('notesForm').style.display = 'block';
}

function closeNotesForm() {
    document.getElementById('notesForm').style.display = 'none';
    document.getElementById('notesTitle').value = '';
    document.getElementById('notesLink').value = '';
    document.getElementById('notesDescription').value = '';
}

async function loadNotes() {
    const notesList = document.getElementById('notesList');
    notesList.innerHTML = '<div class="loading">Loading notes...</div>';
    
    try {
        const notesQuery = query(
            collection(db, 'notes'),
            orderBy('createdAt', 'desc'),
            limit(50)
        );
        const notesSnapshot = await getDocs(notesQuery);
        
        if (notesSnapshot.empty) {
            notesList.innerHTML = `
                <div class="resource-card placeholder">
                    <i class="fas fa-file-alt"></i>
                    <h4>No notes added yet</h4>
                    <p>Add your first notes to get started</p>
                    <button class="btn-primary" onclick="openNotesForm()" style="margin-top: 20px;">
                        <i class="fas fa-plus"></i> Add Notes
                    </button>
                </div>
            `;
            return;
        }
        
        notesList.innerHTML = '';
        notesSnapshot.forEach(doc => {
            const note = doc.data();
            const noteCard = document.createElement('div');
            noteCard.className = 'resource-card';
            noteCard.innerHTML = `
                <div class="resource-badge">${note.subject}</div>
                <div class="resource-type">
                    <i class="fas fa-${note.format === 'pdf' ? 'file-pdf' : note.format === 'doc' ? 'file-word' : 'link'}"></i>
                    ${note.format}
                </div>
                <h4>${note.title}</h4>
                <p>${note.description || ''}</p>
                <div class="resource-meta">
                    <span><i class="fas fa-user"></i> ${note.addedByName || 'User'}</span>
                    <span><i class="fas fa-clock"></i> ${formatDate(note.createdAt)}</span>
                </div>
                <div class="resource-actions">
                    <a href="${note.link}" target="_blank" class="btn-play">
                        <i class="fas fa-external-link-alt"></i> Open Notes
                    </a>
                    ${note.addedBy === currentUser.uid ? 
                        `<button class="btn-delete" onclick="deleteNote('${doc.id}')">
                            <i class="fas fa-trash"></i>
                        </button>` : ''
                    }
                </div>
            `;
            notesList.appendChild(noteCard);
        });
    } catch (error) {
        console.error('Error loading notes:', error);
        notesList.innerHTML = '<div class="error">Error loading notes</div>';
    }
}

async function addNotes() {
    const subject = document.getElementById('notesSubject').value;
    const format = document.getElementById('notesFormat').value;
    const title = document.getElementById('notesTitle').value.trim();
    const link = document.getElementById('notesLink').value.trim();
    const description = document.getElementById('notesDescription').value.trim();
    
    if (!title || !link) {
        showNotification('Please fill required fields', 'error');
        return;
    }
    
    try {
        await addDoc(collection(db, 'notes'), {
            subject: subject,
            format: format,
            title: title,
            link: link,
            description: description,
            addedBy: currentUser.uid,
            addedByName: currentUser.name || currentUser.userId,
            createdAt: serverTimestamp()
        });
        
        closeNotesForm();
        loadNotes();
        showNotification('Notes added successfully!', 'success');
    } catch (error) {
        console.error('Error adding notes:', error);
        showNotification('Error adding notes', 'error');
    }
}

async function deleteNote(noteId) {
    if (!confirm('Are you sure you want to delete these notes?')) return;
    
    try {
        await deleteDoc(doc(db, 'notes', noteId));
        loadNotes();
        showNotification('Notes deleted successfully!', 'success');
    } catch (error) {
        console.error('Error deleting notes:', error);
        showNotification('Error deleting notes', 'error');
    }
}

// Planner Functions
function generateStudyPlan() {
    // This would generate an AI-based study plan
    showNotification('Study plan generation coming soon!', 'info');
}

function clearStudyPlan() {
    document.getElementById('studySchedule').innerHTML = `
        <div class="empty-state">
            <i class="fas fa-calendar"></i>
            <h4>No study plan generated yet</h4>
            <p>Use the calculator to generate a study schedule</p>
        </div>
    `;
}

function calculateStudyPlan() {
    const totalDays = parseInt(document.getElementById('totalDays').value) || 180;
    const dailyHours = parseFloat(document.getElementById('dailyHours').value) || 4;
    const startDate = document.getElementById('startDate').value;
    
    if (!startDate) {
        showNotification('Please select a start date', 'error');
        return;
    }
    
    const totalHours = syllabusData.reduce((sum, item) => sum + (item.plannedHours || item.estTime), 0);
    const requiredDays = Math.ceil(totalHours / dailyHours);
    const completionDate = new Date(startDate);
    completionDate.setDate(completionDate.getDate() + requiredDays);
    
    let html = `
        <div class="plan-summary">
            <div class="summary-item">
                <h5>Total Hours</h5>
                <div class="summary-value">${totalHours} hours</div>
            </div>
            <div class="summary-item">
                <h5>Required Days</h5>
                <div class="summary-value">${requiredDays} days</div>
            </div>
            <div class="summary-item">
                <h5>Daily Target</h5>
                <div class="summary-value">${dailyHours} hours/day</div>
            </div>
            <div class="summary-item">
                <h5>Completion Date</h5>
                <div class="summary-value">${completionDate.toLocaleDateString()}</div>
            </div>
        </div>
        
        <div class="plan-timeline">
            <h5>Recommended Schedule</h5>
    `;
    
    // Generate weekly schedule
    const subjects = ['Paper 1: FR', 'Paper 2: AFM', 'Paper 3: Audit', 'Paper 4: DT', 'Paper 5: IDT', 'Paper 6: IBS'];
    const weeks = Math.ceil(requiredDays / 7);
    
    for (let week = 1; week <= weeks; week++) {
        html += `
            <div class="week-plan">
                <h6>Week ${week}</h6>
                <div class="week-subjects">
                    ${subjects.map(subject => `
                        <span class="subject-tag">${subject.split(': ')[1]}</span>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    html += '</div>';
    document.getElementById('studySchedule').innerHTML = html;
    
    // Update daily targets
    updateDailyTargets(dailyHours);
}

function updateDailyTargets(dailyHours) {
    const targetsContainer = document.getElementById('dailyTargets');
    const subjects = ['Paper 1: FR', 'Paper 2: AFM', 'Paper 3: Audit', 'Paper 4: DT', 'Paper 5: IDT', 'Paper 6: IBS'];
    
    let html = '';
    
    subjects.forEach(subject => {
        const subjectItems = syllabusData.filter(item => item.subject === subject);
        const completed = subjectItems.filter(item => item.status === 'completed').length;
        const total = subjectItems.length;
        const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
        const hoursNeeded = subjectItems.reduce((sum, item) => 
            sum + (item.plannedHours || item.estTime) - (item.actualHours || 0), 0);
        const daysNeeded = Math.ceil(hoursNeeded / dailyHours);
        
        html += `
            <div class="target-item">
                <div class="target-header">
                    <div class="target-subject">${subject}</div>
                    <div class="target-days">${daysNeeded} days</div>
                </div>
                <div class="target-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${percent}%"></div>
                    </div>
                    <span>${completed}/${total} topics</span>
                </div>
            </div>
        `;
    });
    
    targetsContainer.innerHTML = html;
}

// UI Functions
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('expanded');
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
    document.getElementById(tabName + 'Tab').classList.add('active');
    
    // Set active nav item
    const navItem = document.querySelector(`.nav-item[onclick*="${tabName}"]`);
    if (navItem) {
        navItem.classList.add('active');
    }
    
    // Load data for specific tabs
    switch(tabName) {
        case 'videos':
            loadVideos();
            break;
        case 'notes':
            loadNotes();
            break;
        case 'dashboard':
            updateDashboard();
            break;
        case 'planner':
            calculateStudyPlan();
            break;
    }
     }
