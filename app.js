// Global Variables
let currentUser = null;
let currentProgressView = 'overall';
let currentSubjectFilter = 'all';
let syllabusData = [];
let currentItemId = null;
let progressChart = null;
let subjectChart = null;

// Syllabus Data - Based on your provided table
const syllabus = [
    // Paper 1: FR
    { id: 'fr1', subject: 'Paper 1: FR', topic: 'Introduction to GPFS', subtopic: 'Ind AS 1 basics', weightage: '10-15%', priority: 'B', estTime: 4 },
    { id: 'fr2', subject: 'Paper 1: FR', topic: 'Introduction to GPFS', subtopic: 'Schedule III Div II', weightage: '10-15%', priority: 'B', estTime: 2 },
    { id: 'fr3', subject: 'Paper 1: FR', topic: 'Introduction to GPFS', subtopic: 'Applicability criteria', weightage: '10-15%', priority: 'B', estTime: 2 },
    { id: 'fr4', subject: 'Paper 1: FR', topic: 'Conceptual Framework', subtopic: 'Application to GPFS', weightage: '5-10%', priority: 'A', estTime: 6 },
    // ... Add all other syllabus items similarly
    // Paper 2: AFM
    { id: 'afm1', subject: 'Paper 2: AFM', topic: 'Financial Policy', subtopic: 'CFO role + Value creation', weightage: '8-15%', priority: 'B', estTime: 3 },
    { id: 'afm2', subject: 'Paper 2: AFM', topic: 'Financial Policy', subtopic: 'Strategic framework', weightage: '8-15%', priority: 'B', estTime: 3 },
    // Paper 3: Audit
    { id: 'audit1', subject: 'Paper 3: Audit', topic: 'Quality Control', subtopic: 'SQC 1 + SA 220', weightage: '45-55%', priority: 'A', estTime: 6 },
    // Paper 4: DT
    { id: 'dt1', subject: 'Paper 4: DT', topic: 'Company Taxation', subtopic: 'Computation - General Provisions', weightage: '40-45%', priority: 'A', estTime: 12 },
    // Paper 5: IDT
    { id: 'idt1', subject: 'Paper 5: IDT', topic: 'GST - Core Concepts', subtopic: 'Levy/Collection CGST/IGST', weightage: '45-65%', priority: 'A', estTime: 5 },
    // Paper 6: IBS
    { id: 'ibs1', subject: 'Paper 6: IBS', topic: 'Multi-disciplinary Cases', subtopic: 'FR + AFM + Audit + DT + IDT', weightage: '100%', priority: 'A', estTime: 60 }
];

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    // Check auth state
    auth.onAuthStateChanged(user => {
        if (user) {
            currentUser = user;
            loadUserData();
            showApp();
        } else {
            showLoginScreen();
        }
    });
    
    // Initialize syllabus data
    syllabusData = syllabus.map(item => ({
        ...item,
        status: 'not-started',
        actualHours: 0,
        notes: ''
    }));
});

// Auth Functions
function showSignup() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'block';
}

function showLogin() {
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
}

async function signup() {
    const id = document.getElementById('signupId').value.trim();
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    
    if (!id || !name || !email || !password) {
        alert('Please fill all fields');
        return;
    }
    
    try {
        // Create user in Firebase Auth
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Create user document in Firestore
        await db.collection('users').doc(user.uid).set({
            uid: user.uid,
            userId: id,
            name: name,
            email: email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            progress: {}
        });
        
        // Initialize progress for all syllabus items
        const progress = {};
        syllabusData.forEach(item => {
            progress[item.id] = {
                status: 'not-started',
                actualHours: 0,
                notes: '',
                lastUpdated: null
            };
        });
        
        await db.collection('userProgress').doc(user.uid).set({ progress });
        
        alert('Account created successfully! Please login.');
        showLogin();
    } catch (error) {
        alert('Error creating account: ' + error.message);
    }
}

async function login() {
    const userId = document.getElementById('loginId').value.trim();
    
    if (!userId) {
        alert('Please enter your ID');
        return;
    }
    
    try {
        // Find user by userId
        const usersSnapshot = await db.collection('users')
            .where('userId', '==', userId)
            .limit(1)
            .get();
        
        if (usersSnapshot.empty) {
            alert('User ID not found');
            return;
        }
        
        const userDoc = usersSnapshot.docs[0];
        const userData = userDoc.data();
        
        // For demo purposes, we'll skip password check
        // In production, you would use Firebase Auth signInWithEmailAndPassword
        currentUser = {
            uid: userData.uid,
            ...userData
        };
        
        loadUserData();
        showApp();
    } catch (error) {
        alert('Error logging in: ' + error.message);
    }
}

