// Gallery Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize gallery modal
    const galleryModal = document.getElementById('galleryModal');
    if (galleryModal) {
        galleryModal.addEventListener('show.bs.modal', function(event) {
            const button = event.relatedTarget;
            const imgSrc = button.getAttribute('data-bs-img');
            const modalImage = document.getElementById('modalImage');
            modalImage.src = imgSrc;
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add animation class when elements come into view
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.fade-in');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.classList.add('animated');
            }
        });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on page load
});

// Form Validation
function validateForm() {
    const requiredFields = document.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('is-invalid');
            isValid = false;
        } else {
            field.classList.remove('is-invalid');
        }
    });
    
    return isValid;
}

// Initialize form validation
const forms = document.querySelectorAll('form');
forms.forEach(form => {
    form.addEventListener('submit', function(e) {
        if (!validateForm()) {
            e.preventDefault();
        }
    });
});

// نظام إدارة الأيام
const dayInput = document.getElementById('day-input');
const addDayBtn = document.getElementById('add-day');
const daysContainer = document.getElementById('days-container');
const visitDaysInput = document.getElementById('visit-days');
let daysArray = [];

// تحميل أيام محفوظة إذا وجدت
if (localStorage.getItem('currentPatientDays')) {
    daysArray = JSON.parse(localStorage.getItem('currentPatientDays'));
    renderDays();
}

// إضافة يوم جديد
addDayBtn.addEventListener('click', addDay);
dayInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addDay();
    }
});

function addDay() {
    const dayValue = dayInput.value.trim();
    if (dayValue) {
        if (!daysArray.includes(dayValue)) {
            daysArray.push(dayValue);
            dayInput.value = '';
            renderDays();
            saveDaysToLocalStorage();
        } else {
            alert('هذا اليوم مضاف بالفعل!');
        }
    }
}

// عرض الأيام المضافة
function renderDays() {
    daysContainer.innerHTML = '';
    
    if (daysArray.length === 0) {
        daysContainer.innerHTML = '<p class="text-muted small mb-0">لا توجد أيام مضافة</p>';
    } else {
        daysArray.forEach((day, index) => {
            const dayBadge = document.createElement('div');
            dayBadge.className = 'day-badge';
            dayBadge.innerHTML = `
                ${day}
                <button type="button" class="btn-close" data-index="${index}" aria-label="حذف"></button>
            `;
            daysContainer.appendChild(dayBadge);
        });
    }
    
    // تحديث الحقل المخفي
    visitDaysInput.value = JSON.stringify(daysArray);
    
    // إضافة أحداث لحذف الأيام
    document.querySelectorAll('.day-badge .btn-close').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            daysArray.splice(index, 1);
            renderDays();
            saveDaysToLocalStorage();
        });
    });
}

// حفظ الأيام في localStorage
function saveDaysToLocalStorage() {
    localStorage.setItem('currentPatientDays', JSON.stringify(daysArray));
}

// نظام البحث عن المرضى
const patientSearch = document.getElementById('patient-search');
const searchBtn = document.getElementById('search-btn');
const searchResults = document.getElementById('search-results');

// بيانات وهمية للمرضى (ستستبدل بقاعدة بيانات حقيقية)
const mockPatients = [
    { 
        id: 1, 
        name: 'أحمد محمد', 
        age: 35, 
        diagnosis: 'آلام أسفل الظهر',
        medicalHistory: 'سكري من النوع الثاني',
        evaluation: 'يشكو من ألم مزمن في أسفل الظهر مع إشعاع للساق اليسرى',
        currentProblems: 'ألم أسفل الظهر، صعوبة في الوقوف لفترات طويلة',
        ptProgram: 'تمارين تقوية عضلات الظهر والبطن، علاج حراري، جلسات تدليك',
        ptName: 'د. علي عبدالرحمن',
        physician: 'د. محمد السيد',
        sessionPrice: 250,
        visitDays: ['السبت', 'الثلاثاء', 'الخميس']
    },
    { 
        id: 2, 
        name: 'سارة عبدالله', 
        age: 28, 
        diagnosis: 'إصابة كتف',
        medicalHistory: 'لا يوجد',
        evaluation: 'إصابة في الكتف الأيمن نتيجة حادث سيارة',
        currentProblems: 'ألم في الكتف الأيمن، صعوبة في رفع الذراع',
        ptProgram: 'تمارين مدى حركة، علاج بالموجات فوق الصوتية، تمارين تقوية',
        ptName: 'د. منى أحمد',
        physician: 'د. خالد محمود',
        sessionPrice: 200,
        visitDays: ['الأحد', 'الأربعاء']
    }
];

// البحث عن المرضى
searchBtn.addEventListener('click', searchPatients);
patientSearch.addEventListener('keyup', function(e) {
    if (e.key === 'Enter') {
        searchPatients();
    }
});

function searchPatients() {
    const searchTerm = patientSearch.value.trim().toLowerCase();
    if (searchTerm.length < 2) {
        alert('الرجاء إدخال至少 حرفين للبحث');
        return;
    }
    
    const results = mockPatients.filter(patient => 
        patient.name.toLowerCase().includes(searchTerm) || 
        patient.diagnosis.toLowerCase().includes(searchTerm)
    );
    
    displaySearchResults(results);
}

// عرض نتائج البحث
function displaySearchResults(results) {
    searchResults.innerHTML = '';
    
    if (results.length === 0) {
        searchResults.innerHTML = '<p class="text-center mb-0 py-2">لا توجد نتائج مطابقة</p>';
        searchResults.classList.remove('d-none');
        return;
    }
    
    results.forEach(patient => {
        const patientDiv = document.createElement('div');
        patientDiv.className = 'patient-result';
        patientDiv.innerHTML = `
            <h6 class="mb-1">${patient.name}</h6>
            <p class="mb-1 small">العمر: ${patient.age} سنة | التشخيص: ${patient.diagnosis}</p>
            <button class="btn btn-sm btn-outline-primary mt-1 load-patient" data-id="${patient.id}">
                <i class="fas fa-user-edit me-1"></i> تحميل البيانات
            </button>
        `;
        searchResults.appendChild(patientDiv);
    });
    
    searchResults.classList.remove('d-none');
    
    // إضافة أحداث لأزرار تحميل البيانات
    document.querySelectorAll('.load-patient').forEach(btn => {
        btn.addEventListener('click', function() {
            const patientId = parseInt(this.getAttribute('data-id'));
            loadPatientData(patientId);
        });
    });
}

// تحميل بيانات المريض
function loadPatientData(patientId) {
    const patient = mockPatients.find(p => p.id === patientId);
    if (!patient) return;
    
    // ملء حقول النموذج
    document.getElementById('patient-name').value = patient.name;
    document.getElementById('age').value = patient.age;
    document.getElementById('diagnosis').value = patient.diagnosis;
    document.getElementById('medical-history').value = patient.medicalHistory;
    document.getElementById('evaluation').value = patient.evaluation;
    document.getElementById('current-problems').value = patient.currentProblems;
    document.getElementById('pt-program').value = patient.ptProgram;
    document.getElementById('pt-name').value = patient.ptName;
    document.getElementById('physician').value = patient.physician;
    document.getElementById('session-price').value = patient.sessionPrice;
    
    // تحميل الأيام
    daysArray = patient.visitDays;
    renderDays();
    saveDaysToLocalStorage();
    
    // إخفاء نتائج البحث
    searchResults.classList.add('d-none');
    patientSearch.value = '';
    
    // التمرير إلى أعلى النموذج
    document.getElementById('appointment').scrollIntoView({ behavior: 'smooth' });
}