function showLoginScreen() {
    document.getElementById('loginScreen').classList.add('active');
    document.getElementById('appScreen').classList.remove('active');
    document.getElementById('loginId').value = '';
    document.getElementById('signupId').value = '';
    document.getElementById('signupName').value = '';
    document.getElementById('signupEmail').value = '';
    document.getElementById('signupPassword').value = '';
}

function showApp() {
    document.getElementById('loginScreen').classList.remove('active');
    document.getElementById('appScreen').classList.add('active');
    document.getElementById('userWelcome').textContent = `Welcome, ${currentUser.name || currentUser.userId}!`;
    loadDashboard();
    loadSyllabusTable();
    loadVideos();
    loadNotes();
}

async function logout() {
    try {
        await auth.signOut();
        currentUser = null;
        showLoginScreen();
    } catch (error) {
        alert('Error logging out: ' + error.message);
    }
}

// Data Loading Functions
async function loadUserData() {
    if (!currentUser) return;
    
    try {
        // Load user progress
        const progressDoc = await db.collection('userProgress').doc(currentUser.uid).get();
        if (progressDoc.exists) {
            const userProgress = progressDoc.data().progress;
            syllabusData = syllabusData.map(item => {
                const progress = userProgress[item.id] || { status: 'not-started', actualHours: 0, notes: '' };
                return {
                    ...item,
                    status: progress.status,
                    actualHours: progress.actualHours,
                    notes: progress.notes
                };
            });
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

// Dashboard Functions
function loadDashboard() {
    calculateKPIs();
    updateCharts();
    loadRecentActivity();
}

function calculateKPIs() {
    let totalPlanned = 0;
    let totalActual = 0;
    let completedTopics = 0;
    let totalTopics = syllabusData.length;
    
    syllabusData.forEach(item => {
        totalPlanned += item.estTime;
        totalActual += item.actualHours || 0;
        if (item.status === 'completed') {
            completedTopics++;
        }
    });
    
    const completionPercent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
    
    document.getElementById('plannedHours').textContent = totalPlanned;
    document.getElementById('actualHours').textContent = totalActual;
    document.getElementById('completionPercent').textContent = `${completionPercent}%`;
    document.getElementById('topicsDone').textContent = `${completedTopics}/${totalTopics}`;
    
    // Update sidebar progress
    updateSidebarProgress(completionPercent);
}

function updateSidebarProgress(percent) {
    const canvas = document.getElementById('overallProgressCircle');
    const ctx = canvas.getContext('2d');
    const textElem = document.getElementById('overallProgressText');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background circle
    ctx.beginPath();
    ctx.arc(30, 30, 28, 0, Math.PI * 2);
    ctx.strokeStyle = '#e9ecef';
    ctx.lineWidth = 4;
    ctx.stroke();
    
    // Draw progress arc
    ctx.beginPath();
    ctx.arc(30, 30, 28, -Math.PI / 2, (Math.PI * 2 * percent / 100) - Math.PI / 2);
    ctx.strokeStyle = getPriorityColor('A');
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.stroke();
    
    textElem.textContent = `${percent}%`;
}

function updateCharts() {
    // Destroy existing charts
    if (progressChart) progressChart.destroy();
    if (subjectChart) subjectChart.destroy();
    
    // Overall Progress Chart
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
                backgroundColor: [
                    '#4cc9f0',  // Success color
                    '#f72585',  // Warning color
                    '#e9ecef'   // Light gray
                ],
                borderWidth: 0
            }]
        },
        options: {
            cutout: '70%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.raw;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${context.label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
    
    // Subject Progress Chart
    const subjects = ['Paper 1: FR', 'Paper 2: AFM', 'Paper 3: Audit', 'Paper 4: DT', 'Paper 5: IDT', 'Paper 6: IBS'];
    const subjectProgress = subjects.map(subject => {
        const subjectItems = syllabusData.filter(item => item.subject === subject);
        if (subjectItems.length === 0) return 0;
        const completed = subjectItems.filter(item => item.status === 'completed').length;
        return Math.round((completed / subjectItems.length) * 100);
    });
    
    const subjectCtx = document.getElementById('subjectChart').getContext('2d');
    subjectChart = new Chart(subjectCtx, {
        type: 'bar',
        data: {
            labels: subjects.map(s => s.split(': ')[1]),
            datasets: [{
                label: 'Completion %',
                data: subjectProgress,
                backgroundColor: subjects.map((_, i) => getSubjectColor(i)),
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
            }
        }
    });
}

function loadRecentActivity() {
    const activityList = document.getElementById('recentActivity');
    activityList.innerHTML = '';
    
    // Get recently completed items
    const recentItems = syllabusData
        .filter(item => item.status === 'completed')
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
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        activityItem.innerHTML = `
            <i class="fas fa-check-circle text-success"></i>
            <span>Completed: ${item.subtopic} (${item.subject}) - ${item.actualHours} hours</span>
        `;
        activityList.appendChild(activityItem);
    });
}

// Syllabus Functions
function loadSyllabusTable() {
    const tableBody = document.getElementById('syllabusTableBody');
    tableBody.innerHTML = '';
    
    const filteredData = currentSubjectFilter === 'all' 
        ? syllabusData 
        : syllabusData.filter(item => item.subject === currentSubjectFilter);
    
    filteredData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.subject}</td>
            <td>${item.topic}</td>
            <td>${item.subtopic}</td>
            <td>${item.weightage}</td>
            <td><span class="priority-badge" style="background: ${getPriorityColor(item.priority)}">${item.priority}</span></td>
            <td>${item.estTime}</td>
            <td><span class="status-badge status-${item.status}">${formatStatus(item.status)}</span></td>
            <td>${item.actualHours || 0}</td>
            <td><button class="btn-update" onclick="openUpdateModal('${item.id}')"><i class="fas fa-edit"></i> Update</button></td>
        `;
        tableBody.appendChild(row);
    });
}

function filterSubjects() {
    currentSubjectFilter = document.getElementById('subjectFilter').value;
    loadSyllabusTable();
}

function getPriorityColor(priority) {
    switch(priority) {
        case 'A': return '#4361ee';
        case 'B': return '#4cc9f0';
        case 'C': return '#f72585';
        default: return '#6c757d';
    }
}

function getSubjectColor(index) {
    const colors = ['#4361ee', '#4cc9f0', '#f72585', '#7209b7', '#3a0ca3', '#560bad'];
    return colors[index % colors.length];
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
function openUpdateModal(itemId) {
    currentItemId = itemId;
    const item = syllabusData.find(i => i.id === itemId);
    if (!item) return;
    
    document.getElementById('statusSelect').value = item.status;
    document.getElementById('actualHoursInput').value = item.actualHours || '';
    document.getElementById('progressNotes').value = item.notes || '';
    
    document.getElementById('statusModal').classList.add('active');
}

function closeModal() {
    document.getElementById('statusModal').classList.remove('active');
    currentItemId = null;
}

async function saveProgress() {
    if (!currentItemId || !currentUser) return;
    
    const status = document.getElementById('statusSelect').value;
    const actualHours = parseFloat(document.getElementById('actualHoursInput').value) || 0;
    const notes = document.getElementById('progressNotes').value;
    
    // Update local data
    const itemIndex = syllabusData.findIndex(item => item.id === currentItemId);
    if (itemIndex !== -1) {
        syllabusData[itemIndex].status = status;
        syllabusData[itemIndex].actualHours = actualHours;
        syllabusData[itemIndex].notes = notes;
        
        // Update Firestore
        try {
            const progressRef = db.collection('userProgress').doc(currentUser.uid);
            const doc = await progressRef.get();
            const currentProgress = doc.exists ? doc.data().progress : {};
            
            currentProgress[currentItemId] = {
                status: status,
                actualHours: actualHours,
                notes: notes,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            await progressRef.set({ progress: currentProgress }, { merge: true });
            
            // Update UI
            loadSyllabusTable();
            calculateKPIs();
            updateCharts();
            loadRecentActivity();
            closeModal();
            
            showNotification('Progress updated successfully!', 'success');
        } catch (error) {
            console.error('Error saving progress:', error);
            showNotification('Error saving progress', 'error');
        }
    }
}

// Resource Functions
async function loadVideos() {
    const videosList = document.getElementById('videosList');
    videosList.innerHTML = '<p>Loading videos...</p>';
    
    try {
        const videosSnapshot = await db.collection('videos')
            .orderBy('createdAt', 'desc')
            .limit(20)
            .get();
        
        if (videosSnapshot.empty) {
            videosList.innerHTML = '<p class="no-resources">No videos added yet. Be the first to add one!</p>';
            return;
        }
        
        videosList.innerHTML = '';
        videosSnapshot.forEach(doc => {
            const video = doc.data();
            const videoCard = document.createElement('div');
            videoCard.className = 'resource-card';
            videoCard.innerHTML = `
                <div class="resource-badge">${video.subject}</div>
                <h4>${video.title}</h4>
                <p>${video.description || ''}</p>
                <div class="resource-actions">
                    <a href="${video.link}" target="_blank" class="btn-play">
                        <i class="fas fa-play"></i> Play
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
        videosList.innerHTML = '<p class="error">Error loading videos</p>';
    }
}

async function loadNotes() {
    const notesList = document.getElementById('notesList');
    notesList.innerHTML = '<p>Loading notes...</p>';
    
    try {
        const notesSnapshot = await db.collection('notes')
            .orderBy('createdAt', 'desc')
            .limit(20)
            .get();
        
        if (notesSnapshot.empty) {
            notesList.innerHTML = '<p class="no-resources">No notes added yet. Be the first to add some!</p>';
            return;
        }
        
        notesList.innerHTML = '';
        notesSnapshot.forEach(doc => {
            const note = doc.data();
            const noteCard = document.createElement('div');
            noteCard.className = 'resource-card';
            noteCard.innerHTML = `
                <div class="resource-badge">${note.subject}</div>
                <h4>${note.title}</h4>
                <p>${note.description || ''}</p>
                <div class="resource-actions">
                    <a href="${note.link}" target="_blank" class="btn-play">
                        <i class="fas fa-external-link-alt"></i> Open
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
        notesList.innerHTML = '<p class="error">Error loading notes</p>';
    }
}

function openVideoForm() {
    document.getElementById('videoForm').style.display = 'block';
}

function closeVideoForm() {
    document.getElementById('videoForm').style.display = 'none';
    document.getElementById('videoTitle').value = '';
    document.getElementById('videoLink').value = '';
}

async function addVideo() {
    const subject = document.getElementById('videoSubject').value;
    const title = document.getElementById('videoTitle').value.trim();
    const link = document.getElementById('videoLink').value.trim();
    const type = document.getElementById('videoType').value;
    
    if (!title || !link) {
        alert('Please fill all required fields');
        return;
    }
    
    try {
        await db.collection('videos').add({
            subject: subject,
            title: title,
            link: link,
            type: type,
            addedBy: currentUser.uid,
            addedByName: currentUser.name || currentUser.userId,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
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
        await db.collection('videos').doc(videoId).delete();
        loadVideos();
        showNotification('Video deleted successfully!', 'success');
    } catch (error) {
        console.error('Error deleting video:', error);
        showNotification('Error deleting video', 'error');
    }
}

function openNotesForm() {
    document.getElementById('notesForm').style.display = 'block';
}

function closeNotesForm() {
    document.getElementById('notesForm').style.display = 'none';
    document.getElementById('notesTitle').value = '';
    document.getElementById('notesLink').value = '';
    document.getElementById('notesDescription').value = '';
}

async function addNotes() {
    const subject = document.getElementById('notesSubject').value;
    const title = document.getElementById('notesTitle').value.trim();
    const link = document.getElementById('notesLink').value.trim();
    const description = document.getElementById('notesDescription').value.trim();
    
    if (!title || !link) {
        alert('Please fill all required fields');
        return;
    }
    
    try {
        await db.collection('notes').add({
            subject: subject,
            title: title,
            link: link,
            description: description,
            addedBy: currentUser.uid,
            addedByName: currentUser.name || currentUser.userId,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
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
        await db.collection('notes').doc(noteId).delete();
        loadNotes();
        showNotification('Notes deleted successfully!', 'success');
    } catch (error) {
        console.error('Error deleting notes:', error);
        showNotification('Error deleting notes', 'error');
    }
}

// Utility Functions
function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('collapsed');
    document.querySelector('.main-content').classList.toggle('expanded');
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
    document.querySelectorAll('.nav-item').forEach(navItem => {
        if (navItem.textContent.includes(tabName.charAt(0).toUpperCase() + tabName.slice(1))) {
            navItem.classList.add('active');
        }
    });
    
    // Update charts when switching to dashboard
    if (tabName === 'dashboard') {
        updateCharts();
    }
}

function setProgressView(view) {
    currentProgressView = view;
    
    // Update button states
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Update charts based on view
    updateCharts();
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4caf50' : '#f44336'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 3000;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add keyframe animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .priority-badge {
        display: inline-block;
        padding: 4px 10px;
        border-radius: 12px;
        color: white;
        font-size: 12px;
        font-weight: 600;
        min-width: 24px;
        text-align: center;
    }
    
    .no-resources {
        text-align: center;
        padding: 40px;
        color: var(--gray);
        font-style: italic;
    }
    
    .error {
        color: #f72585;
        text-align: center;
        padding: 20px;
    }
`;
document.head.appendChild(style);
